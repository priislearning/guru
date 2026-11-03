import { Router, Request, Response } from "express";
import { sarvamClient } from "../services/sarvam.js";

export const translateRouter = Router();

/**
 * POST /api/translate
 * Body: { input: string, sourceLanguage: string, targetLanguage: string }
 */
translateRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { input, sourceLanguage = "en-IN", targetLanguage = "hi-IN" } = req.body;
    if (!input) {
      res.status(400).json({ error: "Input text is required" });
      return;
    }

    const translated = await sarvamClient.translate(input, sourceLanguage, targetLanguage);
    res.json({
      success: true,
      translated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
