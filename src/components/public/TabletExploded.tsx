"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = { data: SiteContent["ingredientsSection"] };

/**
 * Body-part that each active is best associated with. Used to render the
 * icon in the detail card ("where it acts").
 */
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
  heart: "Cardiovascular",
  brain: "Central nervous system",
  cell: "Cellular / redox",
  skin: "Skin & collagen",
  eye: "Vision & macula",
  bone: "Bone & vascular calcium",
  shield: "Immune system"
};

function BodyGraphic({ part }: { part: string }) {
  const p: Record<string, JSX.Element> = {
    heart: (
      <path
        d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    ),
    brain: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M9 4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h.5V4Z" />
        <path d="M15 4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-.5V4Z" />
      </g>
    ),
    cell: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
      </g>
    ),
    skin: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 12c4-4 12-4 16 0-4 4-12 4-16 0Z" />
        <path d="M8 11a1 1 0 0 1 0 2M14 11a1 1 0 0 1 0 2" />
      </g>
    ),
    eye: (
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </g>
    ),
    bone: (
      <path
        d="M6.5 7.5a2 2 0 1 1 3-1.5l6 6a2 2 0 1 1 1.5 3l-1 1a2 2 0 1 1-3 1.5l-6-6a2 2 0 1 1-1.5-3Z"
        stroke="currentColor"
        strokeWidth="1.3"
        fill="none"
        strokeLinejoin="round"
      />
    ),
    shield: (
      <path
        d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    )
  };
  return (
    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-gold-soft">
      <svg viewBox="0 0 24 24" className="h-12 w-12 text-gold-deep" fill="none" aria-hidden>
        {p[part] ?? p.cell}
      </svg>
    </div>
  );
}

/* ---------- Tablet visualisation ---------- */

const DISC_W = 46;
const DISC_H = 96;
const GAP = 12;
const STAGE_W = 700;
const STAGE_H = 260;
const CAPSULE_W = 420;
const CAPSULE_H = 96;
const CAPSULE_Y = STAGE_H / 2 - CAPSULE_H / 2;
const DISC_Y = STAGE_H / 2;

