import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "375px",
      },
      colors: {
        wine: {
          DEFAULT: "rgb(var(--wine) / <alpha-value>)",
          dark: "rgb(var(--wine-dark) / <alpha-value>)",
          deep: "rgb(var(--wine-deep) / <alpha-value>)",
          card: "rgb(var(--wine-card) / <alpha-value>)",
        },
        crimson: "rgb(var(--crimson) / <alpha-value>)",
        cream: {
          DEFAULT: "rgb(var(--cream) / <alpha-value>)",
          light: "rgb(var(--cream-light) / <alpha-value>)",
          dark: "rgb(var(--cream-dark) / <alpha-value>)",
          btn: "rgb(var(--cream-btn) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--gold) / <alpha-value>)",
          light: "rgb(var(--gold-light) / <alpha-value>)",
          dark: "rgb(var(--gold-dark) / <alpha-value>)",
        },
        ink: "rgb(var(--ink) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "serif"],
        serif: ["var(--font-serif)", "EB Garamond", "Georgia", "serif"],
        classic: ["var(--font-classic)", "Libre Baskerville", "Baskerville", "serif"],
        script: ["var(--font-script)", "Alex Brush", "cursive"],
        sans: ["var(--font-sans)", "Be Vietnam Pro", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(3deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-6px) scale(1.05)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,238,210,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(255,238,210,0.45)" },
        },
        "coin-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)", opacity: "0.8" },
          "50%": { transform: "translateY(-10px) rotate(15deg)", opacity: "1" },
        },
        "envelope-open": {
          "0%": { transform: "scale(1) rotateX(0deg)" },
          "50%": { transform: "scale(1.05) rotateX(-8deg)" },
          "100%": { transform: "scale(0.95) rotateX(0deg)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "hy-rise-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(70vh) scale(0.4) rotate(-12deg)",
            filter: "blur(4px)",
          },
          "70%": {
            opacity: "0.85",
            transform: "translateY(-8px) scale(1.05) rotate(2deg)",
            filter: "blur(0)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1) rotate(0deg)",
            filter: "blur(0)",
          },
        },
        "hy-fly-away": {
          "0%": {
            opacity: "1",
            transform: "translateY(0) scale(1) rotate(0deg)",
          },
          "40%": {
            opacity: "1",
            transform: "translateY(-30vh) scale(1.15) rotate(-8deg)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(-110vh) scale(0.6) rotate(15deg)",
          },
        },
        "hy-shimmer": {
          "0%, 100%": {
            opacity: "0.55",
            filter: "brightness(1) drop-shadow(0 0 4px rgba(227,199,122,0.3))",
          },
          "50%": {
            opacity: "1",
            filter: "brightness(1.35) drop-shadow(0 0 14px rgba(255,238,180,0.75))",
          },
        },
        "hy-stream-up": {
          "0%": {
            transform: "translateY(0) rotate(-10deg) scale(0.55)",
            opacity: "0",
          },
          "6%": {
            opacity: "0.75",
          },
          "50%": {
            opacity: "0.9",
          },
          "88%": {
            opacity: "0.35",
          },
          "100%": {
            transform: "translateY(-120vh) rotate(12deg) scale(1.08)",
            opacity: "0",
          },
        },
        sparkle: {
          "0%, 100%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        "sparkle-intense": {
          "0%, 100%": { opacity: "0", transform: "scale(0.2)" },
          "30%": { opacity: "1", transform: "scale(1.2)" },
          "60%": { opacity: "0.6", transform: "scale(0.8)" },
        },
        "shimmer-ray": {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "0.45" },
        },
        "burst-ring": {
          "0%": { transform: "scale(0.2)", opacity: "0.9" },
          "60%": { transform: "scale(1.8)", opacity: "0.4" },
          "100%": { transform: "scale(3)", opacity: "0" },
        },
        "burst-flash": {
          "0%": { opacity: "0" },
          "15%": { opacity: "0.85" },
          "100%": { opacity: "0" },
        },
        "grand-open-card": {
          "0%": { transform: "scale(1)", opacity: "1", filter: "brightness(1)" },
          "25%": { transform: "scale(1.06)", opacity: "1", filter: "brightness(1.5)" },
          "100%": { transform: "scale(1.35)", opacity: "0", filter: "brightness(2)" },
        },
        "sunburst-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "emblem-glow": {
          "0%, 100%": {
            boxShadow: "0 0 16px rgba(255,238,210,0.4), 0 0 32px rgba(201,162,75,0.2)",
          },
          "50%": {
            boxShadow: "0 0 28px rgba(255,238,210,0.75), 0 0 56px rgba(201,162,75,0.45)",
          },
        },
        "reveal-shell": {
          "0%": { opacity: "0", transform: "scale(0.94) translateY(24px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "fade-in": "fade-in 0.9s ease-out both",
        float: "float 5s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "coin-float": "coin-float 3s ease-in-out infinite",
        "envelope-open": "envelope-open 0.6s ease-in-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "hy-rise-in": "hy-rise-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "hy-fly-away": "hy-fly-away 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "hy-shimmer": "hy-shimmer 3s ease-in-out infinite",
        "hy-stream-up": "hy-stream-up 16s linear infinite",
        sparkle: "sparkle 2.2s ease-in-out infinite",
        "sparkle-intense": "sparkle-intense 1.2s ease-in-out infinite",
        "shimmer-ray": "shimmer-ray 4s ease-in-out infinite",
        "burst-ring": "burst-ring 1.4s ease-out forwards",
        "burst-flash": "burst-flash 1s ease-out forwards",
        "grand-open-card": "grand-open-card 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "sunburst-spin": "sunburst-spin 24s linear infinite",
        "emblem-glow": "emblem-glow 2.5s ease-in-out infinite",
        "reveal-shell": "reveal-shell 1.2s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
