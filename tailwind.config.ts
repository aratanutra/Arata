import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FFFFFF",
        cream: "#F5EDD8",
        paper: "#FAF6EA",
        parchment: "#F1E7CE",
        hairline: "#E2DCC9",
        ink: {
          DEFAULT: "#17203D",
          soft: "#2A3556",
          deep: "#0F1628"
        },
        muted: "#6B7085",
        gold: {
          DEFAULT: "#B8935E",
          light: "#D4B884",
          deep: "#8B6E44",
          soft: "#F2E9D2"
        },
        magenta: {
          DEFAULT: "#B21D5E",
          deep: "#8A164A",
          soft: "#F7E4EC"
        }
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif"
        ],
        serif: [
          "var(--font-serif)",
          "Iowan Old Style",
          "Palatino",
          "serif"
        ]
      },
      fontSize: {
        "display-xl": [
          "clamp(56px, 9vw, 128px)",
          { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "600" }
        ],
        "display-lg": [
          "clamp(40px, 6vw, 80px)",
          { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "600" }
        ],
        "display-md": [
          "clamp(32px, 4vw, 56px)",
          { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "600" }
        ]
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #B8935E 0%, #D4B884 45%, #8B6E44 100%)",
        "carton-navy":
          "linear-gradient(160deg, #1B2340 0%, #17203D 40%, #0F1628 100%)"
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,32,61,0.05), 0 4px 14px rgba(23,32,61,0.06)",
        "card-hover":
          "0 2px 4px rgba(23,32,61,0.06), 0 12px 32px rgba(23,32,61,0.10)",
        capsule:
          "0 30px 60px -20px rgba(23,32,61,0.2), 0 12px 24px -12px rgba(23,32,61,0.12)",
        rx: "0 18px 40px -16px rgba(23,32,61,0.18), 0 6px 14px -8px rgba(23,32,61,0.10)"
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        float: "float 9s ease-in-out infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      letterSpacing: {
        widest: "0.18em"
      }
    }
  },
  plugins: []
};

export default config;
