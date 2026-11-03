import React, { useState } from "react";
import { ArrowUpDown, CheckCircle, RotateCcw, Award } from "lucide-react";
import confetti from "canvas-confetti";

interface DragSortItem {
  id: string;
  text: string;
  correctIndex: number;
}

export const DragSortDemo: React.FC = () => {
  const initialItems: DragSortItem[] = [
    { id: "3", text: "ATP and NADPH energy molecules synthesized", correctIndex: 2 },
    { id: "1", text: "Chlorophyll absorbs photons from sunlight", correctIndex: 0 },
    { id: "4", text: "Calvin cycle uses CO₂ to construct Glucose food", correctIndex: 3 },
    { id: "2", text: "Water molecule split (Photolysis), releasing O₂", correctIndex: 1 },
  ];

  const [items, setItems] = useState<DragSortItem[]>(initialItems);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const moveItem = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setItems(updated);
    setIsVerified(false);
  };

  const handleVerify = () => {
    const correct = items.every((item, idx) => item.correctIndex === idx);
    setIsCorrect(correct);
    setIsVerified(true);
    if (correct) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleReset = () => {
    setItems(initialItems);
    setIsVerified(false);
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-indigo-600" /> Sequence the 4 Stages of Photosynthesis
        </h4>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
          Order Sorting Demo
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Use the up/down arrows to put the photosynthesis process into the correct biological order from start to finish.
      </p>

      {/* Sortable List */}
      <div className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              isVerified
                ? item.correctIndex === idx
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-rose-50 border-rose-300 text-rose-900"
                : "bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-white border border-slate-300 text-xs font-bold text-slate-600 flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span className="text-xs font-medium">{item.text}</span>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                disabled={idx === 0}
                onClick={() => moveItem(idx, idx - 1)}
                className="w-6 h-6 rounded flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-xs font-bold"
              >
                ▲
              </button>
              <button
                disabled={idx === items.length - 1}
                onClick={() => moveItem(idx, idx + 1)}
                className="w-6 h-6 rounded flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-xs font-bold"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Actions & Feedback */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Order
        </button>

        <button
          onClick={handleVerify}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <CheckCircle className="w-3.5 h-3.5" /> Check Sequence
        </button>
      </div>

      {isVerified && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium ${
            isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
          }`}
        >
          {isCorrect ? (
            <>
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Perfect! Light absorption splits water first, charging chemical carriers before glucose fixation!</span>
            </>
          ) : (
            <span>Almost there! Think about what must happen before sugar can be built—light energy is absorbed first.</span>
          )}
        </div>
      )}
    </div>
  );
};
