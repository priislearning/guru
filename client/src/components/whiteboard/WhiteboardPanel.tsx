import React, { useState } from "react";
import { useTutorStore } from "../../store/useTutorStore";
import { WhiteboardRenderer } from "./WhiteboardRenderer";
import { DocumentTab } from "./DocumentTab";
import { DemoContainer } from "../demos/DemoContainer";
import { Presentation, FileText, Sparkles, Trash2, Sliders, HelpCircle } from "lucide-react";
import { tutorOrchestrator } from "../../services/tutorOrchestrator";

export const WhiteboardPanel: React.FC = () => {
  const { boardActions, clearBoard, activeDemo, setActiveDemo, summaryNotes, topic } = useTutorStore();
  const [activeTab, setActiveTab] = useState<"whiteboard" | "demo" | "document">("whiteboard");

  // Automatically switch to demo tab when a demo is activated
  React.useEffect(() => {
    if (activeDemo) {
      setActiveTab("demo");
    }
  }, [activeDemo]);

  return (
    <div className="relative w-full h-full flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Navigation Bar with Tabs */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl">
          <button
            onClick={() => setActiveTab("whiteboard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "whiteboard"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-amber-600" />
            <span>Live Whiteboard</span>
            {boardActions.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("demo");
              if (!activeDemo) {
                // activate default simulation demo
                setActiveDemo({ component: "simple_simulation", params: {} });
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "demo"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Demo</span>
            {activeDemo && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("document")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "document"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lesson Notes</span>
            {summaryNotes.length > 0 && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 rounded-full font-bold">
                {summaryNotes.length}
              </span>
            )}
          </button>
        </div>

        {/* Board Action controls */}
        {activeTab === "whiteboard" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => tutorOrchestrator.handleUserInput(`Quiz me on ${topic}`)}
              title="Practice with a quick quiz question"
              className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Quiz Me</span>
            </button>
            <button
              onClick={clearBoard}
              title="Clear Whiteboard"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="text-xs">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Viewport */}
      <div className="relative flex-1 overflow-y-auto p-4 flex flex-col justify-center items-center">
        {activeTab === "whiteboard" && (
          <div className="w-full h-full flex items-center justify-center">
            {boardActions.length === 0 ? (
              <div className="text-center text-slate-400 max-w-sm flex flex-col items-center">
                <Sparkles className="w-10 h-10 text-amber-300 mb-3 animate-pulse" />
                <h4 className="text-sm font-semibold text-slate-600">The Whiteboard is Ready</h4>
                <p className="text-xs text-slate-400 mt-1">
                  As GURU speaks, equations, annotated arrows, and biological diagrams will automatically draw here in sync.
                </p>
              </div>
            ) : (
              <WhiteboardRenderer actions={boardActions} />
            )}
          </div>
        )}

        {activeTab === "demo" && (
          <div className="w-full max-w-xl mx-auto my-auto">
            <DemoContainer />
          </div>
        )}

        {activeTab === "document" && <DocumentTab />}
      </div>
    </div>
  );
};
