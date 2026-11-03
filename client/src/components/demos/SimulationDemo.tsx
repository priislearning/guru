import React, { useState } from "react";
import { Sun, Droplets, Wind, Sparkles } from "lucide-react";

export const SimulationDemo: React.FC = () => {
  const [sunlight, setSunlight] = useState<number>(65);
  const [water, setWater] = useState<number>(80);
  const [co2, setCO2] = useState<number>(50);

  // Liebig's Law of the Minimum: growth is dictated not by total resources, but by the scarcest resource!
  const rate = Math.round((Math.min(sunlight, water, co2) * 0.85) + ((sunlight + water + co2) / 3) * 0.15);

  let limitingFactor = "Balanced";
  if (sunlight <= water && sunlight <= co2) limitingFactor = "Sunlight";
  else if (water <= sunlight && water <= co2) limitingFactor = "Water";
  else limitingFactor = "CO2 Concentration";

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span>🌿</span> Virtual Chloroplast Reactor
        </h4>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
          Biological Simulation
        </span>
      </div>

      {/* Visual Simulation Display */}
      <div className="relative h-44 bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-50 rounded-xl border border-emerald-200/60 p-4 flex items-center justify-between overflow-hidden">
        {/* Sun in sky */}
        <div
          className="absolute top-3 left-4 flex items-center justify-center transition-all duration-300"
          style={{ opacity: 0.3 + (sunlight / 100) * 0.7 }}
        >
          <div className="w-12 h-12 rounded-full bg-amber-400 blur-sm absolute"></div>
          <Sun className="w-10 h-10 text-amber-500 relative z-10 animate-spin" style={{ animationDuration: "20s" }} />
        </div>

        {/* Rain / Water drops */}
        <div className="absolute top-2 left-32 flex gap-3 opacity-60">
          {Array.from({ length: Math.floor(water / 20) }).map((_, i) => (
            <Droplets key={i} className="w-4 h-4 text-sky-500 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>

        {/* Central Plant Chloroplast Organelle */}
        <div className="relative mx-auto flex flex-col items-center z-10">
          <div
            className="w-24 h-24 rounded-full border-4 border-emerald-600 bg-emerald-500/80 flex flex-col items-center justify-center shadow-lg transition-transform duration-300"
            style={{ transform: `scale(${0.9 + (rate / 100) * 0.25})` }}
          >
            <span className="text-2xl">🍃</span>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider mt-1">Chloroplast</span>
          </div>

          {/* O2 Bubbles rising out */}
          <div className="absolute -top-4 flex gap-2">
            {Array.from({ length: Math.min(5, Math.floor(rate / 18)) }).map((_, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full bg-white/90 border border-sky-300 text-[8px] font-bold text-sky-700 flex items-center justify-center shadow-sm animate-bounce"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                O₂
              </span>
            ))}
          </div>
        </div>

        {/* Glucose Output Tank Gauge */}
        <div className="flex flex-col items-center bg-white/90 p-2.5 rounded-xl border border-slate-200/80 shadow-sm z-10 w-28">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Glucose (Food)</span>
          <span className="text-lg font-black text-emerald-600 mt-0.5">{rate}%</span>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-1 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${rate}%` }}
            ></div>
          </div>
          <span className="text-[9px] text-slate-400 mt-1">Rate of Reaction</span>
        </div>
      </div>

      {/* 3 Interactive Sliders */}
      <div className="grid grid-cols-3 gap-3">
        {/* Sunlight */}
        <div className="flex flex-col gap-1 p-2 bg-slate-50 rounded-lg border border-slate-200/60">
          <div className="flex justify-between items-center text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-amber-800">
              <Sun className="w-3 h-3 text-amber-500" /> Light
            </span>
            <span className="font-mono text-amber-700">{sunlight}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sunlight}
            onChange={(e) => setSunlight(Number(e.target.value))}
            className="w-full accent-amber-500 h-1.5 cursor-pointer"
          />
        </div>

        {/* Water */}
        <div className="flex flex-col gap-1 p-2 bg-slate-50 rounded-lg border border-slate-200/60">
          <div className="flex justify-between items-center text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-sky-800">
              <Droplets className="w-3 h-3 text-sky-500" /> Water
            </span>
            <span className="font-mono text-sky-700">{water}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={water}
            onChange={(e) => setWater(Number(e.target.value))}
            className="w-full accent-sky-500 h-1.5 cursor-pointer"
          />
        </div>

        {/* CO2 */}
        <div className="flex flex-col gap-1 p-2 bg-slate-50 rounded-lg border border-slate-200/60">
          <div className="flex justify-between items-center text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-teal-800">
              <Wind className="w-3 h-3 text-teal-500" /> CO₂ Air
            </span>
            <span className="font-mono text-teal-700">{co2}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={co2}
            onChange={(e) => setCO2(Number(e.target.value))}
            className="w-full accent-teal-500 h-1.5 cursor-pointer"
          />
        </div>
      </div>

      {/* Avatar Insight */}
      <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Limiting Factor: {limitingFactor}!</strong>{" "}
          {limitingFactor === "Sunlight"
            ? "Even with lots of water and CO2, without enough sunlight photons, chlorophyll cannot split water."
            : limitingFactor === "Water"
            ? "Water is scarce! Roots must supply H2O or photolysis halts and stomata close to save moisture."
            : "CO2 is bottlenecking the Calvin cycle enzymes from constructing glucose rings."}
        </span>
      </div>
    </div>
  );
};
