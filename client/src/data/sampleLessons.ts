export interface LessonTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export const SAMPLE_TOPICS: LessonTopic[] = [
  {
    id: "photosynthesis",
    title: "How photosynthesis works",
    description: "Learn how chloroplasts capture photons and split water to produce glucose and oxygen.",
    category: "Biology",
    icon: "🌿",
  },
  {
    id: "newton-laws",
    title: "Newton's Laws of Motion",
    description: "Explore inertia, F=ma, and action-reaction with cricket ball collisions.",
    category: "Physics",
    icon: "⚡",
  },
  {
    id: "binary-search",
    title: "Binary Search Algorithm",
    description: "Divide and conquer like searching names in a dictionary or Aadhaar registry.",
    category: "Computer Science",
    icon: "🔍",
  },
  {
    id: "pythagoras",
    title: "Pythagorean Theorem",
    description: "Visualize right-angled triangles using geometrical square rearrangement.",
    category: "Mathematics",
    icon: "📐",
  },
];
