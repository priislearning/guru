import { z } from "zod";

// 6 Avatar Emotion States
export const EmotionSchema = z.enum([
  "neutral",
  "happy",
  "thinking",
  "encouraging",
  "surprised",
  "concerned",
]);
export type Emotion = z.infer<typeof EmotionSchema>;

// 5 Gesture States + none
export const GestureSchema = z.enum([
  "wave",
  "point_board",
  "nod",
  "thumbs_up",
  "shrug",
  "none",
]);
export type Gesture = z.infer<typeof GestureSchema>;

// Board Action Types
export const BoardActionTypeSchema = z.enum([
  "write_text",
  "draw_box",
  "draw_arrow",
  "draw_circle",
  "draw_axis",
  "plot_function",
  "draw_table",
  "highlight",
  "erase",
]);
export type BoardActionType = z.infer<typeof BoardActionTypeSchema>;

export const BoardActionSchema = z.object({
  type: BoardActionTypeSchema,
  params: z.record(z.any()), // e.g. text, x, y, width, height, from, to, label, fn, rows, cols
  sync_at: z.number().default(0), // seconds or phrase index when the visual element should appear
});
export type BoardAction = z.infer<typeof BoardActionSchema>;

// Prebuilt Demo Components
export const DemoComponentSchema = z.enum([
  "slider_graph",
  "drag_sort",
  "match_pairs",
  "step_through",
  "fill_in_blanks",
  "simple_simulation",
]);
export type DemoComponent = z.infer<typeof DemoComponentSchema>;

export const DemoSchema = z.object({
  component: DemoComponentSchema,
  params: z.record(z.any()),
});
export type Demo = z.infer<typeof DemoSchema>;

// Question Types
export const QuestionTypeSchema = z.enum([
  "mcq",
  "short_answer",
  "drag_drop",
  "explain_back",
]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const QuestionSchema = z.object({
  type: QuestionTypeSchema,
  text: z.string(),
  options: z.array(z.string()).optional(), // for mcq or drag_drop
  answer: z.string(), // expected answer or explanation rubric
  difficulty: z.number().min(1).max(5).default(1),
  concept: z.string(),
  explanation: z.string().optional(), // friendly reason why this answer is right
});
export type Question = z.infer<typeof QuestionSchema>;

export const MasteryUpdateSchema = z.object({
  concept: z.string(),
  delta: z.number(), // e.g. +5, +10, -5
});
export type MasteryUpdate = z.infer<typeof MasteryUpdateSchema>;

// Strict Full Tutor Turn Output Schema
export const TutorTurnSchema = z.object({
  speech: z.string().describe("What the avatar says, in learner's language, 1-3 short sentences"),
  emotion: EmotionSchema,
  gesture: GestureSchema,
  board_actions: z.array(BoardActionSchema).default([]),
  demo: DemoSchema.nullable().default(null),
  question: QuestionSchema.nullable().default(null),
  mastery_update: MasteryUpdateSchema.nullable().default(null),
  summary_notes: z.array(z.string()).optional(), // bullet notes for the Document tab
});
export type TutorTurn = z.infer<typeof TutorTurnSchema>;

// Chat Request Input
export interface ChatRequest {
  topic: string;
  language: string; // e.g. 'en-IN', 'hi-IN', 'ta-IN', etc.
  message?: string; // learner's message or answer
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
