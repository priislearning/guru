import { BoardAction, Demo, Question } from "../types/tutor.js";

export interface VisualContext {
  topic: string;
  query: string;
  speech: string;
}

export function generateTopicVisuals(ctx: VisualContext): {
  boardActions: BoardAction[];
  demo: Demo | null;
  question: Question | null;
} {
  const combined = `${ctx.topic} ${ctx.query} ${ctx.speech}`.toLowerCase();

  // 1. PHOTOSYNTHESIS / CHLOROPHYLL / PLANT / LEAF / LIGHT
  if (
    combined.includes("chlorophyll") ||
    combined.includes("photosynthesis") ||
    combined.includes("plant") ||
    combined.includes("leaf") ||
    combined.includes("leaves") ||
    combined.includes("stomata") ||
    combined.includes("green") ||
    combined.includes("sunlight")
  ) {
    const isAutumn = combined.includes("autumn") || combined.includes("color") || combined.includes("orange");
    const isStomata = combined.includes("stomata") || combined.includes("gas");

    const boardActions: BoardAction[] = [
      {
        type: "draw_box",
        params: {
          label: "Plant Leaf Cell (Chloroplast)",
          x: 60,
          y: 65,
          width: 480,
          height: 250,
          color: "#16a34a",
        },
        sync_at: 0.3,
      },
      {
        type: "draw_circle",
        params: {
          label: isAutumn ? "Carotene / Xanthophyll" : "Chlorophyll (Green)",
          cx: 210,
          cy: 185,
          r: 44,
          color: isAutumn ? "#ea580c" : "#15803d",
        },
        sync_at: 0.8,
      },
      {
        type: "draw_arrow",
        params: {
          from: [80, 80],
          to: [170, 150],
          label: "Sunlight Photons (Energy)",
          color: "#ea580c",
        },
        sync_at: 1.5,
      },
      {
        type: "draw_circle",
        params: {
          label: "H₂O Water",
          cx: 120,
          cy: 250,
          r: 26,
          color: "#0284c7",
        },
        sync_at: 2.0,
      },
      {
        type: "draw_arrow",
        params: {
          from: [255, 185],
          to: [370, 185],
          label: "Photolysis: Splits H₂O ➔ O₂ ↑",
          color: "#0284c7",
        },
        sync_at: 2.5,
      },
      {
        type: "draw_box",
        params: {
          label: "Glucose Synthesis (Food)",
          x: 370,
          y: 140,
          width: 155,
          height: 90,
          color: "#ca8a04",
        },
        sync_at: 3.0,
      },
      {
        type: "write_text",
        params: {
          text: "6CO₂ + 6H₂O + Solar Energy ➔ C₆H₁₂O₆ + 6O₂",
          x: 80,
          y: 355,
          fontSize: 17,
          color: "#047857",
        },
        sync_at: 3.5,
      },
      {
        type: "highlight",
        params: {
          target: "Chlorophyll",
          x: 160,
          y: 135,
          width: 100,
          height: 100,
          color: "#86efac",
        },
        sync_at: 4.0,
      },
    ];

    const demo: Demo = {
      component: "simple_simulation",
      params: {
        title: "Virtual Chloroplast Reactor",
      },
    };

    const question: Question = {
      type: "mcq",
      text: "What pigment inside the chloroplast gives leaves their green color and traps solar energy?",
      options: ["Hemoglobin", "Chlorophyll", "Melanin", "Anthocyanin"],
      answer: "Chlorophyll",
      difficulty: 1,
      concept: "Chlorophyll Pigment",
      explanation: "Chlorophyll reflects green light while absorbing red and blue photons to drive food production!",
    };

    return { boardActions, demo, question };
  }

  // 2. NEWTON'S LAWS / FORCE / MOTION / ACCELERATION / GRAVITY
  if (
    combined.includes("newton") ||
    combined.includes("motion") ||
    combined.includes("force") ||
    combined.includes("gravity") ||
    combined.includes("inertia") ||
    combined.includes("acceleration")
  ) {
    const boardActions: BoardAction[] = [
      {
        type: "write_text",
        params: {
          text: "Newton's 2nd Law of Motion: F = m × a",
          x: 120,
          y: 60,
          fontSize: 20,
          color: "#1e1b4b",
        },
        sync_at: 0.3,
      },
      {
        type: "draw_box",
        params: {
          label: "Mass m (Cricket Ball)",
          x: 180,
          y: 130,
          width: 160,
          height: 90,
          color: "#4f46e5",
        },
        sync_at: 0.8,
      },
      {
        type: "draw_arrow",
        params: {
          from: [80, 175],
          to: [180, 175],
          label: "Applied Force (F)",
          color: "#ea580c",
        },
        sync_at: 1.5,
      },
      {
        type: "draw_arrow",
        params: {
          from: [340, 175],
          to: [460, 175],
          label: "Acceleration (a = F/m)",
          color: "#16a34a",
        },
        sync_at: 2.2,
      },
      {
        type: "draw_axis",
        params: {
          x: 80,
          y: 350,
          width: 220,
          height: 100,
          xLabel: "Force (N)",
          yLabel: "Accel (m/s²)",
        },
        sync_at: 2.8,
      },
      {
        type: "write_text",
        params: {
          text: "3rd Law: For every action, an equal and opposite reaction!",
          x: 100,
          y: 375,
          fontSize: 15,
          color: "#b91c1c",
        },
        sync_at: 3.5,
      },
    ];

    const demo: Demo = {
      component: "slider_graph",
      params: {
        title: "Newton's 2nd Law: Force vs Acceleration (F = ma)",
        xLabel: "Applied Force (Newtons)",
        yLabel: "Acceleration (m/s²)",
        min: 0,
        max: 100,
        defaultValue: 50,
      },
    };

    const question: Question = {
      type: "mcq",
      text: "If you push an object with twice the force while keeping mass constant, what happens to its acceleration?",
      options: ["It halves", "It stays the same", "It doubles", "It drops to zero"],
      answer: "It doubles",
      difficulty: 2,
      concept: "Newton's Second Law",
      explanation: "By F = m × a, acceleration is directly proportional to applied force!",
    };

    return { boardActions, demo, question };
  }

  // 3. BINARY SEARCH / ALGORITHMS / CODE / SORTING
  if (
    combined.includes("binary") ||
    combined.includes("search") ||
    combined.includes("algorithm") ||
    combined.includes("sort") ||
    combined.includes("divide")
  ) {
    const boardActions: BoardAction[] = [
      {
        type: "write_text",
        params: {
          text: "Binary Search: Divide & Conquer (O(log N))",
          x: 100,
          y: 55,
          fontSize: 20,
          color: "#581c87",
        },
        sync_at: 0.3,
      },
      {
        type: "draw_table",
        params: {
          headers: ["Idx 0", "Idx 1", "Idx 2", "Idx 3", "Idx 4", "Idx 5", "Idx 6"],
          rows: [["4", "12", "25", "37", "52", "68", "91"]],
          x: 60,
          y: 110,
        },
        sync_at: 0.8,
      },
      {
        type: "draw_arrow",
        params: {
          from: [80, 220],
          to: [80, 170],
          label: "Low (0)",
          color: "#0284c7",
        },
        sync_at: 1.5,
      },
      {
        type: "draw_arrow",
        params: {
          from: [200, 95],
          to: [200, 110],
          label: "Mid = 3 (Target: 37)",
          color: "#ea580c",
        },
        sync_at: 2.2,
      },
      {
        type: "draw_arrow",
        params: {
          from: [320, 220],
          to: [320, 170],
          label: "High (6)",
          color: "#16a34a",
        },
        sync_at: 2.8,
      },
      {
        type: "write_text",
        params: {
          text: "Half of elements eliminated each step ➔ 1 million items in ~20 steps!",
          x: 70,
          y: 280,
          fontSize: 15,
          color: "#4338ca",
        },
        sync_at: 3.5,
      },
    ];

    const demo: Demo = {
      component: "step_through",
      params: {
        title: "Binary Search Step-Through",
      },
    };

    const question: Question = {
      type: "mcq",
      text: "What essential precondition must an array satisfy before Binary Search can be applied?",
      options: ["Elements must be sorted", "All numbers must be even", "Array size must be 100", "No duplicates allowed"],
      answer: "Elements must be sorted",
      difficulty: 1,
      concept: "Sorted Array Requirement",
      explanation: "Binary search relies on order to know whether to discard the left or right half!",
    };

    return { boardActions, demo, question };
  }

  // 4. PYTHAGORAS / TRIANGLE / MATH
  if (
    combined.includes("pythagor") ||
    combined.includes("triangle") ||
    combined.includes("hypotenuse") ||
    combined.includes("geometry")
  ) {
    const boardActions: BoardAction[] = [
      {
        type: "write_text",
        params: {
          text: "Pythagorean Theorem: a² + b² = c²",
          x: 130,
          y: 60,
          fontSize: 20,
          color: "#0f172a",
        },
        sync_at: 0.3,
      },
      {
        type: "draw_box",
        params: {
          label: "a² = 9",
          x: 100,
          y: 150,
          width: 70,
          height: 70,
          color: "#0284c7",
        },
        sync_at: 0.8,
      },
      {
        type: "draw_box",
        params: {
          label: "b² = 16",
          x: 170,
          y: 220,
          width: 90,
          height: 90,
          color: "#ea580c",
        },
        sync_at: 1.5,
      },
      {
        type: "draw_box",
        params: {
          label: "c² = 25 (Hypotenuse)",
          x: 270,
          y: 130,
          width: 110,
          height: 110,
          color: "#16a34a",
        },
        sync_at: 2.2,
      },
      {
        type: "write_text",
        params: {
          text: "For any right-angled triangle: Sum of square of legs = Square of hypotenuse",
          x: 60,
          y: 350,
          fontSize: 15,
          color: "#334155",
        },
        sync_at: 3.0,
      },
    ];

    const demo: Demo = {
      component: "match_pairs",
      params: {
        title: "Pythagorean Triplet Match",
      },
    };

    const question: Question = {
      type: "mcq",
      text: "If a right-angled triangle has legs of lengths 3 and 4, what is the length of its hypotenuse?",
      options: ["5", "6", "7", "8"],
      answer: "5",
      difficulty: 1,
      concept: "Pythagorean Triplets",
      explanation: "3² (9) + 4² (16) = 25, and √25 = 5!",
    };

    return { boardActions, demo, question };
  }

  // 5. DEFAULT VISUAL FALLBACK MATCHING QUERY
  const boardActions: BoardAction[] = [
    {
      type: "write_text",
      params: {
        text: ctx.topic,
        x: 100,
        y: 60,
        fontSize: 20,
        color: "#1e293b",
      },
      sync_at: 0.3,
    },
    {
      type: "draw_box",
      params: {
        label: "Key Concept Focus",
        x: 120,
        y: 120,
        width: 360,
        height: 140,
        color: "#f59e0b",
      },
      sync_at: 0.8,
    },
    {
      type: "write_text",
      params: {
        text: ctx.speech.length > 55 ? ctx.speech.substring(0, 52) + "..." : ctx.speech,
        x: 135,
        y: 180,
        fontSize: 15,
        color: "#0f172a",
      },
      sync_at: 1.5,
    },
  ];

  return { boardActions, demo: null, question: null };
}
