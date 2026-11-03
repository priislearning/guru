# 🎓 GURU: Lifelike Multilingual AI Avatar Tutor

> **Sarvam AI Hackathon Submission**  
> An adaptive, multimodal AI tutor pairing a 2D animated avatar with real-time lip-sync, an animated synchronized whiteboard, prebuilt interactive simulations, and push-to-talk voice conversation across 11 Indian languages.

---

## 🌟 Highlights & Core Experience

1. **2D Animated Avatar ("Guru")**:
   - Layered responsive SVG rig with Nehru vest and teacher aesthetics.
   - **Real-Time Lip-Sync**: Streams TTS audio through the Web Audio API, reads audio amplitude via an `AnalyserNode`, and drives mouth openness and visemes in real time.
   - **6 Facial Emotion States**: `happy`, `neutral`, `thinking`, `encouraging`, `surprised`, `concerned` (adjusts eyebrows, eye squinting, gaze, mouth curves).
   - **5 Gestures**: `wave` (friendly greeting), `point_board` (points directly at whiteboard), `nod` (head bob), `thumbs_up` (approval), and `shrug` (puzzled).
   - **Idle Liveness**: Natural periodic eye blinking and subtle breathing animations so the avatar never looks frozen.
   - **Visual State Indicators**: Sonic waves when listening and glowing aura halo when thinking.

2. **Multilingual Voice Conversation (Sarvam AI)**:
   - Supports **11 Indian Languages**: English (`en-IN`), Hindi (`hi-IN`), Tamil (`ta-IN`), Telugu (`te-IN`), Kannada (`kn-IN`), Malayalam (`ml-IN`), Bengali (`bn-IN`), Marathi (`mr-IN`), Gujarati (`gu-IN`), Punjabi (`pa-IN`), Odia (`od-IN`).
   - Seamless **Code-Mixing (Hinglish/Tanglish)** support in both prompt understanding and spoken output.
   - **Bulbul TTS**: Expressive Indic voices with natural pitch, pace, and rhythm.
   - **Saarika / Saaras STT**: Push-to-talk microphone audio transcription.
   - **Mid-Session Language Switcher**: Switch from English to Hindi or Tamil mid-explanation without losing conversation context or concept mastery.
   - **Live Subtitles**: Toggleable realtime subtitles display.

3. **Synchronized Live Whiteboard**:
   - Structured JSON action engine executing: `write_text`, `draw_box`, `draw_arrow`, `draw_circle`, `draw_axis`, `plot_function`, `draw_table`, `highlight`, and `erase`.
   - **Speech Synced (`sync_at`)**: Diagrams and annotations appear exactly when the corresponding spoken explanation is delivered.
   - **Document Tab**: Generates clean, formatted textbook notes with equations and bullet points, complete with a **Download as PDF / Print** button.

4. **Prebuilt Interactive Demo Library**:
   - **Slider Graph Demo**: Real-time parameter slider adjusting curves with live tutor commentary.
   - **Biological Simulation Demo**: Chloroplast reactor with Sunlight, Water, and CO₂ inputs illustrating Liebig's Law of the Minimum, rising O₂ bubbles, and Glucose gauge.
   - **Drag & Sort Demo**: Sequence stages of photosynthesis with instant verification and celebratory confetti.
   - **Match Pairs Demo**: Connect organelle structures (Thylakoid, Stroma, Stomata) to their functions.
   - **Step-Through Pathway Demo**: Step-by-step examination of multistage biochemical and algorithmic pathways.

5. **Personalisation & Adaptive Questioning**:
   - Initial onboarding to set grade level, language, and learning goal.
   - Persistent per-concept mastery scores (0–100%) stored in `localStorage`.
   - After each conceptual chunk, GURU poses an adaptive check (MCQ, short spoken answer, drag-drop, explain in own words).
   - Instant multi-sensory feedback: emotion change + gesture + one-line spoken encouragement + explanation banner.
   - If a learner struggles, GURU automatically pivots teaching style to relatable Indian daily-life analogies (cricket, chai-making, street food, monsoon).

6. **Progress Dashboard**:
   - Accuracy percentage, consecutive answer streak, active session time, and concept breakdown.
   - Weak areas diagnostic highlighting topics requiring review.
   - Spoken summary trigger and 3 suggested next topics.

---

## 🏗️ Architecture

```
User (Voice / Interaction)
      │
      ▼
Client (React + Vite + Tailwind + Zustand + Web Audio API)
      │
      ▼ (Proxied via /api)
Server (Node.js + Express Proxy)
      │
      ├──> Sarvam-M Chat API (Strict JSON schema validated with Zod)
      ├──> Bulbul TTS API (11 Indic voices, WAV base64)
      └──> Saaras/Saarika STT API (Multipart voice audio recognition)
```

> **Zero-Configuration Demo Mode**: If no `SARVAM_API_KEY` is supplied, the backend runs in Smart Fallback Mode, generating synthesized speech waveforms for Web Audio lip-sync and curated pedagogical turns so GURU is 100% demo-ready instantly!

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 1. Clone & Install
```bash
cd guru
npm run install:all
```

### 2. Environment Variables (Optional)
To use live Sarvam AI endpoints, configure `server/.env`:
```env
SARVAM_API_KEY=your_sarvam_api_key_here
PORT=5000
```
*(You can also set or change your API key directly in the web app via the Settings modal!)*

### 3. Run Development Servers
Open two terminals or run:
```bash
# Terminal 1: Backend proxy
npm run dev:server

# Terminal 2: Frontend Vite
npm run dev:client
```
- Frontend runs at: **http://localhost:3000**
- Backend runs at: **http://localhost:5000**

---

## 🧪 Testing Endpoints & Features

### Automated Test Routes
- `GET http://localhost:5000/api/health` — Checks server status and key presence
- `GET http://localhost:5000/api/test/llm` — Diagnostic check for LLM response & schema
- `GET http://localhost:5000/api/test/tts` — Diagnostic check for Bulbul voice audio
- `GET http://localhost:5000/api/test/stt` — Diagnostic check for Saarika transcription
- `POST http://localhost:5000/api/tutor/chat` — Full tutor turn orchestration

### User Experience Walkthrough
1. **Launch**: Navigate to `http://localhost:3000`. On first load, select your grade, goal, and language in the Onboarding modal.
2. **First-run Lesson**: Guru welcomes you with animated voice and begins drawing the Photosynthesis chloroplast on the live whiteboard.
3. **Whiteboard & Lip-Sync**: Watch the mouth articulate words matching the Bulbul audio, while arrows and text appear in sync with speech markers.
4. **Interactive Demos**: Click the "Interactive Demo" tab to adjust Sunlight and Water sliders and watch the oxygen output change.
5. **Adaptive Question**: Answer the understanding check; observe Guru's instantaneous thumbs-up reaction, confetti, and mastery increment.
6. **Language Switch**: Pick Hindi (`हिन्दी`) or Tamil (`தமிழ்`) from the header dropdown; Guru adapts spoken voice and subtitles on the fly.
7. **Notes & PDF**: Click "Lesson Notes" in the whiteboard panel and press "Download PDF" to print formatted study sheets.
8. **Dashboard**: Click the Mastery badge to inspect accuracy trends, streak, and recommended next topics.
