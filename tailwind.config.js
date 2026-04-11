/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        term: {
          bg: "#0a0e14",
          panel: "#0d1117",
          border: "#1f2933",
          text: "#c9d1d9",
          dim: "#7d8590",
          accent: "#00ff9c",
          cyan: "#22d3ee",
          purple: "#a78bfa",
          pink: "#ff5cf4",
          warn: "#ffcc00",
          err: "#ff5f56",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,255,156,0.25), 0 0 60px rgba(0,255,156,0.1)",
        "glow-strong":
          "0 0 30px rgba(0,255,156,0.5), 0 0 90px rgba(0,255,156,0.2)",
      },
      keyframes: {
        blink: {
          "0%,50%": { opacity: "1" },
          "51%,100%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%,19.9%,22%,62.9%,64%,64.9%,70%,100%": { opacity: "1" },
          "20%,21.9%,63%,63.9%,65%,69.9%": { opacity: "0.4" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        scan: "scan 6s linear infinite",
        flicker: "flicker 4s infinite",
      },
    },
  },
  plugins: [],
};
