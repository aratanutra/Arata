import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FFFFFF",
        mist: "#F5F5F7",
        cloud: "#FAFAFA",
        hairline: "#D2D2D7",
        ink: {
          DEFAULT: "#1D1D1F",
          soft: "#3C3C43"
        },
        muted: "#6E6E73",
        sage: {
          DEFAULT: "#2D7A5B",
          deep: "#1F5C44",
          soft: "#EDF5F0"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "Arial", "sans-serif"]
      },
      fontSize: {
        "display-xl": ["clamp(56px, 9vw, 128px)", { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "600" }],
        "display-lg": ["clamp(40px, 6vw, 80px)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "600" }],
        "display-md": ["clamp(32px, 4vw, 56px)", { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "600" }]
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.05)",
        "card-hover": "0 2px 4px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.08)",
        capsule: "0 30px 60px -20px rgba(0,0,0,0.18), 0 12px 24px -12px rgba(0,0,0,0.10)",
        rx: "0 18px 40px -16px rgba(0,0,0,0.16), 0 6px 14px -8px rgba(0,0,0,0.08)"
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
