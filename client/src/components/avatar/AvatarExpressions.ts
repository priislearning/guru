import { Emotion } from "../../types/tutor";

export interface ExpressionGeometry {
  leftEyebrowPath: string;
  rightEyebrowPath: string;
  leftEyePupilOffset: { x: number; y: number };
  rightEyePupilOffset: { x: number; y: number };
  eyeShape: "normal" | "squint_smile" | "wide";
  baseMouthCurve: { start: [number, number]; cp1: [number, number]; cp2: [number, number]; end: [number, number] };
}

export function getExpressionGeometry(emotion: Emotion): ExpressionGeometry {
  switch (emotion) {
    case "happy":
      return {
        leftEyebrowPath: "M 130 148 Q 150 138 172 144",
        rightEyebrowPath: "M 228 144 Q 250 138 270 148",
        leftEyePupilOffset: { x: 0, y: -1 },
        rightEyePupilOffset: { x: 0, y: -1 },
        eyeShape: "squint_smile",
        baseMouthCurve: {
          start: [168, 260],
          cp1: [185, 274],
          cp2: [215, 274],
          end: [232, 260],
        },
      };

    case "thinking":
      return {
        // One raised eyebrow, one slightly lowered
        leftEyebrowPath: "M 130 140 Q 150 126 172 134",
        rightEyebrowPath: "M 228 152 Q 250 150 270 156",
        leftEyePupilOffset: { x: 3, y: -3 }, // glance up-right
        rightEyePupilOffset: { x: 3, y: -3 },
        eyeShape: "normal",
        baseMouthCurve: {
          start: [175, 262],
          cp1: [190, 260],
          cp2: [210, 262],
          end: [225, 262],
        },
      };

    case "encouraging":
      return {
        leftEyebrowPath: "M 130 144 Q 150 134 172 142",
        rightEyebrowPath: "M 228 142 Q 250 134 270 144",
        leftEyePupilOffset: { x: 0, y: 0 },
        rightEyePupilOffset: { x: 0, y: 0 },
        eyeShape: "normal",
        baseMouthCurve: {
          start: [170, 260],
          cp1: [185, 272],
          cp2: [215, 272],
          end: [230, 260],
        },
      };

    case "surprised":
      return {
        leftEyebrowPath: "M 130 134 Q 150 122 172 132",
        rightEyebrowPath: "M 228 132 Q 250 122 270 134",
        leftEyePupilOffset: { x: 0, y: 0 },
        rightEyePupilOffset: { x: 0, y: 0 },
        eyeShape: "wide",
        baseMouthCurve: {
          start: [178, 258],
          cp1: [186, 278],
          cp2: [214, 278],
          end: [222, 258],
        },
      };

    case "concerned":
      return {
        // Inner brows raised, outer lower (empathetic concern)
        leftEyebrowPath: "M 130 154 Q 150 142 172 138",
        rightEyebrowPath: "M 228 138 Q 250 142 270 154",
        leftEyePupilOffset: { x: 0, y: 1 },
        rightEyePupilOffset: { x: 0, y: 1 },
        eyeShape: "normal",
        baseMouthCurve: {
          start: [172, 266],
          cp1: [190, 261],
          cp2: [210, 261],
          end: [228, 266],
        },
      };

    case "neutral":
    default:
      return {
        leftEyebrowPath: "M 130 146 Q 150 140 172 144",
        rightEyebrowPath: "M 228 144 Q 250 140 270 146",
        leftEyePupilOffset: { x: 0, y: 0 },
        rightEyePupilOffset: { x: 0, y: 0 },
        eyeShape: "normal",
        baseMouthCurve: {
          start: [172, 262],
          cp1: [188, 268],
          cp2: [212, 268],
          end: [228, 262],
        },
      };
  }
}

/**
 * Computes SVG path for animated mouth based on real-time loudness amplitude (0 to 1)
 */
export function computeMouthPath(mouthOpen: number, emotion: Emotion): string {
  const geo = getExpressionGeometry(emotion);
  const { start, cp1, cp2, end } = geo.baseMouthCurve;

  // When mouth is closed
  if (mouthOpen < 0.05) {
    return `M ${start[0]} ${start[1]} C ${cp1[0]} ${cp1[1]}, ${cp2[0]} ${cp2[1]}, ${end[0]} ${end[1]}`;
  }

  // When mouth opens: top lip stays relatively steady, bottom lip drops with amplitude
  const drop = Math.min(24, Math.max(3, mouthOpen * 26));
  const midX = (start[0] + end[0]) / 2;
  const bottomCpY = Math.max(cp1[1], cp2[1]) + drop;

  // Top lip curve + Bottom lip curve to form an open cavity
  return `
    M ${start[0]} ${start[1]}
    C ${cp1[0]} ${cp1[1] - drop * 0.15}, ${cp2[0]} ${cp2[1] - drop * 0.15}, ${end[0]} ${end[1]}
    C ${cp2[0] + 2} ${bottomCpY}, ${cp1[0] - 2} ${bottomCpY}, ${start[0]} ${start[1]}
    Z
  `;
}
