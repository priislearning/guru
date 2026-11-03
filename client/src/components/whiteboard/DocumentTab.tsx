import React from "react";
import { Download, Printer, BookOpen, CheckCircle2 } from "lucide-react";
import { useTutorStore } from "../../store/useTutorStore";

export const DocumentTab: React.FC = () => {
  const { topic, summaryNotes, masteryScores } = useTutorStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full h-full p-6 bg-white overflow-y-auto print:p-0">
      {/* Printable Header */}
      <div className="border-b border-slate-200 pb-4 mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>GURU AI Tutor — Lesson Notes</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 font-heading">{topic}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Date: {new Date().toLocaleDateString(undefined, { dateStyle: "long" })} • Mode: Adaptive Multilingual AI Lesson
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Formatted Document Content */}
      <div className="space-y-6 max-w-2xl text-slate-700 text-sm leading-relaxed">
        {/* Concept Overview Section */}
        <section>
          <h3 className="text-base font-bold text-slate-900 border-l-4 border-amber-500 pl-3 mb-3">
            1. Core Concept Overview
          </h3>
          <p className="text-slate-600">
            {topic === "How photosynthesis works"
              ? "Photosynthesis is the biochemical process through which autotrophic green plants, algae, and cyanobacteria transform radiant light energy from the sun into chemical bond energy stored in carbohydrates (glucose)."
              : `Key principles and conceptual fundamentals of ${topic}.`}
          </p>
        </section>

        {/* Master Formula / Equation Box */}
        {topic.toLowerCase().includes("photosynthesis") && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-800">
              Balanced Chemical Equation:
            </span>
            <div className="text-base font-mono font-bold text-emerald-900 mt-1">
              6CO₂ + 6H₂O + Photons ➔ C₆H₁₂O₆ (Glucose) + 6O₂ ↑
            </div>
            <p className="text-xs text-emerald-700 mt-2">
              Carbon Dioxide (from air) + Water (from soil roots) in presence of Chlorophyll pigment yields food + oxygen.
            </p>
          </div>
        )}

        {/* Dynamic Key Takeaways from Live Lesson */}
        <section>
          <h3 className="text-base font-bold text-slate-900 border-l-4 border-amber-500 pl-3 mb-3">
            2. Tutor Key Takeaways & Visual Notes
          </h3>
          {summaryNotes.length > 0 ? (
            <ul className="space-y-2">
              {summaryNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 italic">
              Key takeaways will accumulate here as your lesson with GURU progresses.
            </p>
          )}
        </section>

        {/* Mastery Status Section */}
        <section className="pt-2">
          <h3 className="text-base font-bold text-slate-900 border-l-4 border-amber-500 pl-3 mb-3">
            3. Concept Mastery Progress
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(masteryScores).map(([concept, score]) => (
              <div key={concept} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700">{concept}</span>
                  <span className="font-bold text-amber-700">{score}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
