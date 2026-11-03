import { ChatRequest, TutorTurn, AudioPayload } from "../types/tutor";

export interface ChatResponse {
  success: boolean;
  turn: TutorTurn;
  audio?: AudioPayload | null;
  error?: string;
}

export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch("/api/tutor/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...request,
      includeAudio: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server returned status ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function sendVoiceAudio(audioBlob: Blob, language: string): Promise<{ transcript: string }> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");
  formData.append("language", language);

  const response = await fetch("/api/voice/stt", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`STT failed: ${errorText}`);
  }

  return response.json();
}

export async function fetchTTS(text: string, language: string): Promise<AudioPayload> {
  const response = await fetch("/api/voice/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });

  if (!response.ok) {
    throw new Error(`TTS failed with status ${response.status}`);
  }

  return response.json();
}

export async function fetchServerConfig(): Promise<{ hasSarvamKey: boolean; mode: string }> {
  const response = await fetch("/api/config");
  return response.json();
}

export async function updateServerApiKey(apiKey: string): Promise<{ success: boolean; hasSarvamKey: boolean }> {
  const response = await fetch("/api/config/key", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });
  return response.json();
}
