/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "SF Pro", "system-ui", "sans-serif"],
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
        brand: {
          DEFAULT: "#00ff9c",
          dim: "rgba(0,255,156,0.15)",
          50: "#edfff6",
          100: "#d5ffeb",
          400: "#00ff9c",
          500: "#00e68a",
          900: "#003d24",
        },
        surface: {
          DEFAULT: "#050810",
          50: "#0a0f1a",
          100: "#0f1628",
          200: "#141d32",
          300: "#1e293b",
          400: "#334155",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,255,156,0.15), 0 0 60px rgba(0,255,156,0.08)",
        "glow-strong":
          "0 0 30px rgba(0,255,156,0.35), 0 0 90px rgba(0,255,156,0.12)",
        "glow-card":
          "0 0 0 1px rgba(0,255,156,0.08), 0 4px 24px rgba(0,0,0,0.4)",
      },
      keyframes: {
        blink: {
          "0%,50%": { opacity: "1" },
          "51%,100%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%,19.9%,22%,62.9%,64%,64.9%,70%,100%": { opacity: "1" },
          "20%,21.9%,63%,63.9%,65%,69.9%": { opacity: "0.4" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        scan: "scan 6s linear infinite",
        flicker: "flicker 4s infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
