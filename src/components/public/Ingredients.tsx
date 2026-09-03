"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

/**
 * Per-ingredient tint + illustrated icon, tuned to the reference infographic.
 * Card body = bg, tint chip on the timeline = chip, accent shape inside icon
 * = accent, main shape = main.
 */
type Palette = {
  bg: string; // card background
  chip: string; // small side chip
  main: string; // primary icon fill
  accent: string; // secondary icon fill
  ink: string; // ingredient title colour
};

const PALETTES: Record<string, Palette> = {
  "Co-enzyme Q10": {
    bg: "#FBD1AA",
    chip: "#E9A57C",
    main: "#D46A50",
    accent: "#8B3D2C",
    ink: "#5A2A1A"
  },
  "Trans-Resveratrol": {
    bg: "#B8DDDE",
    chip: "#7DB5B7",
    main: "#5A9BA1",
    accent: "#2E5B60",
    ink: "#1F4247"
  },
  "Alpha-Lipoic Acid": {
    bg: "#EAC5D5",
    chip: "#C583A0",
    main: "#B9647F",
    accent: "#7C3C55",
    ink: "#4B1F35"
  },
  "Vitamin C (L-Ascorbic Acid)": {
    bg: "#F3E39A",
    chip: "#D9BF66",
    main: "#C2A83D",
    accent: "#7C6B22",
    ink: "#4A3F14"
  },
  "Vitamin E (Tocotrienols)": {
    bg: "#D5C4E1",
    chip: "#A38ABE",
    main: "#7C5F9A",
    accent: "#4A3563",
    ink: "#301E44"
  },
  Lycopene: {
    bg: "#C4DAE9",
    chip: "#7EA6C7",
    main: "#C64848",
    accent: "#7A2828",
    ink: "#1E3A55"
  },
  Astaxanthin: {
    bg: "#F0B5B0",
    chip: "#D67A73",
    main: "#B85450",
    accent: "#772A28",
    ink: "#4E1512"
  },
  "Vitamin D3 (Cholecalciferol)": {
    bg: "#C6D8B4",
    chip: "#8CAF74",
    main: "#6B8A4C",
    accent: "#3F5A28",
    ink: "#26381A"
  },
  "Vitamin K2-7 (MK-7)": {
    bg: "#F0DDA8",
    chip: "#D0B96D",
    main: "#B08A3D",
    accent: "#6E521E",
    ink: "#3F2E10"
  },
  "Selenium (Sodium selenite)": {
    bg: "#D5DBE0",
    chip: "#8894A0",
    main: "#5F6E7E",
    accent: "#2E3A47",
    ink: "#1B2532"
  }
};

const FALLBACK: Palette = {
  bg: "#F2E9D2",
  chip: "#B8935E",
  main: "#8B6E44",
  accent: "#4B3A22",
  ink: "#3F2E10"
};

/* ---------- Illustrated icons ---------- */

