"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  type MotionValue
} from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = { data: SiteContent["ingredientsSection"] };

/* ---------- Ingredient meta ---------- */

const BODY_PARTS: Record<string, string> = {
  "Co-enzyme Q10": "heart",
  "Trans-Resveratrol": "brain",
  "Alpha-Lipoic Acid": "cell",
  "Vitamin C (L-Ascorbic Acid)": "skin",
  "Vitamin E (Tocotrienols)": "brain",
  Lycopene: "heart",
  Astaxanthin: "eye",
  "Vitamin D3 (Cholecalciferol)": "bone",
  "Vitamin K2-7 (MK-7)": "bone",
  "Selenium (Sodium selenite)": "shield"
};

const BODY_LABELS: Record<string, string> = {
  heart: "Cardiovascular system",
  brain: "Central nervous system",
  cell: "Cellular / redox",
  skin: "Skin & collagen",
  eye: "Vision & macula",
  bone: "Bone & vascular calcium",
  shield: "Immune system"
};

/** Atomic-style short label for each orbiting disc. */
const ATOM_LABELS: Record<string, string> = {
  "Co-enzyme Q10": "Q10",
  "Trans-Resveratrol": "Rsv",
  "Alpha-Lipoic Acid": "ALA",
  "Vitamin C (L-Ascorbic Acid)": "C",
  "Vitamin E (Tocotrienols)": "E",
  Lycopene: "Ly",
  Astaxanthin: "Ax",
  "Vitamin D3 (Cholecalciferol)": "D3",
  "Vitamin K2-7 (MK-7)": "K2",
  "Selenium (Sodium selenite)": "Se"
};

/* ---------- Body-part anatomical icons ---------- */