export default function TabletExploded({ data }: Props) {
  const items = data.items.slice(0, 10);
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [autoplayStopped, setAutoplayStopped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Trigger only when the section is visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Autoplay: open once + cycle briefly through the first few ingredients
  useEffect(() => {
    if (!inView || autoplayStopped) return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setOpen(true), 900));
    // Show ingredients 1 → 10 with a short dwell, then reform
    items.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          if (!autoplayStopped) setSelectedIdx(i);
        }, 1800 + i * 1400)
      );
    });
    timers.push(
      window.setTimeout(() => {
        if (!autoplayStopped) {
          setSelectedIdx(null);
          setOpen(false);
        }
      }, 1800 + items.length * 1400 + 1600)
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [inView, autoplayStopped, items.length, items]);

  function stopAutoplay() {
    setAutoplayStopped(true);
  }

  function toggleOpen() {
    stopAutoplay();
    if (open) {
      setSelectedIdx(null);
      setOpen(false);
    } else {
      setOpen(true);
    }
  }

  function tapDisc(i: number) {
    stopAutoplay();
    setSelectedIdx((cur) => (cur === i ? null : i));
  }

  const rowWidth = DISC_W * items.length + GAP * (items.length - 1);
  const rowStartX = (STAGE_W - rowWidth) / 2;
  const capsuleX = (STAGE_W - CAPSULE_W) / 2;
  const selectedItem = selectedIdx !== null ? items[selectedIdx] : null;
  const selectedPart = selectedItem ? BODY_PARTS[selectedItem.name] ?? "cell" : null;

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-4xl">
      {/* Stage */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          className="mx-auto block h-auto w-full max-h-[300px]"
          role="img"
          aria-label="AETERNYX tablet composition"
        >
          <defs>
            <radialGradient id="td_tablet" cx="35%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#FFFDF6" />
              <stop offset="45%" stopColor="#F1EAD2" />
              <stop offset="100%" stopColor="#B8AC85" />
            </radialGradient>
            <linearGradient id="td_gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B8935E" />
              <stop offset="55%" stopColor="#D4B884" />
              <stop offset="100%" stopColor="#8B6E44" />
            </linearGradient>
            <radialGradient id="td_shadow" cx="50%" cy="50%" r="60%">
              <stop offset="60%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(23,32,61,0.20)" />
            </radialGradient>
          </defs>

          {/* soft shadow */}
          <motion.ellipse
            cx={STAGE_W / 2}
            cy={STAGE_H / 2 + 66}
            rx={open ? rowWidth / 2 + 20 : CAPSULE_W / 2}
            ry="14"
            fill="url(#td_shadow)"
            animate={{ rx: open ? rowWidth / 2 + 20 : CAPSULE_W / 2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          <AnimatePresence mode="wait">
            {open ? (
              <motion.g
                key="open"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {items.map((ing, i) => {
                  const cx = rowStartX + i * (DISC_W + GAP) + DISC_W / 2;
                  const selected = selectedIdx === i;
                  const dimmed = selectedIdx !== null && !selected;
                  return (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0, y: -6, scale: 0.6 }}
                      animate={{
                        opacity: dimmed ? 0.35 : 1,
                        y: 0,
                        scale: selected ? 1.14 : 1
                      }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{
                        duration: 0.55,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.05 + i * 0.04
                      }}
                      style={{ transformOrigin: `${cx}px ${DISC_Y}px`, cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        tapDisc(i);
                      }}
                    >
                      <ellipse
                        cx={cx}
                        cy={DISC_Y}
                        rx={DISC_W / 2}
                        ry={DISC_H / 2}
                        fill="url(#td_tablet)"
                        stroke={selected ? "#17203D" : "#A99C74"}
                        strokeWidth={selected ? 2 : 0.5}
                      />
                      {/* subtle score line */}
                      <line
                        x1={cx}
                        y1={DISC_Y - DISC_H / 2 + 6}
                        x2={cx}
                        y2={DISC_Y + DISC_H / 2 - 6}
                        stroke="#8F8460"
                        strokeOpacity="0.35"
                        strokeWidth="0.6"
                      />
                      <text
                        x={cx}
                        y={DISC_Y + DISC_H / 2 + 22}
                        textAnchor="middle"
                        fill={selected ? "#17203D" : "#6B7085"}
                        fontFamily="Inter, sans-serif"
                        fontSize="11"
                        fontWeight="700"
                        letterSpacing="1"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </text>
                    </motion.g>
                  );
                })}
              </motion.g>
            ) : (
              <motion.g
                key="closed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: `${STAGE_W / 2}px ${STAGE_H / 2}px`, cursor: "pointer" }}
                onClick={() => toggleOpen()}
              >
                <rect
                  x={capsuleX}
                  y={CAPSULE_Y}
                  width={CAPSULE_W}
                  height={CAPSULE_H}
                  rx={CAPSULE_H / 2}
                  fill="url(#td_tablet)"
                  stroke="#A99C74"
                  strokeWidth="0.6"
                />
                {/* score line */}
                <line
                  x1={STAGE_W / 2}
                  y1={CAPSULE_Y + 8}
                  x2={STAGE_W / 2}
                  y2={CAPSULE_Y + CAPSULE_H - 8}
                  stroke="#8F8460"
                  strokeOpacity="0.55"
                  strokeWidth="1.2"
                />
                {/* wordmark on capsule */}
                <text
                  x={STAGE_W / 2}
                  y={STAGE_H / 2 + 6}
                  textAnchor="middle"
                  fill="url(#td_gold)"
                  fontFamily="Iowan Old Style, Palatino, serif"
                  fontSize="18"
                  fontWeight="700"
                  letterSpacing="5"
                  opacity="0.8"
                >
                  AETERNYX
                </text>
              </motion.g>
            )}
          </AnimatePresence>

          {/* instruction pill */}
          <text
            x={STAGE_W / 2}
            y={STAGE_H - 8}
            textAnchor="middle"
            fill="#6B7085"
            fontFamily="Inter, sans-serif"
            fontSize="10"
            fontWeight="600"
            letterSpacing="4"
          >
            {open ? "TAP AN INGREDIENT" : "TAP TO OPEN"}
          </text>
        </svg>

        {/* Tap zone (closed only — click through when open so wedges get clicks) */}
        {!open ? (
          <button
            type="button"
            onClick={toggleOpen}
            aria-label="Open the AETERNYX tablet"
            className="absolute inset-0"
          />
        ) : null}
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
        <button type="button" onClick={toggleOpen} className="btn-link">
          {open ? (
            <>
              <span aria-hidden>←</span> Reform tablet
            </>
          ) : (
            <>
              Open the tablet <span aria-hidden>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
