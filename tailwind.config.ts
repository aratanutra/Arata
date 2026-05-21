import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#080808",
        deep: "#0E0E0E",
        surface: "#141414",
        gold: {
          DEFAULT: "#C9A96E",
          light: "#E8D5B0"
        },
        text: {
          primary: "#F0EBE1",
          secondary: "#A89880"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        accent: ["var(--font-accent)", "sans-serif"]
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C9A96E 0%, #E8D5B0 50%, #C9A96E 100%)",
        "gold-soft":
          "linear-gradient(180deg, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0) 100%)",
        "obsidian-fade":
          "radial-gradient(ellipse at top, rgba(201,169,110,0.08), transparent 60%)"
      },
      boxShadow: {
        gold: "0 0 60px -20px rgba(201,169,110,0.5)",
        "gold-soft": "0 0 120px -40px rgba(201,169,110,0.35)",
        inset: "inset 0 1px 0 rgba(232,213,176,0.08)"
      },
      animation: {
        "orb-pulse": "orbPulse 6s ease-in-out infinite",
        "orb-spin": "orbSpin 18s linear infinite",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2.4s linear infinite",
        float: "float 8s ease-in-out infinite"
      },
      keyframes: {
        orbPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.85" },
          "50%": { transform: "scale(1.06)", opacity: "1" }
        },
        orbSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      letterSpacing: {
        widest: "0.32em"
      }
    }
  },
  plugins: []
};

export default config;
