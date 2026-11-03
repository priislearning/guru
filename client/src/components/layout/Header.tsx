import React from "react";
import { useTutorStore } from "../../store/useTutorStore";
import { SUPPORTED_LANGUAGES } from "../../data/languages";
import { SAMPLE_TOPICS } from "../../data/sampleLessons";
import { tutorOrchestrator } from "../../services/tutorOrchestrator";
import { Languages, BookOpen, BarChart3, Settings, GraduationCap } from "lucide-react";

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    topic,
    setTopic,
    masteryScores,
    setIsDashboardOpen,
    setIsSettingsOpen,
    clearBoard,
    setActiveDemo,
  } = useTutorStore();

  // Calculate aggregate mastery percentage
  const scores = Object.values(masteryScores);
  const avgMastery =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    // Announce language change to tutor while keeping lesson context
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === newLang);
    const langName = langObj ? langObj.name : newLang;
    tutorOrchestrator.handleUserInput(
      `Please continue our lesson about ${topic} in ${langName}.`
    );
  };

  const handleTopicChange = (newTopicTitle: string) => {
    setTopic(newTopicTitle);
    clearBoard();
    setActiveDemo(null);
    tutorOrchestrator.handleUserInput(`Let's start learning about ${newTopicTitle}!`);
  };

  return (
    <header className="w-full px-6 py-3.5 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between z-30 select-none">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-black text-xl font-heading">
          G
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-tight text-slate-900 font-heading">
              GURU
            </h1>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 tracking-wider">
              Sarvam AI
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Lifelike Multilingual AI Avatar Tutor
          </p>
        </div>
      </div>

      {/* Center Controls: Topic & Language Switchers */}
      <div className="flex items-center gap-3">
        {/* Topic Selector */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
          <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <select
            value={topic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer pr-1"
          >
            {SAMPLE_TOPICS.map((t) => (
              <option key={t.id} value={t.title}>
                {t.icon} {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Multilingual Switcher (11 Indian languages) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
          <Languages className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer font-medium"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls: Progress Ring, Dashboard, Settings */}
      <div className="flex items-center gap-3">
        {/* Progress Ring */}
        <button
          onClick={() => setIsDashboardOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl transition-all cursor-pointer"
          title="View Mastery Dashboard"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg className="w-6 h-6 transform -rotate-90">
              <circle cx="12" cy="12" r="9" stroke="#fed7aa" strokeWidth="2.5" fill="none" />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#ea580c"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray={56.5}
                strokeDashoffset={56.5 - (56.5 * avgMastery) / 100}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <span className="text-[9px] font-black text-amber-900 absolute">{avgMastery}%</span>
          </div>
          <span className="text-xs font-bold text-amber-900 hidden sm:inline">Mastery</span>
        </button>

        {/* Dashboard Modal Button */}
        <button
          onClick={() => setIsDashboardOpen(true)}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          title="Open Performance Dashboard"
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        {/* Settings Modal Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          title="Settings & Sarvam API Key"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