function IngredientArt({
  name,
  palette
}: {
  name: string;
  palette: Palette;
}) {
  const { main, accent, bg } = palette;
  const glow = `${bg}dd`;

  const icon = (() => {
    switch (name) {
      case "Co-enzyme Q10":
        return (
          <g>
            {/* energy lines */}
            <g stroke={accent} strokeWidth="4" strokeLinecap="round">
              <line x1="10" y1="30" x2="4" y2="30" />
              <line x1="12" y1="18" x2="6" y2="14" />
              <line x1="12" y1="42" x2="6" y2="46" />
            </g>
            {/* heart body */}
            <path
              d="M32 55 C 15 44, 8 34, 8 22 C 8 15, 14 10, 20 10 C 25 10, 29 12, 32 16 C 35 12, 39 10, 44 10 C 50 10, 56 15, 56 22 C 56 34, 49 44, 32 55 Z"
              fill={main}
              stroke={accent}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* heart highlight */}
            <path d="M18 20 Q 20 15, 26 16" stroke={glow} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.55" />
            {/* muscle arm */}
            <g transform="translate(42 26)">
              <rect x="0" y="0" width="14" height="8" rx="3" fill={accent} />
              <circle cx="16" cy="4" r="6" fill={accent} />
              <circle cx="16" cy="4" r="3" fill={main} opacity="0.6" />
            </g>
          </g>
        );
      case "Trans-Resveratrol":
        return (
          <g>
            <path
              d="M32 55 C 15 44, 8 34, 8 22 C 8 15, 14 10, 20 10 C 25 10, 29 12, 32 16 C 35 12, 39 10, 44 10 C 50 10, 56 15, 56 22 C 56 34, 49 44, 32 55 Z"
              fill={main}
              stroke={accent}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* orbit rings around the heart */}
            <ellipse cx="32" cy="30" rx="26" ry="9" fill="none" stroke={accent} strokeWidth="2" transform="rotate(-20 32 30)" />
            <ellipse cx="32" cy="30" rx="26" ry="9" fill="none" stroke={accent} strokeWidth="2" transform="rotate(20 32 30)" />
            <circle cx="8" cy="24" r="2.5" fill={accent} />
            <circle cx="56" cy="36" r="2.5" fill={accent} />
            <circle cx="45" cy="15" r="2.5" fill={accent} />
          </g>
        );
      case "Alpha-Lipoic Acid":
        return (
          <g>
            {/* cycle arrows */}
            <path
              d="M6 32 A 26 26 0 0 1 32 6"
              fill="none"
              stroke={accent}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path d="M28 10 L 32 6 L 36 10" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M58 32 A 26 26 0 0 1 32 58"
              fill="none"
              stroke={accent}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path d="M36 54 L 32 58 L 28 54" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* cell body */}
            <circle cx="32" cy="32" r="18" fill={main} stroke={accent} strokeWidth="2" />
            {/* smile face */}
            <circle cx="26" cy="29" r="2" fill={accent} />
            <circle cx="38" cy="29" r="2" fill={accent} />
            <path d="M26 36 Q 32 40, 38 36" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* nucleus */}
            <circle cx="32" cy="32" r="5" fill={accent} opacity="0.35" />
          </g>
        );
      case "Vitamin C (L-Ascorbic Acid)":
        return (
          <g>
            {/* shield */}
            <path
              d="M32 6 L 12 12 L 12 30 C 12 42, 22 52, 32 56 C 42 52, 52 42, 52 30 L 52 12 Z"
              fill={main}
              stroke={accent}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M32 12 L 18 16 L 18 30 C 18 38, 25 46, 32 50 C 39 46, 46 38, 46 30 L 46 16 Z"
              fill={bg}
            />
            {/* skin layer */}
            <g>
              <path d="M8 54 Q 16 50, 24 54 T 40 54 T 56 54" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <circle cx="18" cy="58" r="1.6" fill={accent} />
              <circle cx="30" cy="58" r="1.6" fill={accent} />
              <circle cx="42" cy="58" r="1.6" fill={accent} />
              <circle cx="54" cy="58" r="1.6" fill={accent} />
            </g>
            {/* C letter */}
            <text
              x="32"
              y="36"
              textAnchor="middle"
              fill={accent}
              fontFamily="Iowan Old Style, Palatino, serif"
              fontSize="18"
              fontWeight="700"
            >
              C
            </text>
          </g>
        );
      case "Vitamin E (Tocotrienols)":
        return (
          <g>
            <path
              d="M32 6 L 12 12 L 12 30 C 12 42, 22 52, 32 56 C 42 52, 52 42, 52 30 L 52 12 Z"
              fill={main}
              stroke={accent}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M32 12 L 18 16 L 18 30 C 18 38, 25 46, 32 50 C 39 46, 46 38, 46 30 L 46 16 Z"
              fill={bg}
            />
            {/* skin layer under the shield */}
            <g>
              <path d="M8 54 Q 16 50, 24 54 T 40 54 T 56 54" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M8 58 Q 16 54, 24 58 T 40 58 T 56 58" stroke={accent} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
            </g>
            <text
              x="32"
              y="36"
              textAnchor="middle"
              fill={accent}
              fontFamily="Iowan Old Style, Palatino, serif"
              fontSize="18"
              fontWeight="700"
            >
              E
            </text>
          </g>
        );
      case "Lycopene":
        return (
          <g>
            <path
              d="M32 55 C 12 42, 4 30, 4 18 C 4 10, 12 4, 20 4 C 26 4, 30 7, 32 12 C 34 7, 38 4, 44 4 C 52 4, 60 10, 60 18 C 60 30, 52 42, 32 55 Z"
              fill={main}
              stroke={accent}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* pulse line */}
            <path
              d="M10 30 L 20 30 L 24 22 L 30 38 L 36 22 L 40 30 L 54 30"
              stroke={bg}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <ellipse cx="20" cy="14" rx="6" ry="3" fill={bg} opacity="0.4" />
          </g>
        );
      case "Astaxanthin":
        return (
          <g>
            {/* Eyelashes */}
            <g stroke={accent} strokeWidth="2.5" strokeLinecap="round">
              <line x1="10" y1="16" x2="14" y2="22" />
              <line x1="22" y1="10" x2="24" y2="18" />
              <line x1="32" y1="8" x2="32" y2="16" />
              <line x1="42" y1="10" x2="40" y2="18" />
              <line x1="54" y1="16" x2="50" y2="22" />
            </g>
            {/* eye outline */}
            <path
              d="M6 34 Q 18 20, 32 20 Q 46 20, 58 34 Q 46 48, 32 48 Q 18 48, 6 34 Z"
              fill={bg}
              stroke={accent}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* iris */}
            <circle cx="32" cy="34" r="11" fill={main} stroke={accent} strokeWidth="2" />
            {/* pupil */}
            <circle cx="32" cy="34" r="5" fill={accent} />
            {/* glint */}
            <circle cx="28" cy="30" r="2" fill="#FFFFFF" opacity="0.9" />
            {/* radial iris lines */}
            <g stroke={accent} strokeWidth="1" opacity="0.55">
              <line x1="32" y1="24" x2="32" y2="27" />
              <line x1="32" y1="41" x2="32" y2="44" />
              <line x1="22" y1="34" x2="25" y2="34" />
              <line x1="39" y1="34" x2="42" y2="34" />
            </g>
          </g>
        );
      case "Vitamin D3 (Cholecalciferol)":
        return (
          <g>
            {/* shield behind bone */}
            <path
              d="M42 6 L 22 12 L 22 30 C 22 42, 32 52, 42 56 C 52 52, 62 42, 62 30 L 62 12 Z"
              fill={main}
              stroke={accent}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* muscle arm */}
            <g transform="translate(42 26)">
              <rect x="0" y="0" width="14" height="8" rx="3" fill={bg} stroke={accent} strokeWidth="1.5" />
              <circle cx="16" cy="4" r="6" fill={bg} stroke={accent} strokeWidth="1.5" />
              <path d="M12 3 Q 15 6, 12 8" stroke={accent} strokeWidth="1.5" fill="none" />
            </g>
            {/* bone */}
            <g transform="translate(0 8) rotate(-30 20 30)">
              <path
                d="M4 24 C 4 20 7 17 11 17 C 14 17 17 19 18 22 L 34 22 C 35 19 38 17 41 17 C 45 17 48 20 48 24 C 48 27 46 30 43 31 C 46 32 48 35 48 38 C 48 42 45 45 41 45 C 38 45 35 43 34 40 L 18 40 C 17 43 14 45 11 45 C 7 45 4 42 4 38 C 4 35 6 32 9 31 C 6 30 4 27 4 24 Z"
                fill={bg}
                stroke={accent}
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </g>
          </g>
        );
      case "Vitamin K2-7 (MK-7)":
        return (
          <g>
            {/* bone centred, tilted */}
            <g transform="rotate(-25 32 32)">
              <path
                d="M8 26 C 8 22 11 19 15 19 C 18 19 21 21 22 24 L 42 24 C 43 21 46 19 49 19 C 53 19 56 22 56 26 C 56 29 54 32 51 33 C 54 34 56 37 56 40 C 56 44 53 47 49 47 C 46 47 43 45 42 42 L 22 42 C 21 45 18 47 15 47 C 11 47 8 44 8 40 C 8 37 10 34 13 33 C 10 32 8 29 8 26 Z"
                fill={main}
                stroke={accent}
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <line x1="24" y1="33" x2="40" y2="33" stroke={accent} strokeWidth="1.4" opacity="0.5" />
            </g>
          </g>
        );
      case "Selenium (Sodium selenite)":
        return (
          <g>
            {/* shield */}
            <path
              d="M32 6 L 12 12 L 12 30 C 12 42, 22 52, 32 56 C 42 52, 52 42, 52 30 L 52 12 Z"
              fill={main}
              stroke={accent}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Se text (element symbol) */}
            <text
              x="32"
              y="38"
              textAnchor="middle"
              fill={bg}
              fontFamily="Iowan Old Style, Palatino, serif"
              fontSize="18"
              fontWeight="700"
            >
              Se
            </text>
            {/* rays */}
            <g stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.55">
              <line x1="6" y1="26" x2="10" y2="26" />
              <line x1="54" y1="26" x2="58" y2="26" />
              <line x1="8" y1="18" x2="11" y2="20" />
              <line x1="56" y1="18" x2="53" y2="20" />
            </g>
          </g>
        );
      default:
        return (
          <circle cx="32" cy="32" r="20" fill={main} stroke={accent} strokeWidth="2" />
        );
    }
  })();

  return (
    <svg viewBox="0 0 64 64" className="h-20 w-20 shrink-0" aria-hidden>
      {icon}
    </svg>
  );
}

