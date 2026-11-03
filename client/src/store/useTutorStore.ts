import { create } from "zustand";
import { Emotion, Gesture, BoardAction, Demo, Question, TutorTurn, ChatMessage } from "../types/tutor";

interface UserProfile {
  grade: string;
  goal: string;
}

interface SessionStats {
  questionsAttempted: number;
  questionsCorrect: number;
  streak: number;
  timeSpentSec: number;
  weakAreas: string[];
  historyPoints: Array<{ time: string; accuracy: number }>;
}

interface TutorStore {
  // Session parameters
  language: string;
  topic: string;
  userProfile: UserProfile;
  teachingStyle: "normal" | "story" | "indian_analogy" | "step_by_step";

  // Avatar state
  emotion: Emotion;
  gesture: Gesture;
  avatarStatus: "idle" | "listening" | "thinking" | "speaking";
  mouthOpen: number;

  // Spoken text & subtitles
  subtitlesEnabled: boolean;
  currentSubtitle: string;

  // Live Whiteboard state
  boardActions: BoardAction[];
  summaryNotes: string[];

  // Interactive Demo state
  activeDemo: Demo | null;

  // Adaptive Question state
  currentQuestion: Question | null;
  isQuestionOpen: boolean;
  questionResult: { isCorrect: boolean; feedback: string } | null;

  // Progress & Mastery
  masteryScores: Record<string, number>;
  sessionStats: SessionStats;

  // Conversation history
  messages: ChatMessage[];

  // Modals & layout
  isDashboardOpen: boolean;
  isOnboardingOpen: boolean;
  isSettingsOpen: boolean;
  isChatCollapsed: boolean;

  // Actions
  setLanguage: (lang: string) => void;
  setTopic: (topic: string) => void;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setTeachingStyle: (style: "normal" | "story" | "indian_analogy" | "step_by_step") => void;
  setEmotion: (emotion: Emotion) => void;
  setGesture: (gesture: Gesture) => void;
  setAvatarStatus: (status: "idle" | "listening" | "thinking" | "speaking") => void;
  setMouthOpen: (val: number) => void;
  toggleSubtitles: () => void;
  setCurrentSubtitle: (text: string) => void;

  addBoardAction: (action: BoardAction) => void;
  setBoardActions: (actions: BoardAction[]) => void;
  clearBoard: () => void;
  addSummaryNote: (note: string) => void;

  setActiveDemo: (demo: Demo | null) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setQuestionOpen: (isOpen: boolean) => void;
  setQuestionResult: (result: { isCorrect: boolean; feedback: string } | null) => void;

  updateMastery: (concept: string, delta: number) => void;
  recordAnswer: (isCorrect: boolean, concept: string) => void;
  incrementTimeSpent: (seconds: number) => void;

  addMessage: (msg: ChatMessage) => void;
  setIsDashboardOpen: (open: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  toggleChatCollapsed: () => void;
}

const STORAGE_KEY_MASTERY = "guru_mastery_scores";
const STORAGE_KEY_STATS = "guru_session_stats";
const STORAGE_KEY_PROFILE = "guru_user_profile";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, val: any) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

