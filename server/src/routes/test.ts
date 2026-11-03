import { Router, Request, Response } from "express";
import { sarvamClient } from "../services/sarvam.js";

export const testRouter = Router();

/**
 * Diagnostic test route for LLM chat completion
 */
testRouter.get("/llm", async (req: Request, res: Response) => {
  try {
    const raw = await sarvamClient.chatCompletion([
      { role: "system", content: "You are a helpful tutor. Respond with a short greeting JSON: {\"greeting\": \"hello\"}" },
      { role: "user", content: "Say hello!" },
    ]);
    res.json({
      success: true,
      mode: sarvamClient.hasKey() ? "sarvam_live" : "demo_fallback",
      response: raw,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Diagnostic test route for Bulbul TTS
 */
testRouter.get("/tts", async (req: Request, res: Response) => {
  try {
    const text = (req.query.text as string) || "नमस्ते! मैं आपका गुरु हूँ।";
    const lang = (req.query.lang as string) || "hi-IN";
    const result = await sarvamClient.textToSpeech(text, lang);
    res.json({
      success: true,
      mode: sarvamClient.hasKey() ? "sarvam_live" : "synthetic_fallback",
      audioLength: result.audioBase64.length,
      sampleRate: result.sampleRate,
      format: result.format,
      audioBase64Sample: result.audioBase64.substring(0, 100) + "...",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Diagnostic test route for STT
 */
testRouter.get("/stt", async (req: Request, res: Response) => {
  try {
    const fakeBuffer = Buffer.from("dummy wav audio data");
    const result = await sarvamClient.speechToText(fakeBuffer, "test.wav", "hi-IN");
    res.json({
      success: true,
      mode: sarvamClient.hasKey() ? "sarvam_live" : "demo_fallback",
      transcript: result.transcript,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
