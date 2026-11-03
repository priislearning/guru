import React, { useState, useRef, useEffect } from "react";
import { useTutorStore } from "../../store/useTutorStore";
import { tutorOrchestrator } from "../../services/tutorOrchestrator";
import { audioRecorder } from "../../services/audioRecorder";
import { sendVoiceAudio } from "../../services/api";
import { Send, Mic, MicOff, MessageSquare, ChevronRight, ChevronLeft, Subtitles, Volume2 } from "lucide-react";

export const ChatPanel: React.FC = () => {
  const {
    messages,
    isChatCollapsed,
    toggleChatCollapsed,
    subtitlesEnabled,
    toggleSubtitles,
    currentSubtitle,
    avatarStatus,
    setAvatarStatus,
    language,
  } = useTutorStore();

  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentSubtitle]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    tutorOrchestrator.handleUserInput(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Push-to-talk voice recording with Saarika
  const toggleRecording = async () => {
    if (!isRecording) {
      const started = await audioRecorder.start();
      if (started) {
        setIsRecording(true);
        setAvatarStatus("listening");
      }
    } else {
      setIsRecording(false);
      setAvatarStatus("thinking");
      const audioBlob = await audioRecorder.stop();
      if (audioBlob) {
        try {
          const res = await sendVoiceAudio(audioBlob, language);
          if (res.transcript) {
            tutorOrchestrator.handleUserInput(res.transcript);
          } else {
            setAvatarStatus("idle");
          }
        } catch (err: any) {
          console.warn("STT error:", err);
          setAvatarStatus("idle");
        }
      } else {
        setAvatarStatus("idle");
      }
    }
  };

  if (isChatCollapsed) {
    return (
      <button
        onClick={toggleChatCollapsed}
        className="w-12 h-full flex flex-col items-center justify-between py-6 bg-white border-l border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
        title="Open Conversation Panel"
      >
        <ChevronLeft className="w-5 h-5 text-slate-500" />
        <span className="[writing-mode:vertical-rl] text-xs font-bold uppercase tracking-wider text-slate-500">
          Chat & Transcript
        </span>
        <MessageSquare className="w-5 h-5 text-amber-600" />
      </button>
    );
  }

  return (
    <div className="w-80 md:w-96 h-full flex flex-col bg-white border-l border-slate-200 shadow-sm overflow-hidden select-none">
      {/* Panel Header */}
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tutor Dialogue</h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSubtitles}
            title={subtitlesEnabled ? "Subtitles ON" : "Subtitles OFF"}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              subtitlesEnabled ? "bg-amber-100 text-amber-800" : "text-slate-400 hover:bg-slate-100"
            }`}
          >
            <Subtitles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleChatCollapsed}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtitles Bar (Live speech broadcast) */}
      {subtitlesEnabled && currentSubtitle && (
        <div className="px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 text-xs text-amber-950 flex items-start gap-2 animate-fadeIn">
          <Volume2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
          <span className="italic font-medium leading-relaxed">"{currentSubtitle}"</span>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 my-auto py-12 flex flex-col items-center">
            <span className="text-3xl mb-2">💬</span>
            <p className="text-xs font-medium text-slate-500">Start the conversation</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Type a question or press the mic button to speak in your language.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              } animate-fadeIn`}
            >
              <span className="text-[10px] font-bold text-slate-400 mb-0.5 px-1 uppercase tracking-wider">
                {msg.sender === "user" ? "You" : "Guru"}
              </span>
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-slate-900 text-white rounded-br-none"
                    : "bg-amber-50/70 border border-amber-200/60 text-slate-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Control Box */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-400 transition-all">
          {/* Push to talk mic button */}
          <button
            onClick={toggleRecording}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isRecording
                ? "bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
            }`}
            title={isRecording ? "Click to send recording" : "Push to talk (Saarika STT)"}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-amber-600" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isRecording
                ? "Listening to your voice..."
                : avatarStatus === "thinking"
                ? "GURU is thinking..."
                : "Ask GURU anything... (press Enter)"
            }
            disabled={isRecording || avatarStatus === "thinking"}
            className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none px-2"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || avatarStatus === "thinking"}
            className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
