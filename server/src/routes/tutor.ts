import { Router, Request, Response } from "express";
import { sarvamClient } from "../services/sarvam.js";
import { buildTutorSystemPrompt } from "../prompts/tutorPrompt.js";
import { TutorTurn, TutorTurnSchema, ChatRequest } from "../types/tutor.js";
import { generateTopicVisuals } from "../services/visualGenerator.js";

export const tutorRouter = Router();

/**
 * Extracts and parses JSON from potentially fence-wrapped or noisy LLM output
 */
function extractAndParseJSON(raw: string): any {
  let cleaned = raw.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  // Find first '{' and last '}'
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }

  return JSON.parse(cleaned);
}

/**
 * POST /api/tutor/chat
 * Main tutor orchestration endpoint
 */
tutorRouter.post("/chat", async (req: Request, res: Response) => {
  try {
    const {
      topic = "How photosynthesis works",
      language = "en-IN",
      message = "Hello, teacher!",
      conversationHistory = [],
      userProfile,
      teachingStyle = "normal",
      includeAudio = true,
    } = req.body as ChatRequest & { includeAudio?: boolean };

    const systemPrompt = buildTutorSystemPrompt(topic, language, userProfile, teachingStyle);

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-8), // keep recent context
      { role: "user", content: message },
    ];

    let tutorTurn: TutorTurn | null = null;
    let lastRawOutput = "";

    try {
      const rawOutput = await sarvamClient.chatCompletion(messages);
      lastRawOutput = rawOutput;
      console.log("Sarvam AI raw response:", rawOutput.substring(0, 150) + "...");

      try {
        const parsed = extractAndParseJSON(rawOutput);
        const validated = TutorTurnSchema.parse(parsed);
        tutorTurn = validated;

        // Ensure explanation turns never get interrupted by question popups
        const wantsQuiz = /quiz|test|exam|mcq|puzzle|ask me|check my|practice/i.test(message);
        if (!wantsQuiz && tutorTurn) {
          tutorTurn.question = null;
        }
      } catch (jsonErr: any) {
        // The LLM responded with conversational text instead of JSON schema.
        // Convert the actual AI response into a valid TutorTurn!
        console.log("LLM returned natural dialogue, wrapping into TutorTurn...");
        let cleanSpeech = rawOutput.trim();
        // Remove accidental JSON braces if present
        cleanSpeech = cleanSpeech.replace(/^\{.*?speech["']\s*:\s*["']/is, "").replace(/["']\s*,?\s*.*?\}$/is, "");
        if (cleanSpeech.startsWith("```")) {
          cleanSpeech = cleanSpeech.replace(/^```[a-z]*\s*/i, "").replace(/\s*```$/, "");
        }

        const isQuestion = cleanSpeech.includes("?");
        const isEncouraging = cleanSpeech.toLowerCase().includes("good") || cleanSpeech.toLowerCase().includes("great") || cleanSpeech.toLowerCase().includes("shabash") || cleanSpeech.toLowerCase().includes("correct");

        // Only trigger an MCQ quiz modal if the learner explicitly asked to be quizzed/tested,
        // so explanations never get interrupted by sudden popups!
        const wantsQuiz = /quiz|test|exam|mcq|puzzle|ask me|check my|practice/i.test(message);

        const visuals = generateTopicVisuals({
          topic,
          query: message,
          speech: cleanSpeech,
        });

        tutorTurn = {
          speech: cleanSpeech,
          emotion: isEncouraging ? "encouraging" : isQuestion ? "thinking" : "happy",
          gesture: isEncouraging ? "thumbs_up" : isQuestion ? "point_board" : "nod",
          board_actions: visuals.boardActions,
          demo: visuals.demo,
          question: wantsQuiz ? visuals.question : null,
          mastery_update: { concept: topic, delta: 5 },
          summary_notes: [cleanSpeech.substring(0, 120)],
        };
      }
    } catch (apiErr: any) {
      console.error("Sarvam chat completion error:", apiErr.message);
    }

    // Ultimate fallback only if API request completely failed
    if (!tutorTurn) {
      console.warn("Using fallback tutor turn");
      const wantsQuiz = /quiz|test|exam|mcq|puzzle|ask me|check my|practice/i.test(message);
      const visuals = generateTopicVisuals({
        topic,
        query: message,
        speech: `Let us explore ${topic} together! Look closely at the diagram on the board as we begin our step.`,
      });

      tutorTurn = {
        speech: `Let us explore ${topic} together! Look closely at the diagram on the board as we begin our step.`,
        emotion: "encouraging",
        gesture: "point_board",
        board_actions: visuals.boardActions,
        demo: visuals.demo,
        question: wantsQuiz ? visuals.question : null,
        mastery_update: { concept: topic, delta: 5 },
      };
    }

    // Parallel TTS generation if requested
    let audioPayload = null;
    if (includeAudio && tutorTurn.speech) {
      try {
        const tts = await sarvamClient.textToSpeech(tutorTurn.speech, language);
        audioPayload = {
          audioBase64: tts.audioBase64,
          format: tts.format,
          sampleRate: tts.sampleRate,
          isFallback: tts.isFallback || false,
        };
      } catch (audioErr: any) {
        console.warn("Audio generation failed, continuing without audio:", audioErr.message);
      }
    }

    res.json({
      success: true,
      turn: tutorTurn,
      audio: audioPayload,
    });
  } catch (err: any) {
    console.error("Error in /api/tutor/chat:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
