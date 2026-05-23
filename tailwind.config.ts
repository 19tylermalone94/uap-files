import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#050508",
        "deep-space": "#0a0a14",
        terminal: "#00ff9d",
        redacted: "#ff3c3c",
        amber: "#f5a623",
        paper: "#c8b89a",
        "stamp-red": "#c0392b",
      },
      fontFamily: {
        mono: ["'Share Tech Mono'", "monospace"],
        display: ["'Bebas Neue'", "sans-serif"],
        typewriter: ["'Special Elite'", "cursive"],
      },
      animation: {
        glitch: "glitch 2.5s infinite",
        "scanline-pulse": "scanlines 8s linear infinite",
        "static-burst": "staticBurst 0.3s steps(4) forwards",
        "slow-rotate": "slowRotate 60s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "ticker-scroll": "tickerScroll 40s linear infinite",
        "cursor-blink": "cursorBlink 1s step-end infinite",
        "fade-in": "fadeIn 0.5s ease-in-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 1px)" },
          "40%": { transform: "translate(2px, -1px)" },
          "60%": { transform: "translate(-1px, 2px)" },
          "80%": { transform: "translate(1px, -2px)" },
        },
        scanlines: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100px" },
        },
        staticBurst: {
          "0%": { opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slowRotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 5px #00ff9d, 0 0 10px #00ff9d",
            opacity: "0.8",
          },
          "50%": {
            boxShadow: "0 0 20px #00ff9d, 0 0 40px #00ff9d",
            opacity: "1",
          },
        },
        tickerScroll: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        cursorBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "paper-texture":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
