import React, { useState } from "react";
import { Link2, Check, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

interface PairItem {
  id: string;
  term: string;
  matchId: string;
}

interface MatchTarget {
  id: string;
  definition: string;
}

export const MatchPairsDemo: React.FC = () => {
  const terms: PairItem[] = [
    { id: "t1", term: "Chlorophyll", matchId: "d1" },
    { id: "t2", term: "Stomata", matchId: "d2" },
    { id: "t3", term: "Thylakoid", matchId: "d3" },
    { id: "t4", term: "Stroma", matchId: "d4" },
  ];

  const definitions: MatchTarget[] = [
    { id: "d3", definition: "Membrane disks where light reactions happen" },
    { id: "d1", definition: "Green pigment that absorbs solar photons" },
    { id: "d4", definition: "Fluid-filled space where glucose is synthesized" },
    { id: "d2", definition: "Microscopic leaf pores for CO₂/O₂ gas exchange" },
  ];

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({}); // termId -> defId
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSelectTerm = (id: string) => {
    if (matchedPairs[id]) return;
    setSelectedTerm(id);
  };

  const handleSelectDefinition = (defId: string) => {
    if (!selectedTerm) return;

    // Check if this matches
    const term = terms.find((t) => t.id === selectedTerm);
    if (term && term.matchId === defId) {
      const updated = { ...matchedPairs, [selectedTerm]: defId };
      setMatchedPairs(updated);
      setSelectedTerm(null);

      if (Object.keys(updated).length === terms.length) {
        setIsCompleted(true);
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      }
    } else {
      // wrong match shake
      setSelectedTerm(null);
    }
  };

  const handleReset = () => {
    setMatchedPairs({});
    setSelectedTerm(null);
    setIsCompleted(false);
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-emerald-600" /> Match Chloroplast Structures & Functions
        </h4>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
          Match Pairs
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Click a term on the left, then click its corresponding biological function on the right to link them.
      </p>

      {/* Grid of Terms and Definitions */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column: Terms */}
        <div className="flex flex-col gap-2">
          {terms.map((item) => {
            const isMatched = Boolean(matchedPairs[item.id]);
            const isSelected = selectedTerm === item.id;
            return (
              <button
                key={item.id}
                disabled={isMatched}
                onClick={() => handleSelectTerm(item.id)}
                className={`p-3 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                  isMatched
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 opacity-80"
                    : isSelected
                    ? "bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <span>{item.term}</span>
                {isMatched && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {/* Right Column: Definitions */}
        <div className="flex flex-col gap-2">
          {definitions.map((def) => {
            const isMatched = Object.values(matchedPairs).includes(def.id);
            return (
              <button
                key={def.id}
                disabled={isMatched}
                onClick={() => handleSelectDefinition(def.id)}
                className={`p-3 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                  isMatched
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 opacity-80"
                    : selectedTerm
                    ? "bg-slate-50 hover:bg-amber-50 border-slate-200 hover:border-amber-300 text-slate-700 cursor-pointer"
                    : "bg-slate-50 border-slate-200 text-slate-600 opacity-90"
                }`}
              >
                <span>{def.definition}</span>
                {isMatched && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted ? (
        <div className="flex items-center justify-between p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-semibold">
          <span>All pairs correctly connected! You master organelle functions.</span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-emerald-700 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Play Again
          </button>
        </div>
      ) : (
        <div className="text-[11px] text-slate-400 text-right">
          Matched: {Object.keys(matchedPairs).length} / {terms.length}
        </div>
      )}
    </div>
  );
};