/* ---------- Section ---------- */

export default function Ingredients({ data }: { data: SiteContent["ingredientsSection"] }) {
  return (
    <section id="ingredients" className="relative bg-canvas py-28 md:py-40">
      <div className="container-app">
        <div className="max-w-2xl">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-lg">{data.title}</h2>
          <p className="mt-6 lede">{data.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {data.items.map((ing, i) => {
            const p = PALETTES[ing.name] ?? FALLBACK;
            return (
              <motion.article
                key={ing.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
                className="relative overflow-hidden rounded-3xl p-6 md:p-8"
                style={{ backgroundColor: p.bg }}
              >
                <div className="flex items-start gap-5 md:gap-6">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <span
                        className="tnum text-[13px] font-bold uppercase tracking-widest"
                        style={{ color: p.accent }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="text-lg font-bold uppercase tracking-tight md:text-xl"
                        style={{ color: p.ink, letterSpacing: "0.01em" }}
                      >
                        {ing.name}
                      </h3>
                    </div>
                    <p
                      className="mt-3 text-[14px] leading-relaxed md:text-[15px]"
                      style={{ color: p.ink, opacity: 0.82 }}
                    >
                      {ing.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2">
                      <span
                        className="tnum rounded-full px-3 py-1 text-[12px] font-semibold tracking-tight"
                        style={{ backgroundColor: p.chip, color: p.ink }}
                      >
                        {ing.dose}
                      </span>
                    </div>
                  </div>
                  <IngredientArt name={ing.name} palette={p} />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
