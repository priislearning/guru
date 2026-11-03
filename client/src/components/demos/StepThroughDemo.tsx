import React, { useState } from "react";
import { Play, Pause, ChevronRight, ChevronLeft, Layers } from "lucide-react";

interface StepData {
  title: string;
  stageName: string;
  description: string;
  equation: string;
  icon: string;
  color: string;
}

export const StepThroughDemo: React.FC = () => {
  const steps: StepData[] = [
    {
      title: "Photon Excitation",
      stageName: "Light Reaction Step 1",
      description: "Sunlight photons strike chlorophyll pigments in Photosystem II, exciting electrons to a high-energy state.",
      equation: "Chlorophyll + hν ➔ Chlorophyll* (Excited)",
      icon: "☀️",
      color: "#ea580c",
    },
    {
      title: "Photolysis of Water",
      stageName: "Light Reaction Step 2",
      description: "An enzyme cluster splits H₂O molecules to replenish the lost electrons, liberating Oxygen gas into the atmosphere.",
      equation: "2H₂O ➔ 4H⁺ + 4e⁻ + O₂ ↑",
      icon: "💧",
      color: "#0284c7",
    },
    {
      title: "Chemiosmotic ATP Generation",
      stageName: "Light Reaction Step 3",
      description: "The proton gradient drives ATP Synthase like a tiny waterwheel, charging chemical battery molecules (ATP & NADPH).",
      equation: "ADP + Pi + NADP⁺ ➔ ATP + NADPH",
      icon: "⚡",
      color: "#eab308",
    },
    {
      title: "Calvin Cycle Carbon Fixation",
      stageName: "Dark Reaction / Stroma",
      description: "RuBisCO enzyme captures CO₂ from air and uses the stored ATP/NADPH energy to assemble 6-carbon Glucose food.",
      equation: "6CO₂ + 18ATP + 12NADPH ➔ C₆H₁₂O₆ + 18ADP + 12NADP⁺",
      icon: "🍃",
      color: "#16a34a",
    },
  ];

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const cur = steps[currentIdx];

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600" /> Biochemical Pathway Step-Through
        </h4>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold border border-purple-200">
          Step {currentIdx + 1} of {steps.length}
        </span>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`flex-1 h-2 rounded-full transition-all ${
              idx === currentIdx
                ? "bg-purple-600"
                : idx < currentIdx
                ? "bg-purple-300"
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Step Visual Card */}
      <div
        className="p-5 rounded-xl border flex flex-col gap-3 transition-all"
        style={{ backgroundColor: `${cur.color}0c`, borderColor: `${cur.color}35` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{cur.icon}</span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {cur.stageName}
              </span>
              <h5 className="text-base font-bold text-slate-900">{cur.title}</h5>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">{cur.description}</p>

        <div className="p-2.5 bg-white/90 rounded-lg border border-slate-200/80 text-xs font-mono font-semibold text-slate-800">
          {cur.equation}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-xs font-medium text-slate-600"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          disabled={currentIdx === steps.length - 1}
          onClick={() => setCurrentIdx((i) => Math.min(steps.length - 1, i + 1))}
          className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-30 text-xs font-semibold text-white shadow-sm transition-colors"
        >
          Next Stage <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
