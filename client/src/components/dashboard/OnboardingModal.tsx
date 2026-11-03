import React, { useState } from "react";
import { useTutorStore } from "../../store/useTutorStore";
import { SUPPORTED_LANGUAGES } from "../../data/languages";
import { tutorOrchestrator } from "../../services/tutorOrchestrator";
import { GraduationCap, ArrowRight, Sparkles, BookOpen } from "lucide-react";

export const OnboardingModal: React.FC = () => {
  const {
    isOnboardingOpen,
    setIsOnboardingOpen,
    userProfile,
    setUserProfile,
    language,
    setLanguage,
    topic,
  } = useTutorStore();

  const [selectedGrade, setSelectedGrade] = useState<string>(
    userProfile.grade || "Grade 9-10 (High School)"
  );
  const [selectedGoal, setSelectedGoal] = useState<string>(
    userProfile.goal || "Understand concept deeply with visuals"
  );
  const [selectedLang, setSelectedLang] = useState<string>(language || "en-IN");

  if (!isOnboardingOpen) return null;

  const handleStart = () => {
    setUserProfile({
      grade: selectedGrade,
      goal: selectedGoal,
    });
    setLanguage(selectedLang);
    setIsOnboardingOpen(false);

    // Launch instant first-run lesson on Photosynthesis
    tutorOrchestrator.handleUserInput(
      `Hello Guru! I am in ${selectedGrade} and my goal is to ${selectedGoal}. Please start our lesson on ${topic}!`
    );
  };

  const gradeOptions = [
    "Grade 6-8 (Middle School)",
    "Grade 9-10 (High School)",
    "Grade 11-12 (Pre-University / JEE / NEET)",
    "College / Lifelong Learner",
  ];

  const goalOptions = [
    "Understand concept deeply with visuals",
    "Prepare for upcoming exam / test",
    "Quick 5-minute revision & quiz",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        {/* Welcome Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-2xl font-heading mb-3">
            🎓
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
            Welcome to GURU
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Your personal AI tutor with expressive voice, an animated live whiteboard, and interactive simulations.
          </p>
        </div>

        {/* Form Options */}
        <div className="flex flex-col gap-4">
          {/* Grade Level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-amber-600" /> What is your learning stage?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {gradeOptions.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                    selectedGrade === g
                      ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Goal */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" /> What is your primary goal?
            </label>
            <div className="flex flex-col gap-1.5">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all ${
                    selectedGoal === goal
                      ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Language */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Preferred Tutoring Language</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-orange-500/25 transition-all transform hover:scale-[1.01]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Begin Lesson on "How Photosynthesis Works"</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
