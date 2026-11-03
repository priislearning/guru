import React, { useState, useEffect } from "react";
import { useTutorStore } from "../../store/useTutorStore";
import { fetchServerConfig, updateServerApiKey, fetchTTS } from "../../services/api";
import { audioPlayer } from "../../services/audioPlayer";
import { X, Key, Volume2, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, language } = useTutorStore();
  const [apiKey, setApiKey] = useState("");
  const [hasServerKey, setHasServerKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isSettingsOpen) {
      fetchServerConfig()
        .then((cfg) => {
          setHasServerKey(cfg.hasSarvamKey);
        })
        .catch(() => {});
    }
  }, [isSettingsOpen]);

  if (!isSettingsOpen) return null;

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return;
    setIsSaving(true);
    try {
      const res = await updateServerApiKey(apiKey.trim());
      setHasServerKey(res.hasSarvamKey);
      setStatusMessage("Sarvam API key saved successfully!");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage("Failed to update key: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestAudio = async () => {
    setIsPlayingTest(true);
    try {
      const tts = await fetchTTS("नमस्ते! मैं आपका गुरु शिक्षक हूँ।", language);
      if (tts && tts.audioBase64) {
        await audioPlayer.playAudio(tts.audioBase64, () => {
          setIsPlayingTest(false);
        });
      }
    } catch (err) {
      console.warn("Audio test error:", err);
      setIsPlayingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Key className="w-4 h-4 text-amber-600" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Settings & Sarvam AI Key</h3>
              <p className="text-[11px] text-slate-400">Configure connection & audio hardware</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Connection Status */}
        <div
          className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-semibold ${
            hasServerKey
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            {hasServerKey
              ? "Sarvam AI API Key is ACTIVE! Using live models (sarvam-m, Bulbul, Saaras)."
              : "Running in Smart Demo Mode (Instant zero-latency responses with synthetic lip-sync)."}
          </span>
        </div>

        {/* API Key Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Sarvam API Key (Optional)</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your api-subscription-key here..."
            className="p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <p className="text-[10px] text-slate-400">
            Keys are proxied via Node.js backend; they are never exposed in browser requests.
          </p>
        </div>

        {statusMessage && (
          <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Audio Test */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
          <div>
            <h5 className="text-xs font-bold text-slate-800">Test Bulbul Speech Audio</h5>
            <p className="text-[10px] text-slate-500">Play a sample voice clip & verify Web Audio lip-sync</p>
          </div>
          <button
            onClick={handleTestAudio}
            disabled={isPlayingTest}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingTest ? "Playing..." : "Test Audio"}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSaveKey}
            disabled={!apiKey.trim() || isSaving}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSaving ? "Saving..." : "Save Key"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
