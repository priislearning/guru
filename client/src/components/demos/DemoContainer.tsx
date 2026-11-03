import React from "react";
import { useTutorStore } from "../../store/useTutorStore";
import { SliderGraphDemo } from "./SliderGraphDemo";
import { SimulationDemo } from "./SimulationDemo";
import { DragSortDemo } from "./DragSortDemo";
import { MatchPairsDemo } from "./MatchPairsDemo";
import { StepThroughDemo } from "./StepThroughDemo";
import { X } from "lucide-react";

export const DemoContainer: React.FC = () => {
  const { activeDemo, setActiveDemo } = useTutorStore();

  if (!activeDemo) return null;

  const renderDemo = () => {
    switch (activeDemo.component) {
      case "slider_graph":
        return <SliderGraphDemo params={activeDemo.params} />;
      case "simple_simulation":
        return <SimulationDemo />;
      case "drag_sort":
        return <DragSortDemo />;
      case "match_pairs":
        return <MatchPairsDemo />;
      case "step_through":
        return <StepThroughDemo />;
      default:
        return <SimulationDemo />;
    }
  };

  return (
    <div className="relative w-full transition-all duration-300">
      <button
        onClick={() => setActiveDemo(null)}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        title="Minimize demo"
      >
        <X className="w-4 h-4" />
      </button>
      {renderDemo()}
    </div>
  );
};
