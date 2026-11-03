import React from "react";
import { useTutorStore } from "../../store/useTutorStore";
import { tutorOrchestrator } from "../../services/tutorOrchestrator";
import {
  X,
  Trophy,
  Flame,
  Clock,
  Target,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";

export const ProgressDashboard: React.FC = () => {
  const {
    isDashboardOpen,
    setIsDashboardOpen,
    masteryScores,
    sessionStats,
    topic,
  } = useTutorStore();

  if (!isDashboardOpen) return null;

  const { questionsAttempted, questionsCorrect, streak, timeSpentSec, weakAreas, historyPoints } =
    sessionStats;

  const accuracy =
    questionsAttempted > 0 ? Math.round((questionsCorrect / questionsAttempted) * 100) : 100;

  const minutes = Math.floor(timeSpentSec / 60);
  const seconds = timeSpentSec % 60;

  const suggestedNextTopics = [
    { title: "Cellular Respiration", desc: "How cells burn glucose to release energy" },
    { title: "Plant Vascular Transport", desc: "Xylem and Phloem distribution networks" },
    { title: "ATP Synthase Molecular Motor", desc: "The rotary turbine powering biological life" },
  ];

  const handleSelectSuggestedTopic = (nextTopic: string) => {
    setIsDashboardOpen(false);
    tutorOrchestrator.handleUserInput(`I am ready! Teach me about ${nextTopic}.`);
  };

  const handleSpeakSummary = () => {
    setIsDashboardOpen(false);
    tutorOrchestrator.handleUserInput("Please give me an end-of-session summary of how I performed today.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-900 font-heading">Learning Mastery Dashboard</h3>
              <p className="text-xs text-slate-500">Live progress tracking & cognitive diagnostics</p>
            </div>
          </div>

          <button
            onClick={() => setIsDashboardOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Accuracy */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-600" /> Accuracy
            </span>
            <span className="text-xl font-black text-slate-900 mt-1">{accuracy}%</span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {questionsCorrect}/{questionsAttempted} correct
            </span>
          </div>

          {/* Streak */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-600" /> Streak
            </span>
            <span className="text-xl font-black text-orange-600 mt-1">{streak} in a row</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Consecutive answers</span>
          </div>

          {/* Time Spent */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-600" /> Time Spent
            </span>
            <span className="text-xl font-black text-slate-900 mt-1">
              {minutes}m {seconds}s
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">Active pair session</span>
          </div>

          {/* Concepts Covered */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Concepts
            </span>
            <span className="text-xl font-black text-slate-900 mt-1">
              {Object.keys(masteryScores).length}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">Target modules</span>
          </div>
        </div>

        {/* Concept Mastery Bars */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Per-Concept Mastery Scores (0 - 100%)
          </h4>
          <div className="space-y-3">
            {Object.entries(masteryScores).map(([concept, score]) => (
              <div key={concept} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">{concept}</span>
                  <span className="font-mono font-bold text-amber-700">{score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${Math.max(5, score)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy Over Time Chart */}
        {historyPoints.length > 1 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Accuracy Over Time
            </h4>
            <div className="h-24 bg-slate-50 rounded-2xl border border-slate-200/60 p-2 flex items-end justify-between gap-2">
              {historyPoints.map((pt, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[9px] font-mono text-slate-600">{pt.accuracy}%</span>
                  <div
                    className="w-full bg-amber-500 rounded-t-md transition-all duration-300"
                    style={{ height: `${Math.max(10, pt.accuracy)}%` }}
                  ></div>
                  <span className="text-[8px] text-slate-400">{pt.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak Areas Diagnostic */}
        {weakAreas.length > 0 && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-amber-900">Recommended Focus Area:</h5>
              <p className="text-xs text-amber-800 mt-0.5">
                You showed hesitation on <strong>{weakAreas.join(", ")}</strong>. GURU is automatically adapting analogies and visual demonstrations to reinforce this foundation!
              </p>
            </div>
          </div>
        )}

        {/* Next Suggested Topics & Verbal Summary */}
        <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Suggested Next Topics
            </h4>
            <button
              onClick={handleSpeakSummary}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Spoken Summary by Guru
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {suggestedNextTopics.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSuggestedTopic(s.title)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all hover:scale-[1.02] flex flex-col justify-between"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{s.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-2">
                  <span>Start</span> <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
