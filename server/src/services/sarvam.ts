import "dotenv/config";
import { TutorTurn, TutorTurnSchema } from "../types/tutor.js";

// Mapping of language codes to recommended Sarvam Bulbul v3 speakers
export const SARVAM_SPEAKERS: Record<string, string> = {
  "en-IN": "ritu",
  "hi-IN": "ritu",
  "ta-IN": "kavitha",
  "te-IN": "kavitha",
  "kn-IN": "kavitha",
  "ml-IN": "kavitha",
  "bn-IN": "priya",
  "mr-IN": "priya",
  "gu-IN": "priya",
  "pa-IN": "simran",
  "od-IN": "ritu",
};

export class SarvamService {
  private apiKey: string = "";
  private baseUrl: string = "https://api.sarvam.ai";

  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY || "";
    if (this.hasKey()) {
      console.log("SarvamService initialized with API Key.");
    } else {
      console.warn("SarvamService: SARVAM_API_KEY not found. Running in Smart Fallback / Demo Mode.");
    }
  }

  public setApiKey(key: string) {
    this.apiKey = key;
  }

  public getApiKey(): string {
    return this.apiKey || process.env.SARVAM_API_KEY || "";
  }

  public hasKey(): boolean {
    const k = this.getApiKey();
    return Boolean(k && k.trim().length > 5);
  }

  /**
   * Chat completions using Sarvam-M or fallback
   */
  async chatCompletion(
    messages: Array<{ role: string; content: string }>,
    options?: { temperature?: number; max_tokens?: number }
  ): Promise<string> {
    if (!this.hasKey()) {
      return this.generateFallbackChatResponse(messages);
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": this.getApiKey(),
        },
        body: JSON.stringify({
          model: "sarvam-105b-conversations",
          messages,
          temperature: options?.temperature ?? 0.3,
          max_completion_tokens: options?.max_tokens ?? 2048,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Sarvam Chat API error (${response.status}):`, errorText);
        throw new Error(`Sarvam Chat API responded with status ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as any;
      const rawContent = data.choices?.[0]?.message?.content || "";
      return rawContent;
    } catch (err: any) {
      console.warn("Falling back to smart demo completion due to error:", err.message);
      return this.generateFallbackChatResponse(messages);
    }
  }

  /**
   * Bulbul Text to Speech
   */
  async textToSpeech(
    text: string,
    languageCode: string = "en-IN",
    speaker?: string
  ): Promise<{ audioBase64: string; format: string; sampleRate: number; isFallback?: boolean }> {
    const chosenSpeaker = speaker || SARVAM_SPEAKERS[languageCode] || "ritu";

    if (this.hasKey()) {
      try {
        const payload = {
          inputs: [text],
          target_language_code: languageCode,
          speaker: chosenSpeaker,
          pitch: 0,
          pace: 1.0,
          loudness: 1.0,
          speech_sample_rate: 24000,
          enable_preprocessing: true,
          model: "bulbul:v3",
        };

        const response = await fetch(`${this.baseUrl}/text-to-speech`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": this.getApiKey(),
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const audioBase64 = data.audios?.[0] || data.audio;
          if (audioBase64) {
            return {
              audioBase64,
              format: "wav",
              sampleRate: 24000,
            };
          }
        } else {
          const errText = await response.text();
          console.warn(`Bulbul TTS failed (${response.status}): ${errText}`);
        }
      } catch (err: any) {
        console.warn("Bulbul TTS error, generating synthetic audio:", err.message);
      }
    }

    // High quality synthetic audio fallback (generates dynamic speech cadence for lip-sync)
    const fallbackBase64 = this.generateSyntheticAudioWav(text);
    return {
      audioBase64: fallbackBase64,
      format: "wav",
      sampleRate: 22050,
      isFallback: true,
    };
  }

  /**
   * Saarika / Saaras Speech to Text
   */
  async speechToText(
    audioBuffer: Buffer,
    filename: string = "recording.wav",
    languageCode: string = "unknown"
  ): Promise<{ transcript: string; isFallback?: boolean }> {
    if (this.hasKey()) {
      try {
        const formData = new FormData();
        const blob = new Blob([audioBuffer], { type: "audio/wav" });
        formData.append("file", blob, filename);
        formData.append("model", "saaras:v3");
        if (languageCode && languageCode !== "unknown") {
          formData.append("language_code", languageCode);
        }

        const response = await fetch(`${this.baseUrl}/speech-to-text`, {
          method: "POST",
          headers: {
            "api-subscription-key": this.getApiKey(),
          },
          body: formData,
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          return {
            transcript: data.transcript || data.text || "",
          };
        } else {
          const errText = await response.text();
          console.warn(`Saarika STT failed (${response.status}): ${errText}`);
        }
      } catch (err: any) {
        console.warn("Saarika STT error, falling back:", err.message);
      }
    }

    return {
      transcript: "I understood that chlorophyll traps solar energy to produce food!",
      isFallback: true,
    };
  }

  /**
   * Translate API
   */
  async translate(
    input: string,
    sourceLanguageCode: string,
    targetLanguageCode: string
  ): Promise<string> {
    if (this.hasKey()) {
      try {
        const response = await fetch(`${this.baseUrl}/translate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": this.apiKey,
          },
          body: JSON.stringify({
            input,
            source_language_code: sourceLanguageCode,
            target_language_code: targetLanguageCode,
            model: "sarvam-translate:v1",
            mode: "formal",
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          return data.translated_text || input;
        }
      } catch (err: any) {
        console.warn("Translate API error:", err.message);
      }
    }
    return input;
  }

  /**
   * Generates valid PCM WAV audio buffer base64 string with modulated speech formants
   * so the AnalyserNode lip-sync can visually articulate words naturally even in demo/offline mode.
   */
  private generateSyntheticAudioWav(text: string): string {
    const sampleRate = 22050;
    // Estimate duration: ~12 characters per second of speech
    const durationSec = Math.min(10, Math.max(1.8, text.length * 0.08));
    const numSamples = Math.floor(sampleRate * durationSec);
    const numChannels = 1;
    const bytesPerSample = 2; // 16-bit PCM
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * bytesPerSample;

    const buffer = Buffer.alloc(44 + dataSize);

    // RIFF identifier
    buffer.write("RIFF", 0);
    buffer.writeUInt32LE(36 + dataSize, 4);
    buffer.write("WAVE", 8);

    // "fmt " chunk
    buffer.write("fmt ", 12);
    buffer.writeUInt32LE(16, 16); // subchunk1 size
    buffer.writeUInt16LE(1, 20); // PCM format
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(byteRate, 28);
    buffer.writeUInt16LE(blockAlign, 32);
    buffer.writeUInt16LE(16, 34); // bits per sample

    // "data" chunk
    buffer.write("data", 36);
    buffer.writeUInt32LE(dataSize, 40);

    // Synthesize human voice-like formants: F0 fundamental (~180Hz) + formants (~700Hz, ~1300Hz)
    // with syllable rhythm modulation (~4Hz syllables)
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // Syllable envelope
      const syllableEnv = 0.5 + 0.5 * Math.sin(2 * Math.PI * 4.2 * t);
      // Soft fade in/out
      const ramp = Math.min(1, Math.min(t * 10, (durationSec - t) * 10));

      const f0 = 175 + 15 * Math.sin(2 * Math.PI * 1.5 * t);
      const v1 = Math.sin(2 * Math.PI * f0 * t);
      const v2 = 0.4 * Math.sin(2 * Math.PI * 720 * t);
      const v3 = 0.2 * Math.sin(2 * Math.PI * 1250 * t);

      const sampleVal = (v1 + v2 + v3) * syllableEnv * ramp * 0.35;
      const int16 = Math.max(-32768, Math.min(32767, Math.floor(sampleVal * 32767)));
      buffer.writeInt16LE(int16, offset);
      offset += 2;
    }

    return buffer.toString("base64");
  }

  /**
   * Smart fallback generator producing contextual, pedagogical JSON turns
   * for first-run demo (Photosynthesis) or any general topic.
   */
  private generateFallbackChatResponse(messages: Array<{ role: string; content: string }>): string {
    const lastUserMsg = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .pop() || "";

    const lower = lastUserMsg.toLowerCase();

    // Check if the user is answering a question
    if (lower.includes("chlorophyll") || lower.includes("water") || lower.includes("sunlight") || lower.includes("stomata") || lower.includes("glucose")) {
      const turn: TutorTurn = {
        speech: "Shabash! That is spot on. Chlorophyll in the leaves is the true master chef, absorbing sunlight to prepare glucose!",
        emotion: "encouraging",
        gesture: "thumbs_up",
        board_actions: [
          {
            type: "highlight",
            params: { target: "Chlorophyll", color: "#86efac" },
            sync_at: 0.5,
          },
          {
            type: "write_text",
            params: { text: "Glucose + Oxygen produced! 🌿", x: 140, y: 310, fontSize: 18, color: "#15803d" },
            sync_at: 1.5,
          },
        ],
        demo: {
          component: "slider_graph",
          params: {
            title: "Photosynthesis Rate vs Light Intensity",
            xLabel: "Sunlight (Lumens)",
            yLabel: "O2 Released (ml/min)",
            min: 0,
            max: 100,
            defaultValue: 65,
            formula: "saturation",
          },
        },
        question: {
          type: "mcq",
          text: "What gas do plants release into the air as a byproduct during this solar cooking process?",
          options: ["Carbon Dioxide (CO2)", "Oxygen (O2)", "Nitrogen (N2)", "Methane (CH4)"],
          answer: "Oxygen (O2)",
          difficulty: 2,
          concept: "Photosynthesis Byproducts",
          explanation: "Plants split water molecules using solar energy, releasing life-giving Oxygen gas into the atmosphere!",
        },
        mastery_update: {
          concept: "Chlorophyll & Light Reaction",
          delta: 15,
        },
        summary_notes: [
          "Chlorophyll pigment traps solar energy in thylakoid disks.",
          "Water molecules (H2O) are split, releasing Oxygen (O2).",
          "Carbon dioxide (CO2) from air is fixed into Glucose (energy food).",
        ],
      };
      return JSON.stringify(turn);
    }

    // Default first turn: Introduction to Photosynthesis
    const turn: TutorTurn = {
      speech: "Namaste! Welcome to GURU. Today let us explore how green plants capture sunlight to create life-giving food—just like a solar-powered kitchen in every leaf!",
      emotion: "happy",
      gesture: "wave",
      board_actions: [
        {
          type: "draw_box",
          params: { label: "Plant Leaf Cell (Chloroplast)", x: 80, y: 70, width: 340, height: 180, color: "#16a34a" },
          sync_at: 0.5,
        },
        {
          type: "write_text",
          params: { text: "Sunlight (Photons) ☀️", x: 90, y: 110, fontSize: 16, color: "#ea580c" },
          sync_at: 1.0,
        },
        {
          type: "draw_arrow",
          params: { from: [160, 120], to: [220, 160], label: "Absorbed by Chlorophyll", color: "#16a34a" },
          sync_at: 1.8,
        },
        {
          type: "write_text",
          params: { text: "6CO2 + 6H2O ➔ C6H12O6 + 6O2", x: 90, y: 210, fontSize: 16, color: "#0f766e" },
          sync_at: 2.5,
        },
      ],
      demo: {
        component: "simple_simulation",
        params: {
          title: "Virtual Chloroplast Reactor",
          sliders: [
            { name: "Sunlight", min: 0, max: 100, default: 50, unit: "%" },
            { name: "Water Supply", min: 0, max: 100, default: 70, unit: "ml" },
            { name: "CO2 Concentration", min: 0, max: 100, default: 40, unit: "ppm" },
          ],
        },
      },
      question: {
        type: "mcq",
        text: "Which green pigment inside plant cells absorbs photons of sunlight to kickstart photosynthesis?",
        options: ["Hemoglobin", "Chlorophyll", "Melanin", "Carotene"],
        answer: "Chlorophyll",
        difficulty: 1,
        concept: "Light Absorption",
        explanation: "Chlorophyll gives leaves their lush green color and captures sunlight energy!",
      },
      mastery_update: {
        concept: "Introduction to Photosynthesis",
        delta: 10,
      },
      summary_notes: [
        "Photosynthesis occurs inside specialized organelles called chloroplasts.",
        "Chemical equation: 6CO2 + 6H2O + Light ➔ C6H12O6 (Glucose) + 6O2.",
      ],
    };

    return JSON.stringify(turn);
  }
}

export const sarvamClient = new SarvamService();
