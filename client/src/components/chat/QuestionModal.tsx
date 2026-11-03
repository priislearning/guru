import React, { useState } from "react";
import { useTutorStore } from "../../store/useTutorStore";
import { tutorOrchestrator } from "../../services/tutorOrchestrator";
import { HelpCircle, CheckCircle, XCircle, ArrowRight, Mic, Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";

export const QuestionModal: React.FC = () => {
  const {
    currentQuestion,
    isQuestionOpen,
    setQuestionOpen,
    questionResult,
    setQuestionResult,
    recordAnswer,
    setEmotion,
    setGesture,
  } = useTutorStore();

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isQuestionOpen || !currentQuestion) return null;

  const handleDismiss = () => {
    setQuestionOpen(false);
    setQuestionResult(null);
  };

  const handleSubmit = async (userResponse: string) => {
    if (!userResponse.trim()) return;
    setIsSubmitting(true);

    const isMCQ = currentQuestion.type === "mcq";
    let isCorrect = false;

    if (isMCQ) {
      isCorrect =
        userResponse.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
    } else {
      // For short_answer or explain_back: match keywords from expected answer
      const keywords = currentQuestion.answer.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      const matches = keywords.filter((k) => userResponse.toLowerCase().includes(k));
      isCorrect = matches.length >= Math.max(1, Math.floor(keywords.length * 0.4));
    }

    // Record answer in persistent store (updates streak, accuracy, mastery)
    recordAnswer(isCorrect, currentQuestion.concept);

    if (isCorrect) {
      setEmotion("happy");
      setGesture("thumbs_up");
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      setQuestionResult({
        isCorrect: true,
        feedback: currentQuestion.explanation || "Shabash! Excellent reasoning.",
      });
    } else {
      setEmotion("concerned");
      setGesture("nod");
      setQuestionResult({
        isCorrect: false,
        feedback:
          currentQuestion.explanation ||
          `Keep going! The expected answer was: ${currentQuestion.answer}. Notice how it connects to our diagram.`,
      });
    }

    setIsSubmitting(false);
  };

  const handleNextStep = () => {
    setQuestionOpen(false);
    setQuestionResult(null);
    setSelectedOption("");
    setTextAnswer("");

    // Notify tutor to acknowledge response and advance
    const followUpText = questionResult?.isCorrect
      ? `I answered "${selectedOption || textAnswer}" correctly! What is our next step?`
      : `I need a little more help with "${currentQuestion.concept}". Can you explain with a real-life analogy?`;

    tutorOrchestrator.handleUserInput(followUpText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 flex flex-col gap-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Understanding Check • Level {currentQuestion.difficulty}/5
              </span>
              <h4 className="text-xs font-bold text-slate-800">{currentQuestion.concept}</h4>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {currentQuestion.type === "mcq" ? "Multiple Choice" : "Explain In Your Words"}
            </span>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close and continue listening"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Text */}
        <p className="text-base font-semibold text-slate-900 leading-snug">
          {currentQuestion.text}
        </p>

        {/* Question Inputs */}
        {!questionResult ? (
          <div className="flex flex-col gap-3">
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(opt)}
                      className={`p-3.5 rounded-2xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500 text-white border-amber-600 shadow-md scale-[1.01]"
                          : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? "bg-white text-amber-700" : "bg-white border border-slate-300 text-slate-600"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Explain what you observed or write your answer here..."
                  rows={3}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Dismiss & Review Board
              </button>
              <button
                disabled={(!selectedOption && !textAnswer.trim()) || isSubmitting}
                onClick={() => handleSubmit(selectedOption || textAnswer)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 disabled:opacity-40 transition-all"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Feedback Result View */
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                questionResult.isCorrect
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              {questionResult.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h5 className="text-xs font-bold mb-1">
                  {questionResult.isCorrect ? "Correct! Shabash! 🎉" : "Not quite, but great try!"}
                </h5>
                <p className="text-xs leading-relaxed opacity-90">{questionResult.feedback}</p>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
            >
              <span>Continue Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
