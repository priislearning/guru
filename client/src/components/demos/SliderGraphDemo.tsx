import React, { useState } from "react";
import { Sliders, Sparkles } from "lucide-react";

interface SliderGraphDemoProps {
  params: {
    title?: string;
    xLabel?: string;
    yLabel?: string;
    min?: number;
    max?: number;
    defaultValue?: number;
    formula?: string;
  };
}

export const SliderGraphDemo: React.FC<SliderGraphDemoProps> = ({ params }) => {
  const {
    title = "Rate of Photosynthesis vs Light Intensity",
    xLabel = "Light Intensity (Photons/sec)",
    yLabel = "Photosynthesis Output (O2 / min)",
    min = 0,
    max = 100,
    defaultValue = 50,
  } = params;

  const [sliderVal, setSliderVal] = useState<number>(defaultValue);

  // Michaelis-Menten / Saturation curve
  // output = (Vmax * S) / (Km + S)
  const calcOutput = (val: number) => {
    const s = val;
    const vmax = 100;
    const km = 25;
    return Math.round((vmax * s) / (km + s));
  };

  const currentOutput = calcOutput(sliderVal);
  const isSaturated = sliderVal > 75;

  // Generate SVG curve points
  const points: string[] = [];
  const svgWidth = 440;
  const svgHeight = 200;
  const padding = 35;

  for (let x = min; x <= max; x += 2) {
    const relX = (x - min) / (max - min);
    const px = padding + relX * (svgWidth - 2 * padding);
    const yVal = calcOutput(x);
    const relY = yVal / 100;
    const py = svgHeight - padding - relY * (svgHeight - 2 * padding);
    points.push(`${px},${py}`);
  }

  // Current marker point
  const curRelX = (sliderVal - min) / (max - min);
  const curPx = padding + curRelX * (svgWidth - 2 * padding);
  const curRelY = currentOutput / 100;
  const curPy = svgHeight - padding - relYToPx(curRelY, svgHeight, padding);

  function relYToPx(rel: number, h: number, pad: number) {
    return rel * (h - 2 * pad);
  }

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-600" />
          <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
          Interactive Curve Demo
        </span>
      </div>

      {/* SVG Dynamic Graph */}
      <div className="w-full bg-slate-50/80 rounded-xl p-2 border border-slate-200/60 overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          {/* Axes */}
          <line
            x1={padding}
            y1={svgHeight - padding}
            x2={svgWidth - padding + 10}
            y2={svgHeight - padding}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <line
            x1={padding}
            y1={svgHeight - padding}
            x2={padding}
            y2={padding - 10}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Curve */}
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Current Marker Point */}
          <circle cx={curPx} cy={curPy} r="6" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
          <line
            x1={curPx}
            y1={svgHeight - padding}
            x2={curPx}
            y2={curPy}
            stroke="#ea580c"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Axis Labels */}
          <text x={svgWidth / 2} y={svgHeight - 10} textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
            {xLabel} ➔
          </text>
          <text
            x={15}
            y={svgHeight / 2}
            textAnchor="middle"
            fill="#64748b"
            fontSize="11"
            fontWeight="600"
            transform={`rotate(-90 15 ${svgHeight / 2})`}
          >
            {yLabel} ➔
          </text>
        </svg>
      </div>

      {/* Slider Control */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-700">Adjust {xLabel}:</span>
          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {sliderVal} units
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={sliderVal}
          onChange={(e) => setSliderVal(Number(e.target.value))}
          className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
        />
      </div>

      {/* Dynamic Avatar Comment */}
      <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 rounded-xl text-xs text-amber-900">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          {isSaturated
            ? "Notice: At high sunlight (>75), the curve flattens! Chloroplast enzymes reach saturation."
            : sliderVal < 25
            ? "Look how steep the initial rate is: every extra ray of sunlight directly boosts sugar production!"
            : "Steady increase: as more photons strike the chlorophyll, more ATP is generated."}
        </span>
      </div>
    </div>
  );
};
