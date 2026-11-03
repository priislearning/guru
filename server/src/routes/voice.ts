import { Router, Request, Response } from "express";
import multer from "multer";
import { sarvamClient } from "../services/sarvam.js";

export const voiceRouter = Router();

// Store uploaded audio in memory buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

/**
 * POST /api/voice/tts
 * Body: { text: string, language?: string, speaker?: string }
 */
voiceRouter.post("/tts", async (req: Request, res: Response) => {
  try {
    const { text, language = "en-IN", speaker } = req.body;
    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Text string is required" });
      return;
    }

    const ttsResult = await sarvamClient.textToSpeech(text, language, speaker);
    res.json({
      success: true,
      audioBase64: ttsResult.audioBase64,
      format: ttsResult.format,
      sampleRate: ttsResult.sampleRate,
      isFallback: ttsResult.isFallback || false,
    });
  } catch (err: any) {
    console.error("TTS endpoint error:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/voice/stt
 * Multipart form: audio file + optional language field
 */
voiceRouter.post("/stt", upload.single("audio"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Audio file is required" });
      return;
    }

    const languageCode = (req.body.language as string) || "unknown";
    const result = await sarvamClient.speechToText(
      req.file.buffer,
      req.file.originalname || "recording.wav",
      languageCode
    );

    res.json({
      success: true,
      transcript: result.transcript,
      isFallback: result.isFallback || false,
    });
  } catch (err: any) {
    console.error("STT endpoint error:", err);
    res.status(500).json({ error: err.message });
  }
});
