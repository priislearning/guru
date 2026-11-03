import React from "react";
import { Mic, Sparkles, Volume2 } from "lucide-react";

interface AvatarStatusBadgeProps {
  status: "idle" | "listening" | "thinking" | "speaking";
}

export const AvatarStatusBadge: React.FC<AvatarStatusBadgeProps> = ({ status }) => {
  if (status === "idle") {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-full shadow-sm text-xs font-medium text-slate-600">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Ready to Teach
      </div>
    );
  }

  if (status === "listening") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-full shadow-sm text-xs font-semibold text-rose-700 animate-pulse">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-4 h-4 rounded-full bg-rose-400 opacity-60 animate-ping"></span>
          <Mic className="w-3.5 h-3.5 text-rose-600 relative z-10" />
        </div>
        <span>Listening to you...</span>
        {/* Animated sound bars */}
        <div className="flex items-center gap-0.5 ml-1">
          <span className="w-1 h-3 bg-rose-500 rounded-full animate-pulse"></span>
          <span className="w-1 h-4 bg-rose-500 rounded-full animate-pulse delay-75"></span>
          <span className="w-1 h-2 bg-rose-500 rounded-full animate-pulse delay-150"></span>
        </div>
      </div>
    );
  }

  if (status === "thinking") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full shadow-sm text-xs font-semibold text-amber-800">
        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
        <span>GURU is thinking...</span>
      </div>
    );
  }

  if (status === "speaking") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full shadow-sm text-xs font-semibold text-indigo-700">
        <Volume2 className="w-3.5 h-3.5 text-indigo-600 animate-bounce" />
        <span>Speaking</span>
      </div>
    );
  }

  return null;
};
