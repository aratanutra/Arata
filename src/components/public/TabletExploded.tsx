"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

type Props = { data: SiteContent["ingredientsSection"] };

/**
 * Body-part that each active is best associated with. Used to render the
 * anatomical graphic in the detail card ("where it acts").
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
  heart: "Cardiovascular system",
  brain: "Central nervous system",
  cell: "Cellular / redox",
  skin: "Skin & collagen",
  eye: "Vision & macula",
  bone: "Bone & vascular calcium",
  shield: "Immune system"
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
      <path
        d="M12 11 L 14 10 L 16 12 L 18 10 L 20 11"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.55"
        strokeLinejoin="round"
      />
      <path
        d="M9 15 Q 16 19, 23 15"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.45"
      />
      <path d="M16 12 L 16 20" stroke="currentColor" strokeWidth="0.9" opacity="0.35" />
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
      <circle
        cx="16"
        cy="16"
        r="12"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="16"
        cy="16"
        r="5"
        fill="currentColor"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="16.5" cy="15.5" r="1.6" fill="currentColor" fillOpacity="0.8" />
      <ellipse cx="9" cy="11" rx="1.7" ry="0.9" fill="currentColor" opacity="0.55" transform="rotate(-30 9 11)" />
      <ellipse cx="23" cy="10" rx="1.7" ry="0.9" fill="currentColor" opacity="0.55" transform="rotate(25 23 10)" />
      <ellipse cx="9.5" cy="22" rx="1.7" ry="0.9" fill="currentColor" opacity="0.55" transform="rotate(40 9.5 22)" />
      <ellipse cx="23.5" cy="22" rx="1.7" ry="0.9" fill="currentColor" opacity="0.55" transform="rotate(-25 23.5 22)" />
    </g>
  ),
  skin: (
    <g>
      <path
        d="M3 7 Q 8 5, 13 7 T 23 7 T 29 7"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
      <path
        d="M3 13 Q 8 11, 13 13 T 23 13 T 29 13"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M3 20 Q 8 18, 13 20 T 23 20 T 29 20"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M3 27 Q 8 25, 13 27 T 23 27 T 29 27"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="none"
        opacity="0.3"
      />
      {/* Hair follicle */}
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

  useEffect(() => {
    if (!inView || autoplayStopped) return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setOpen(true), 900));
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
      <div className="relative">
        <svg
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          className="mx-auto block h-auto w-full max-h-[300px]"
          role="img"
          aria-label="AETERNYX tablet composition"
        >
          <defs>
            {/* Warm amber tablet — matches the reference sketch */}
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
                {items.map((_ing, i) => {
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
                        stroke={selected ? "#17203D" : "#8B5A2B"}
                        strokeWidth={selected ? 2 : 0.6}
                      />
                      {/* subtle score line */}
                      <line
                        x1={cx}
                        y1={DISC_Y - DISC_H / 2 + 8}
                        x2={cx}
                        y2={DISC_Y + DISC_H / 2 - 8}
                        stroke="#5C3818"
                        strokeOpacity="0.4"
                        strokeWidth="0.8"
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
                  stroke="#8B5A2B"
                  strokeWidth="0.8"
                />
                {/* score line */}
                <line
                  x1={STAGE_W / 2}
                  y1={CAPSULE_Y + 10}
                  x2={STAGE_W / 2}
                  y2={CAPSULE_Y + CAPSULE_H - 10}
                  stroke="#5C3818"
                  strokeOpacity="0.6"
                  strokeWidth="1.4"
                />
                {/* wordmark on capsule — navy for contrast against amber */}
                <text
                  x={STAGE_W / 2}
                  y={STAGE_H / 2 + 6}
                  textAnchor="middle"
                  fill="#17203D"
                  fontFamily="Iowan Old Style, Palatino, serif"
                  fontSize="18"
                  fontWeight="700"
                  letterSpacing="5"
                  opacity="0.72"
                >
                  AETERNYX
                </text>
              </motion.g>
            )}
          </AnimatePresence>

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

        {!open ? (
          <button
            type="button"
            onClick={toggleOpen}
            aria-label="Open the AETERNYX tablet"
            className="absolute inset-0"
          />
        ) : null}
      </div>

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