const BODY_ICONS: Record<string, JSX.Element> = {
  heart: (
    <g>
      <path
        d="M16 27 C 8 22, 3 17, 3 11 C 3 7, 6 4, 10 4 C 12.5 4, 14.5 5, 16 7 C 17.5 5, 19.5 4, 22 4 C 26 4, 29 7, 29 11 C 29 17, 24 22, 16 27 Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M12 11 L 14 10 L 16 12 L 18 10 L 20 11" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.55" strokeLinejoin="round" />
      <path d="M9 15 Q 16 19, 23 15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
    </g>
  ),
  brain: (
    <g>
      <path
        d="M11 4 C 6.5 4, 4 7, 4 11 C 4 12.5, 4.6 13.8, 5.6 14.6 C 4.9 15.3, 4.5 16.3, 4.5 17.4 C 4.5 19.5, 6 21, 8 21.2 C 8.4 23.4, 10.2 25, 12.4 25 C 13.7 25, 14.9 24.4, 15.7 23.5 L 16 23.5 L 16 4 C 14 4, 12.4 4, 11 4 Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M21 4 C 25.5 4, 28 7, 28 11 C 28 12.5, 27.4 13.8, 26.4 14.6 C 27.1 15.3, 27.5 16.3, 27.5 17.4 C 27.5 19.5, 26 21, 24 21.2 C 23.6 23.4, 21.8 25, 19.6 25 C 18.3 25, 17.1 24.4, 16.3 23.5 L 16 23.5 L 16 4 C 18 4, 19.6 4, 21 4 Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8 10 Q 10 8, 12 10" stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.55" />
      <path d="M20 10 Q 22 8, 24 10" stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.55" />
      <path d="M7.5 15 Q 9.5 13.5, 11.5 15" stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.55" />
      <path d="M20.5 15 Q 22.5 13.5, 24.5 15" stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.55" />
      <path d="M9.5 20 Q 11 18.5, 12.5 20" stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.55" />
      <path d="M19.5 20 Q 21 18.5, 22.5 20" stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.55" />
    </g>
  ),
  cell: (
    <g>
      <circle cx="16" cy="16" r="12" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="5" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1" />
      <circle cx="16.5" cy="15.5" r="1.6" fill="currentColor" fillOpacity="0.8" />
      <ellipse cx="9" cy="11" rx="1.7" ry="0.9" fill="currentColor" opacity="0.55" transform="rotate(-30 9 11)" />
      <ellipse cx="23" cy="10" rx="1.7" ry="0.9" fill="currentColor" opacity="0.55" transform="rotate(25 23 10)" />
      <ellipse cx="9.5" cy="22" rx="1.7" ry="0.9" fill="currentColor" opacity="0.55" transform="rotate(40 9.5 22)" />
      <ellipse cx="23.5" cy="22" rx="1.7" ry="0.9" fill="currentColor" opacity="0.55" transform="rotate(-25 23.5 22)" />
    </g>
  ),
  skin: (
    <g>
      <path d="M3 7 Q 8 5, 13 7 T 23 7 T 29 7" stroke="currentColor" strokeWidth="1.6" fill="none" />
      <path d="M3 13 Q 8 11, 13 13 T 23 13 T 29 13" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.75" />
      <path d="M3 20 Q 8 18, 13 20 T 23 20 T 29 20" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.5" />
      <path d="M3 27 Q 8 25, 13 27 T 23 27 T 29 27" stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.3" />
      <line x1="16" y1="2" x2="16" y2="7" stroke="currentColor" strokeWidth="1.2" opacity="0.75" />
      <circle cx="16" cy="12" r="1.6" fill="currentColor" fillOpacity="0.5" />
    </g>
  ),
  eye: (
    <g>
      <path
        d="M2 16 Q 8 6, 16 6 Q 24 6, 30 16 Q 24 26, 16 26 Q 8 26, 2 16 Z"
        fill="currentColor"
        fillOpacity="0.10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="6.5" fill="currentColor" fillOpacity="0.30" stroke="currentColor" strokeWidth="1" />
      <circle cx="16" cy="16" r="2.7" fill="currentColor" />
      <circle cx="14" cy="14" r="1" fill="#FFFFFF" opacity="0.9" />
      <line x1="16" y1="3" x2="16" y2="5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="8" y1="5" x2="9" y2="7" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="24" y1="5" x2="23" y2="7" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </g>
  ),
  bone: (
    <path
      d="M4 12 C 4 10 5.5 8.5 7.5 8.5 C 9 8.5 10.3 9.4 10.7 10.5 L 21.3 10.5 C 21.7 9.4 23 8.5 24.5 8.5 C 26.5 8.5 28 10 28 12 C 28 13.5 27.1 14.7 26 15.2 C 27.1 15.7 28 16.9 28 18.5 C 28 20.5 26.5 22 24.5 22 C 23 22 21.7 21.1 21.3 20 L 10.7 20 C 10.3 21.1 9 22 7.5 22 C 5.5 22 4 20.5 4 18.5 C 4 16.9 4.9 15.7 6 15.2 C 4.9 14.7 4 13.5 4 12 Z"
      fill="currentColor"
      fillOpacity="0.14"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  ),
  shield: (
    <g>
      <path
        d="M16 3 L 5 7 L 5 15 C 5 22, 12 27, 16 29 C 20 27, 27 22, 27 15 L 27 7 Z"
        fill="currentColor"
        fillOpacity="0.14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M16 10 L 16 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 15 L 21 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
};

function BodyGraphic({ part }: { part: string }) {
  return (
    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-gold-soft">
      <svg viewBox="0 0 32 32" className="h-14 w-14 text-gold-deep" fill="none" aria-hidden>
        {BODY_ICONS[part] ?? BODY_ICONS.cell}
      </svg>
    </div>
  );
}

/* ---------- Layout constants ---------- */

const STAGE = 640;
const CENTER = STAGE / 2;
const CAPSULE_W = 190;
const CAPSULE_H = 70;
const DISC_R = 26;
const TILT_DEG = -8;
/** milliseconds per degree of orbit rotation. 138 → ~50s per revolution */
const ORBIT_MS_PER_DEG = 138;
/** milliseconds between auto-cycle highlight changes */
const AUTO_CYCLE_MS = 3400;

type Orbit = { tilt: number; rx: number; ry: number };

/** Three crossing elliptical orbits, atom-style. */
const ORBITS: Orbit[] = [
  { tilt: 15, rx: 250, ry: 82 },
  { tilt: 75, rx: 235, ry: 92 },
  { tilt: 135, rx: 258, ry: 78 }
];

/** Which orbit each ingredient lives on, and its starting phase angle. */
const DISC_ASSIGN: { orbit: number; phase: number }[] = [
  { orbit: 0, phase: 0 },
  { orbit: 1, phase: 0 },
  { orbit: 2, phase: 0 },
  { orbit: 0, phase: 90 },
  { orbit: 1, phase: 120 },
  { orbit: 2, phase: 120 },
  { orbit: 0, phase: 180 },
  { orbit: 1, phase: 240 },
  { orbit: 2, phase: 240 },
  { orbit: 0, phase: 270 }
];

/* ---------- Orbiting disc ---------- */

function OrbitDisc({
  orbit,
  phase,
  orbitAngle,
  name,
  selected,
  dimmed,
  onTap
}: {
  orbit: Orbit;
  phase: number;
  orbitAngle: MotionValue<number>;
  name: string;
  selected: boolean;
  dimmed: boolean;
  onTap: () => void;
}) {
  const theta = (orbit.tilt * Math.PI) / 180;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  const x = useTransform(orbitAngle, (a) => {
    const angle = ((phase + a) * Math.PI) / 180;
    const lx = orbit.rx * Math.cos(angle);
    const ly = orbit.ry * Math.sin(angle);
    return CENTER + (lx * cosT - ly * sinT);
  });
  const y = useTransform(orbitAngle, (a) => {
    const angle = ((phase + a) * Math.PI) / 180;
    const lx = orbit.rx * Math.cos(angle);
    const ly = orbit.ry * Math.sin(angle);
    return CENTER + (lx * sinT + ly * cosT);
  });

  return (
    <motion.g
      style={{ x, y, cursor: "pointer" }}
      animate={{ scale: selected ? 1.32 : 1, opacity: dimmed ? 0.4 : 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={(e) => {
        e.stopPropagation();
        onTap();
      }}
    >
      {selected ? (
        <circle
          cx={0}
          cy={0}
          r={DISC_R + 9}
          fill="none"
          stroke="#17203D"
          strokeOpacity="0.2"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      ) : null}
      <circle
        cx={0}
        cy={0}
        r={DISC_R}
        fill="url(#td_tablet)"
        stroke={selected ? "#17203D" : "#8B5A2B"}
        strokeWidth={selected ? 2 : 0.6}
      />
      {/* small score line */}
      <line
        x1={-DISC_R + 6}
        y1={0}
        x2={DISC_R - 6}
        y2={0}
        stroke="#5C3818"
        strokeOpacity="0.4"
        strokeWidth="0.7"
      />
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fill={selected ? "#17203D" : "#3C3C43"}
        fontFamily="Inter, sans-serif"
        fontSize="11"
        fontWeight={selected ? 700 : 700}
        letterSpacing="0.5"
      >
        {name}
      </text>
    </motion.g>
  );
}

/* ---------- Main component ---------- */

export default function TabletExploded({ data }: Props) {
  const items = data.items.slice(0, 10);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [autoCyclePaused, setAutoCyclePaused] = useState(false);
  const orbitAngle = useMotionValue(0);

  // Orbit — continuous rotation. Autoplay by default, always.
  useAnimationFrame((t) => {
    orbitAngle.set((t / ORBIT_MS_PER_DEG) % 360);
  });

  // Auto-cycle the highlighted disc so the detail card walks through every ingredient
  useEffect(() => {
    if (autoCyclePaused) return;
    let index = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = window.setTimeout(() => {
      setSelectedIdx(0);
      interval = setInterval(() => {
        index = (index + 1) % items.length;
        setSelectedIdx(index);
      }, AUTO_CYCLE_MS);
    }, 900);
    return () => {
      window.clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [autoCyclePaused, items.length]);

  function tapDisc(i: number) {
    setAutoCyclePaused(true);
    setSelectedIdx((cur) => (cur === i ? null : i));
  }

  function resumeAutoplay() {
    setAutoCyclePaused(false);
  }

  const selectedItem = selectedIdx !== null ? items[selectedIdx] : null;
  const selectedPart = selectedItem ? BODY_PARTS[selectedItem.name] ?? "cell" : null;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="relative">
        <svg
          viewBox={`0 0 ${STAGE} ${STAGE}`}
          className="mx-auto block h-auto w-full max-w-[600px]"
          role="img"
          aria-label="AETERNYX tablet with ten ingredients orbiting like an atom"
        >
          <defs>
            <radialGradient id="td_tablet" cx="35%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#F5C078" />
              <stop offset="42%" stopColor="#E8A45C" />
              <stop offset="82%" stopColor="#C68044" />
              <stop offset="100%" stopColor="#8B5A2B" />
            </radialGradient>
            <radialGradient id="td_shadow" cx="50%" cy="50%" r="60%">
              <stop offset="60%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(23,32,61,0.22)" />
            </radialGradient>
          </defs>

          {/* Three orbit rings crossing at the centre */}
          {ORBITS.map((o, i) => (
            <g key={i} transform={`rotate(${o.tilt} ${CENTER} ${CENTER})`}>
              <ellipse
                cx={CENTER}
                cy={CENTER}
                rx={o.rx}
                ry={o.ry}
                fill="none"
                stroke="#8B5A2B"
                strokeOpacity="0.25"
                strokeDasharray="3 6"
                strokeWidth="1"
              />
            </g>
          ))}

          {/* Central capsule shadow */}
          <ellipse
            cx={CENTER}
            cy={CENTER + CAPSULE_H / 2 + 12}
            rx={CAPSULE_W / 2 + 8}
            ry="8"
            fill="url(#td_shadow)"
          />

          {/* Central capsule — sharp, amber, slight sketched tilt */}
          <g transform={`rotate(${TILT_DEG} ${CENTER} ${CENTER})`}>
            <rect
              x={CENTER - CAPSULE_W / 2}
              y={CENTER - CAPSULE_H / 2}
              width={CAPSULE_W}
              height={CAPSULE_H}
              rx={CAPSULE_H / 2}
              fill="url(#td_tablet)"
              stroke="#8B5A2B"
              strokeWidth="0.9"
            />
            <line
              x1={CENTER}
              y1={CENTER - CAPSULE_H / 2 + 8}
              x2={CENTER}
              y2={CENTER + CAPSULE_H / 2 - 8}
              stroke="#5C3818"
              strokeOpacity="0.6"
              strokeWidth="1.4"
            />
            <text
              x={CENTER}
              y={CENTER + 5}
              textAnchor="middle"
              fill="#17203D"
              fontFamily="Iowan Old Style, Palatino, serif"
              fontSize="15"
              fontWeight="700"
              letterSpacing="5"
              opacity="0.78"
            >
              AETERNYX
            </text>
          </g>

          {/* Ten orbiting ingredient discs, distributed across three orbits */}
          {items.map((ing, i) => {
            const assign = DISC_ASSIGN[i] ?? { orbit: 0, phase: 0 };
            return (
              <OrbitDisc
                key={i}
                orbit={ORBITS[assign.orbit]}
                phase={assign.phase}
                orbitAngle={orbitAngle}
                name={ATOM_LABELS[ing.name] ?? ing.name.slice(0, 3)}
                selected={selectedIdx === i}
                dimmed={selectedIdx !== null && selectedIdx !== i}
                onTap={() => tapDisc(i)}
              />
            );
          })}
        </svg>
      </div>

      {/* Ingredient detail card */}
      <AnimatePresence mode="wait">
        {selectedItem && selectedPart ? (
          <motion.div
            key={selectedItem.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="card-elevated mt-6 flex flex-col items-start gap-5 p-6 md:flex-row md:gap-7 md:p-8"
          >
            <BodyGraphic part={selectedPart} />
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="tnum text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                  {String((selectedIdx ?? 0) + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {selectedItem.name}
                </h3>
                <span className="tnum ml-auto shrink-0 rounded-full bg-gold-soft px-3 py-1 text-[12px] font-semibold text-gold-deep">
                  {selectedItem.dose}
                </span>
              </div>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-muted">
                Acts on: {BODY_LABELS[selectedPart] ?? "Cellular systems"}
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-muted md:text-[15px]">
                {selectedItem.description}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4 text-[12px]">
        {autoCyclePaused ? (
          <button type="button" onClick={resumeAutoplay} className="btn-link">
            <span aria-hidden>⟳</span> Resume auto-cycle
          </button>
        ) : (
          <span className="text-muted">Watch the atom, or tap a disc to hold it</span>
        )}
      </div>
    </div>
  );
}
