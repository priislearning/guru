import React from "react";
import { BoardAction } from "../../types/tutor";

interface WhiteboardRendererProps {
  actions: BoardAction[];
}

export const WhiteboardRenderer: React.FC<WhiteboardRendererProps> = ({ actions }) => {
  return (
    <svg
      viewBox="0 0 600 420"
      className="w-full h-full select-none"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.04))" }}
    >
      <defs>
        {/* Subtle grid pattern for whiteboard realism */}
        <pattern id="boardGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" strokeWidth="1" />
        </pattern>
        {/* Arrow Marker */}
        <marker
          id="arrowHead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#ea580c" />
        </marker>
        <marker
          id="arrowHeadGreen"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#16a34a" />
        </marker>
        <marker
          id="arrowHeadBlue"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#0284c7" />
        </marker>
      </defs>

      {/* Grid background */}
      <rect width="600" height="420" fill="url(#boardGrid)" />

      {/* Render structured board actions */}
      {actions.map((act, index) => {
        const { type, params } = act;

        switch (type) {
          case "write_text": {
            const { text, x = 50, y = 50, fontSize = 16, color = "#1e293b" } = params;
            return (
              <text
                key={`act-${index}`}
                x={x}
                y={y}
                fill={color}
                fontSize={fontSize}
                fontWeight="600"
                className="font-handwriting animate-fadeIn"
                style={{ animationDuration: "0.5s" }}
              >
                {text}
              </text>
            );
          }

          case "draw_box": {
            const { label, x = 60, y = 60, width = 140, height = 80, color = "#16a34a" } = params;
            return (
              <g key={`act-${index}`} className="animate-fadeIn">
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx="12"
                  fill={`${color}12`}
                  stroke={color}
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
                {label && (
                  <text
                    x={x + 12}
                    y={y + 24}
                    fill={color}
                    fontSize="14"
                    fontWeight="700"
                    className="font-heading"
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          }

          case "draw_circle": {
            const { label, cx = 100, cy = 100, r = 30, color = "#0284c7" } = params;
            return (
              <g key={`act-${index}`} className="animate-fadeIn">
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={`${color}15`}
                  stroke={color}
                  strokeWidth="2.5"
                />
                {label && (
                  <text
                    x={cx}
                    y={cy + 5}
                    textAnchor="middle"
                    fill={color}
                    fontSize="13"
                    fontWeight="700"
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          }

          case "draw_arrow": {
            const { from = [50, 50], to = [150, 150], label, color = "#ea580c" } = params;
            const midX = (from[0] + to[0]) / 2;
            const midY = (from[1] + to[1]) / 2 - 8;
            return (
              <g key={`act-${index}`} className="animate-fadeIn">
                <line
                  x1={from[0]}
                  y1={from[1]}
                  x2={to[0]}
                  y2={to[1]}
                  stroke={color}
                  strokeWidth="2.5"
                  markerEnd={color === "#16a34a" ? "url(#arrowHeadGreen)" : color === "#0284c7" ? "url(#arrowHeadBlue)" : "url(#arrowHead)"}
                />
                {label && (
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    fill={color}
                    fontSize="12"
                    fontWeight="600"
                    className="font-handwriting"
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          }

          case "draw_axis": {
            const { x = 60, y = 340, width = 240, height = 180, xLabel = "X", yLabel = "Y" } = params;
            return (
              <g key={`act-${index}`} className="animate-fadeIn">
                {/* Y Axis */}
                <line x1={x} y1={y} x2={x} y2={y - height} stroke="#64748b" strokeWidth="2" />
                <polygon points={`${x - 4},${y - height} ${x + 4},${y - height} ${x},${y - height - 8}`} fill="#64748b" />
                <text x={x - 12} y={y - height - 10} fill="#475569" fontSize="12" fontWeight="600">
                  {yLabel}
                </text>

                {/* X Axis */}
                <line x1={x} y1={y} x2={x + width} y2={y} stroke="#64748b" strokeWidth="2" />
                <polygon points={`${x + width},${y - 4} ${x + width},${y + 4} ${x + width + 8},${y}`} fill="#64748b" />
                <text x={x + width - 10} y={y + 20} fill="#475569" fontSize="12" fontWeight="600">
                  {xLabel}
                </text>
              </g>
            );
          }

          case "plot_function": {
            const { fn = "sigmoid", label, color = "#2563eb" } = params;
            // Generate curve points for typical saturation curve
            const points: string[] = [];
            for (let px = 60; px <= 280; px += 8) {
              const rel = (px - 60) / 220; // 0 to 1
              // Michaelis-Menten / Saturation curve
              const py = 340 - (rel / (rel + 0.35)) * 140;
              points.push(`${px},${py}`);
            }
            return (
              <g key={`act-${index}`} className="animate-fadeIn">
                <polyline
                  points={points.join(" ")}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {label && (
                  <text x="210" y="210" fill={color} fontSize="12" fontWeight="700">
                    {label}
                  </text>
                )}
              </g>
            );
          }

          case "draw_table": {
            const { headers = ["Col 1", "Col 2"], rows = [["A", "B"]], x = 80, y = 240 } = params;
            return (
              <g key={`act-${index}`} className="animate-fadeIn">
                <rect x={x} y={y} width="280" height="90" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                {headers.map((h: string, hIdx: number) => (
                  <text key={hIdx} x={x + 20 + hIdx * 140} y={y + 25} fill="#0f172a" fontSize="13" fontWeight="700">
                    {h}
                  </text>
                ))}
                <line x1={x} y1={y + 36} x2={x + 280} y2={y + 36} stroke="#e2e8f0" strokeWidth="1.5" />
                {rows.map((r: string[], rIdx: number) => (
                  <g key={rIdx}>
                    {r.map((cell: string, cIdx: number) => (
                      <text key={cIdx} x={x + 20 + cIdx * 140} y={y + 62 + rIdx * 24} fill="#334155" fontSize="12">
                        {cell}
                      </text>
                    ))}
                  </g>
                ))}
              </g>
            );
          }

          case "highlight": {
            const { target, color = "#fef08a", x = 120, y = 100, width = 160, height = 40 } = params;
            return (
              <rect
                key={`act-${index}`}
                x={x}
                y={y}
                width={width}
                height={height}
                rx="6"
                fill={color}
                opacity="0.35"
                className="animate-pulse"
              />
            );
          }

          case "erase":
            return null;

          default:
            return null;
        }
      })}
    </svg>
  );
};