export const useTutorStore = create<TutorStore>((set, get) => ({
  language: "en-IN",
  topic: "How photosynthesis works",
  userProfile: loadFromStorage<UserProfile>(STORAGE_KEY_PROFILE, {
    grade: "Grade 9-10 (High School)",
    goal: "Understand concept deeply with visuals",
  }),
  teachingStyle: "normal",

  emotion: "neutral",
  gesture: "none",
  avatarStatus: "idle",
  mouthOpen: 0,

  subtitlesEnabled: true,
  currentSubtitle: "",

  boardActions: [],
  summaryNotes: [],

  activeDemo: null,
  currentQuestion: null,
  isQuestionOpen: false,
  questionResult: null,

  masteryScores: loadFromStorage<Record<string, number>>(STORAGE_KEY_MASTERY, {
    "Introduction to Photosynthesis": 10,
    "Light Reactions & Photons": 0,
    "Calvin Cycle & Dark Reaction": 0,
    "Stomata & Gas Exchange": 0,
  }),
  sessionStats: loadFromStorage<SessionStats>(STORAGE_KEY_STATS, {
    questionsAttempted: 0,
    questionsCorrect: 0,
    streak: 0,
    timeSpentSec: 0,
    weakAreas: [],
    historyPoints: [
      { time: "Start", accuracy: 100 },
    ],
  }),

  messages: [],

  isDashboardOpen: false,
  isOnboardingOpen: false,
  isSettingsOpen: false,
  isChatCollapsed: false,

  setLanguage: (language) => set({ language }),
  setTopic: (topic) => set({ topic }),
  setUserProfile: (profile) =>
    set((state) => {
      const updated = { ...state.userProfile, ...profile };
      saveToStorage(STORAGE_KEY_PROFILE, updated);
      return { userProfile: updated };
    }),
  setTeachingStyle: (teachingStyle) => set({ teachingStyle }),

  setEmotion: (emotion) => set({ emotion }),
  setGesture: (gesture) => set({ gesture }),
  setAvatarStatus: (avatarStatus) => set({ avatarStatus }),
  setMouthOpen: (mouthOpen) => set({ mouthOpen }),
  toggleSubtitles: () => set((s) => ({ subtitlesEnabled: !s.subtitlesEnabled })),
  setCurrentSubtitle: (currentSubtitle) => set({ currentSubtitle }),

  addBoardAction: (action) =>
    set((state) => ({ boardActions: [...state.boardActions, action] })),
  setBoardActions: (boardActions) => set({ boardActions }),
  clearBoard: () => set({ boardActions: [] }),
  addSummaryNote: (note) =>
    set((state) => {
      if (state.summaryNotes.includes(note)) return state;
      return { summaryNotes: [...state.summaryNotes, note] };
    }),

  setActiveDemo: (activeDemo) => set({ activeDemo }),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setQuestionOpen: (isQuestionOpen) => set({ isQuestionOpen }),
  setQuestionResult: (questionResult) => set({ questionResult }),

  updateMastery: (concept, delta) =>
    set((state) => {
      const prev = state.masteryScores[concept] || 0;
      const next = Math.max(0, Math.min(100, prev + delta));
      const updated = { ...state.masteryScores, [concept]: next };
      saveToStorage(STORAGE_KEY_MASTERY, updated);
      return { masteryScores: updated };
    }),

  recordAnswer: (isCorrect, concept) =>
    set((state) => {
      const attempted = state.sessionStats.questionsAttempted + 1;
      const correct = state.sessionStats.questionsCorrect + (isCorrect ? 1 : 0);
      const streak = isCorrect ? state.sessionStats.streak + 1 : 0;
      const accuracy = Math.round((correct / attempted) * 100);

      const weakAreas = [...state.sessionStats.weakAreas];
      if (!isCorrect && !weakAreas.includes(concept)) {
        weakAreas.push(concept);
      } else if (isCorrect && weakAreas.includes(concept)) {
        const idx = weakAreas.indexOf(concept);
        weakAreas.splice(idx, 1);
      }

      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const historyPoints = [
        ...state.sessionStats.historyPoints,
        { time: nowTime, accuracy },
      ];

      const newStats: SessionStats = {
        questionsAttempted: attempted,
        questionsCorrect: correct,
        streak,
        timeSpentSec: state.sessionStats.timeSpentSec,
        weakAreas,
        historyPoints,
      };

      saveToStorage(STORAGE_KEY_STATS, newStats);

      // Adaptive style shift if repeated mistakes
      let teachingStyle = state.teachingStyle;
      if (!isCorrect && streak === 0 && attempted >= 2) {
        teachingStyle = "indian_analogy";
      }

      return { sessionStats: newStats, teachingStyle };
    }),

  incrementTimeSpent: (seconds) =>
    set((state) => {
      const newSec = state.sessionStats.timeSpentSec + seconds;
      const newStats = { ...state.sessionStats, timeSpentSec: newSec };
      saveToStorage(STORAGE_KEY_STATS, newStats);
      return { sessionStats: newStats };
    }),

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setIsDashboardOpen: (isDashboardOpen) => set({ isDashboardOpen }),
  setIsOnboardingOpen: (isOnboardingOpen) => set({ isOnboardingOpen }),
  setIsSettingsOpen: (isSettingsOpen) => set({ isSettingsOpen }),
  toggleChatCollapsed: () =>
    set((state) => ({ isChatCollapsed: !state.isChatCollapsed })),
}));
