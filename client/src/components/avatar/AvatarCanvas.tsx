import React, { useEffect, useState, useRef } from "react";
import { useTutorStore } from "../../store/useTutorStore";
import { audioPlayer } from "../../services/audioPlayer";
import { getExpressionGeometry, computeMouthPath } from "./AvatarExpressions";
import { AvatarStatusBadge } from "./AvatarStatusBadge";

export const AvatarCanvas: React.FC = () => {
  const { emotion, gesture, avatarStatus, mouthOpen, setMouthOpen } = useTutorStore();
  const [isBlinking, setIsBlinking] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  // Real-time lip-sync loop sampling amplitude from audioPlayer
  useEffect(() => {
    const loop = () => {
      if (audioPlayer.getIsPlaying()) {
        const amp = audioPlayer.getAmplitude();
        setMouthOpen(amp);
      } else {
        if (mouthOpen > 0) setMouthOpen(0);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mouthOpen, setMouthOpen]);

  // Periodic natural eye blink cycle (every 3.2 - 4.5 seconds)
  useEffect(() => {
    let blinkTimer: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextInterval = 3000 + Math.random() * 2000;
        blinkTimer = setTimeout(triggerBlink, nextInterval);
      }, 160);
    };

    blinkTimer = setTimeout(triggerBlink, 3500);
    return () => clearTimeout(blinkTimer);
  }, []);

  const geo = getExpressionGeometry(emotion);
  const mouthPath = computeMouthPath(mouthOpen, emotion);

  // Gesture CSS classes
  const getGestureClasses = () => {
    switch (gesture) {
      case "wave":
        return "origin-bottom animate-wave";
      case "nod":
        return "animate-nod";
      case "shrug":
        return "animate-shrug";
      default:
        return "";
    }
  };

  return (
    <div className="relative w-full h-full min-h-[380px] flex flex-col items-center justify-between p-4 bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-indigo-50/40 rounded-3xl border border-amber-100 shadow-sm overflow-hidden select-none">
      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm"></span>
          <span className="text-xs font-bold tracking-wider uppercase text-amber-900/80">Guru Avatar</span>
        </div>
        <AvatarStatusBadge status={avatarStatus} />
      </div>

      {/* SVG Layered Avatar Rig */}
      <div className="relative w-full max-w-[340px] flex-1 flex items-center justify-center my-auto">
        {/* Background Aura / Thinking Glow / Listening Ripple */}
        {avatarStatus === "thinking" && (
          <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-amber-300/30 to-orange-400/30 blur-2xl animate-pulse"></div>
        )}
        {avatarStatus === "listening" && (
          <div className="absolute w-72 h-72 rounded-full border-4 border-rose-400/40 animate-ping"></div>
        )}

        <svg
          viewBox="0 0 400 480"
          className={`w-full h-auto max-h-[420px] transition-transform duration-500 drop-shadow-md ${
            gesture === "nod" ? "animate-nod" : ""
          }`}
          style={{ willChange: "transform" }}
        >
          <defs>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffdbb5" />
              <stop offset="100%" stopColor="#f5be87" />
            </linearGradient>

            <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>

            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* LAYER 1: Torso / Clothing with Breathing Animation */}
          <g className="animate-breathe origin-bottom">
            {/* Shoulders & Traditional Indian Nehru Vest */}
            <path
              d="M 120 330 C 120 310, 160 300, 200 300 C 240 300, 280 310, 280 330 L 330 480 L 70 480 Z"
              fill="url(#jacketGrad)"
              filter="url(#shadowFilter)"
            />

            {/* Inner Kurta / Collar Shirt */}
            <path
              d="M 175 295 L 200 350 L 225 295 Z"
              fill="url(#shirtGrad)"
            />
            {/* Mandarin Collar */}
            <path
              d="M 174 290 Q 200 300 226 290 L 226 302 Q 200 312 174 302 Z"
              fill="#ffffff"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />

            {/* Jacket Button strip & Brass Buttons */}
            <line x1="200" y1="350" x2="200" y2="480" stroke="#c2410c" strokeWidth="2" strokeDasharray="1,4" />
            <circle cx="200" cy="370" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="200" cy="405" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="200" cy="440" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          </g>

          {/* LAYER 2: Left Arm (Teacher's left side) */}
          <g>
            {gesture === "shrug" ? (
              <path
                d="M 120 330 Q 80 360 70 340"
                stroke="#ea580c"
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <path
                d="M 120 330 Q 95 380 90 430"
                stroke="#ea580c"
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>

          {/* LAYER 3: Right Arm (Teacher's right side, gesturing towards Whiteboard) */}
          <g>
            {gesture === "wave" && (
              <g className="origin-[280px_340px] animate-wave">
                {/* Arm raised up in friendly wave */}
                <path
                  d="M 280 330 Q 320 280 330 220"
                  stroke="#ea580c"
                  strokeWidth="22"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Waving Hand Palm */}
                <circle cx="330" cy="210" r="14" fill="url(#skinGrad)" />
                {/* Fingers */}
                <path d="M 324 200 L 322 188 M 329 198 L 330 184 M 335 199 L 338 186 M 340 203 L 345 192" stroke="#f5be87" strokeWidth="4" strokeLinecap="round" />
              </g>
            )}

            {gesture === "point_board" && (
              <g>
                {/* Arm pointing horizontally straight to the right (board) */}
                <path
                  d="M 280 330 Q 330 310 380 290"
                  stroke="#ea580c"
                  strokeWidth="22"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Pointing Hand */}
                <circle cx="380" cy="290" r="12" fill="url(#skinGrad)" />
                {/* Extended Pointer Finger */}
                <line x1="380" y1="290" x2="400" y2="285" stroke="url(#skinGrad)" strokeWidth="6" strokeLinecap="round" />
              </g>
            )}

            {gesture === "thumbs_up" && (
              <g>
                {/* Arm folded forward */}
                <path
                  d="M 280 330 Q 290 350 250 340"
                  stroke="#ea580c"
                  strokeWidth="22"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Thumbs Up Hand */}
                <circle cx="245" cy="335" r="12" fill="url(#skinGrad)" />
                <line x1="245" y1="335" x2="245" y2="315" stroke="#f5be87" strokeWidth="6" strokeLinecap="round" />
              </g>
            )}

            {gesture === "shrug" && (
              <path
                d="M 280 330 Q 320 360 330 340"
                stroke="#ea580c"
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {(gesture === "none" || gesture === "nod") && (
              <path
                d="M 280 330 Q 305 380 310 430"
                stroke="#ea580c"
                strokeWidth="24"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>

          {/* LAYER 4: Neck */}
          <rect x="184" y="250" width="32" height="50" rx="10" fill="url(#skinGrad)" />

          {/* LAYER 5: Head Silhouette */}
          <ellipse cx="200" cy="205" rx="72" ry="86" fill="url(#skinGrad)" filter="url(#shadowFilter)" />

          {/* LAYER 6: Ears */}
          <ellipse cx="126" cy="205" rx="8" ry="14" fill="#f5be87" />
          <ellipse cx="274" cy="205" rx="8" ry="14" fill="#f5be87" />

          {/* LAYER 7: Hair */}
          <path
            d="M 128 175 C 120 110, 160 85, 200 85 C 240 85, 280 110, 272 175 C 265 145, 240 120, 200 120 C 160 120, 135 145, 128 175 Z"
            fill="#1e293b"
          />
          <path
            d="M 132 170 Q 155 125 200 130 Q 245 125 268 170 C 260 135, 230 115, 200 115 C 170 115, 140 135, 132 170 Z"
            fill="#334155"
            opacity="0.6"
          />

          {/* LAYER 8: Eyebrows (Driven by emotion) */}
          <path
            d={geo.leftEyebrowPath}
            stroke="#1e293b"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />
          <path
            d={geo.rightEyebrowPath}
            stroke="#1e293b"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />

          {/* LAYER 9: Eyes & Eyelids */}
          {/* Left Eye */}
          <g transform="translate(152, 172)">
            {isBlinking ? (
              // Closed eye during blink
              <path d="M -16 0 Q 0 4 16 0" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : geo.eyeShape === "squint_smile" ? (
              // Joyful smiling eye crescent
              <path d="M -15 2 Q 0 -8 15 2" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            ) : (
              // Open Eye
              <>
                <ellipse cx="0" cy="0" rx="14" ry="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                {/* Iris */}
                <circle
                  cx={geo.leftEyePupilOffset.x}
                  cy={geo.leftEyePupilOffset.y}
                  r={geo.eyeShape === "wide" ? 6.5 : 5.5}
                  fill="#472a15"
                />
                {/* Pupil Center */}
                <circle cx={geo.leftEyePupilOffset.x} cy={geo.leftEyePupilOffset.y} r="3" fill="#0f172a" />
                {/* Eye Glint/Sparkle */}
                <circle cx={geo.leftEyePupilOffset.x - 2} cy={geo.leftEyePupilOffset.y - 2} r="1.5" fill="#ffffff" />
              </>
            )}
          </g>

          {/* Right Eye */}
          <g transform="translate(248, 172)">
            {isBlinking ? (
              // Closed eye during blink
              <path d="M -16 0 Q 0 4 16 0" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
            ) : geo.eyeShape === "squint_smile" ? (
              // Joyful smiling eye crescent
              <path d="M -15 2 Q 0 -8 15 2" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            ) : (
              // Open Eye
              <>
                <ellipse cx="0" cy="0" rx="14" ry="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                {/* Iris */}
                <circle
                  cx={geo.rightEyePupilOffset.x}
                  cy={geo.rightEyePupilOffset.y}
                  r={geo.eyeShape === "wide" ? 6.5 : 5.5}
                  fill="#472a15"
                />
                {/* Pupil Center */}
                <circle cx={geo.rightEyePupilOffset.x} cy={geo.rightEyePupilOffset.y} r="3" fill="#0f172a" />
                {/* Eye Glint/Sparkle */}
                <circle cx={geo.rightEyePupilOffset.x - 2} cy={geo.rightEyePupilOffset.y - 2} r="1.5" fill="#ffffff" />
              </>
            )}
          </g>

          {/* LAYER 10: Sleek Modern Glasses */}
          <g stroke="#334155" strokeWidth="2.5" fill="none">
            {/* Left Frame */}
            <rect x="134" y="156" width="36" height="28" rx="8" fill="rgba(255, 255, 255, 0.15)" />
            {/* Right Frame */}
            <rect x="230" y="156" width="36" height="28" rx="8" fill="rgba(255, 255, 255, 0.15)" />
            {/* Nose Bridge */}
            <path d="M 170 168 Q 200 162 230 168" />
            {/* Left/Right Temple pieces */}
            <path d="M 134 168 L 126 166" />
            <path d="M 266 168 L 274 166" />
          </g>

          {/* LAYER 11: Nose */}
          <path
            d="M 197 195 Q 202 218 195 224 Q 200 226 205 224"
            stroke="#d99b66"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* LAYER 12: Cheek Blush (Shows warmth / encouragement) */}
          {(emotion === "happy" || emotion === "encouraging") && (
            <>
              <ellipse cx="148" cy="220" rx="12" ry="7" fill="#f87171" opacity="0.25" />
              <ellipse cx="252" cy="220" rx="12" ry="7" fill="#f87171" opacity="0.25" />
            </>
          )}

          {/* LAYER 13: Animated Lip-Sync Mouth Mesh */}
          <g className="transition-all duration-75">
            {/* Mouth cavity (when open) */}
            {mouthOpen > 0.05 && (
              <path d={mouthPath} fill="#881337" stroke="#9f1239" strokeWidth="1.5" />
            )}
            {/* Teeth highlight */}
            {mouthOpen > 0.35 && (
              <path
                d="M 180 263 Q 200 267 220 263"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            )}
            {/* Base Lip outline */}
            <path
              d={mouthPath}
              stroke="#991b1b"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill={mouthOpen > 0.05 ? "none" : "#991b1b"}
            />
          </g>
        </svg>
      </div>

      {/* Bottom Personality & Emotion Indicator */}
      <div className="w-full flex items-center justify-between px-2 pt-2 border-t border-amber-100/80 text-xs text-slate-500 z-20">
        <span className="font-medium capitalize text-slate-700">
          Emotion: <strong className="text-amber-700">{emotion}</strong>
        </span>
        <span className="font-medium capitalize text-slate-700">
          Gesture: <strong className="text-amber-700">{gesture}</strong>
        </span>
      </div>
    </div>
  );
};
