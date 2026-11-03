import React, { useEffect } from "react";
import { Header } from "./components/layout/Header";
import { AvatarCanvas } from "./components/avatar/AvatarCanvas";
import { WhiteboardPanel } from "./components/whiteboard/WhiteboardPanel";
import { ChatPanel } from "./components/chat/ChatPanel";
import { QuestionModal } from "./components/chat/QuestionModal";
import { ProgressDashboard } from "./components/dashboard/ProgressDashboard";
import { SettingsModal } from "./components/layout/SettingsModal";
import { OnboardingModal } from "./components/dashboard/OnboardingModal";
import { useTutorStore } from "./store/useTutorStore";
import { tutorOrchestrator } from "./services/tutorOrchestrator";

export function App() {
  const {
    messages,
    topic,
    isOnboardingOpen,
    setIsOnboardingOpen,
    incrementTimeSpent,
  } = useTutorStore();

  // Track session duration in seconds
  useEffect(() => {
    const timer = setInterval(() => {
      incrementTimeSpent(1);
    }, 1000);
    return () => clearInterval(timer);
  }, [incrementTimeSpent]);

  // First run: trigger onboarding or kick off Photosynthesis lesson
  useEffect(() => {
    if (messages.length === 0 && !isOnboardingOpen) {
      // Check if user has seen onboarding before
      const seen = localStorage.getItem("guru_onboarding_completed");
      if (!seen) {
        setIsOnboardingOpen(true);
        localStorage.setItem("guru_onboarding_completed", "true");
      } else {
        // Automatically start the first lesson turn
        tutorOrchestrator.handleUserInput(`Hello Guru, let's begin our lesson on ${topic}!`);
      }
    }
  }, [messages.length, isOnboardingOpen, setIsOnboardingOpen, topic]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Top Header */}
      <Header />

      {/* Main 3-Zone Workspace */}
      <main className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* Zone 1: Avatar (Left, large) */}
        <section className="w-80 md:w-96 lg:w-[380px] shrink-0 h-full flex flex-col">
          <AvatarCanvas />
        </section>

        {/* Zone 2: Whiteboard / Interactive Demo / Document (Center) */}
        <section className="flex-1 h-full min-w-0">
          <WhiteboardPanel />
        </section>

        {/* Zone 3: Chat and Question Panel (Right, collapsible) */}
        <section className="shrink-0 h-full">
          <ChatPanel />
        </section>
      </main>

      {/* Floating Modals */}
      <QuestionModal />
      <ProgressDashboard />
      <SettingsModal />
      <OnboardingModal />
    </div>
  );
}

export default App;
