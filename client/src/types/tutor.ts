export type Emotion =
  | "neutral"
  | "happy"
  | "thinking"
  | "encouraging"
  | "surprised"
  | "concerned";

export type Gesture =
  | "wave"
  | "point_board"
  | "nod"
  | "thumbs_up"
  | "shrug"
  | "none";

export type BoardActionType =
  | "write_text"
  | "draw_box"
  | "draw_arrow"
  | "draw_circle"
  | "draw_axis"
  | "plot_function"
  | "draw_table"
  | "highlight"
  | "erase";

export interface BoardAction {
  type: BoardActionType;
  params: Record<string, any>;
  sync_at: number;
}

export type DemoComponent =
  | "slider_graph"
  | "drag_sort"
  | "match_pairs"
  | "step_through"
  | "fill_in_blanks"
  | "simple_simulation";

export interface Demo {
  component: DemoComponent;
  params: Record<string, any>;
}

export type QuestionType =
  | "mcq"
  | "short_answer"
  | "drag_drop"
  | "explain_back";

export interface Question {
  type: QuestionType;
  text: string;
  options?: string[];
  answer: string;
  difficulty: number;
  concept: string;
  explanation?: string;
}

export interface MasteryUpdate {
  concept: string;
  delta: number;
}

export interface TutorTurn {
  speech: string;
  emotion: Emotion;
  gesture: Gesture;
  board_actions: BoardAction[];
  demo: Demo | null;
  question: Question | null;
  mastery_update: MasteryUpdate | null;
  summary_notes?: string[];
}

export interface AudioPayload {
  audioBase64: string;
  format: string;
  sampleRate: number;
  isFallback?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "tutor" | "user";
  text: string;
  timestamp: Date;
  emotion?: Emotion;
  audio?: AudioPayload | null;
}

export interface ChatRequest {
  topic: string;
  language: string;
  message?: string;
  conversationHistory?: Array<{
    role: "user" | "assistant" | "system";
    content: string;
  }>;
  userProfile?: {
    grade?: string;
    goal?: string;
    masteryScores?: Record<string, number>;
  };
  lastQuestion?: Question | null;
  teachingStyle?: "normal" | "story" | "indian_analogy" | "step_by_step";
}
