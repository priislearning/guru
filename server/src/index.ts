import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { testRouter } from "./routes/test.js";
import { voiceRouter } from "./routes/voice.js";
import { tutorRouter } from "./routes/tutor.js";
import { translateRouter } from "./routes/translate.js";
import { sarvamClient } from "./services/sarvam.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "GURU AI Tutor Backend",
    hasSarvamKey: sarvamClient.hasKey(),
    timestamp: new Date().toISOString(),
  });
});

// Key configuration / status endpoint
app.get("/api/config", (_req: Request, res: Response) => {
  res.json({
    hasSarvamKey: sarvamClient.hasKey(),
    mode: sarvamClient.hasKey() ? "live" : "demo_smart_fallback",
  });
});

app.post("/api/config/key", (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (typeof apiKey === "string") {
    sarvamClient.setApiKey(apiKey.trim());
    res.json({ success: true, hasSarvamKey: sarvamClient.hasKey() });
  } else {
    res.status(400).json({ error: "Invalid apiKey" });
  }
});

// Mount modular routes
app.use("/api/test", testRouter);
app.use("/api/voice", voiceRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/translate", translateRouter);

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  GURU Backend Proxy running on port ${PORT}`);
  console.log(`  Sarvam API Key status: ${sarvamClient.hasKey() ? "ACTIVE (Live Sarvam)" : "NOT SET (Smart Demo Mode)"}`);
  console.log(`===============================================`);
});
