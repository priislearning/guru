/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        guru: {
          50: "#fff8f1",
          100: "#feede0",
          200: "#fcd6be",
          300: "#f9b790",
          400: "#f58e5a",
          500: "#f16a2d",
          600: "#e24e1d",
          700: "#bc3815",
          800: "#962f18",
          900: "#792a17",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e6ede6",
          500: "#4e7d58",
          700: "#32533a",
          900: "#1e3324",
        }
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "wave": "avatarWave 1.2s ease-in-out infinite alternate",
        "nod": "avatarNod 0.8s ease-in-out 2",
        "shrug": "avatarShrug 1s ease-in-out infinite alternate",
        "breathe": "avatarBreathe 4s ease-in-out infinite",
        "ripple": "avatarRipple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite",
      },
      keyframes: {
        avatarWave: {
          "0%": { transform: "rotate(-12deg)" },
          "100%": { transform: "rotate(16deg)" },
        },
        avatarNod: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(6px) rotate(2deg)" },
        },
        avatarShrug: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-6px)" },
        },
        avatarBreathe: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.018) translateY(-2px)" },
        },
        avatarRipple: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        }
      }
    },
  },
  plugins: [],
}
