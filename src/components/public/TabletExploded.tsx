"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Ingredient, SiteContent } from "@/types/content";

type Props = {
  data: SiteContent["ingredientsSection"];
};

const RADIUS_OUTER = 190;
const RADIUS_INNER = 62;
const EXPLODE_DISTANCE = 30;
const CENTER = { x: 240, y: 240 };
const VIEWBOX = 480;

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function wedgePath(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number) {
  const p1 = polarPoint(cx, cy, rOuter, startDeg);
  const p2 = polarPoint(cx, cy, rOuter, endDeg);
  const p3 = polarPoint(cx, cy, rInner, endDeg);
  const p4 = polarPoint(cx, cy, rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    "Z"
  ].join(" ");
}

/** subtle warm-to-cool wedge colour ramp so each is distinguishable but coherent */
const WEDGE_FILLS = [
  "#F1E7CE",
  "#EFE0C0",
  "#EBD5A8",
  "#E6C892",
  "#DEBB7A",
  "#D4B884",
  "#C9A96E",
  "#B8935E",
  "#A98452",
  "#8B6E44"
];

export default function TabletExploded({ data }: Props) {
  const [exploded, setExploded] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [detail, setDetail] = useState<{ index: number; ing: Ingredient } | null>(null);

  const items = data.items.slice(0, 10);
  const wedge = 360 / items.length;

  useEffect(() => {
    if (!exploded) {
      setDetail(null);
      setHovered(null);
    }
  }, [exploded]);

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <div className="relative aspect-square w-full max-w-[560px] mx-auto">
        <svg
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          className="h-full w-full cursor-pointer"
          onClick={() => setExploded((v) => !v)}
          aria-label="Interactive AETERNYX tablet — click to explode into ingredient wedges"
        >
          <defs>
            <radialGradient id="cx_tablet" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFDF6" />
              <stop offset="60%" stopColor="#F1EAD2" />
              <stop offset="100%" stopColor="#B8AC85" />
            </radialGradient>
            <radialGradient id="cx_shadow" cx="50%" cy="50%" r="60%">
              <stop offset="60%" stopColor="rgba(0,0,0,0)" />
              <stop offset="100%" stopColor="rgba(23,32,61,0.20)" />
            </radialGradient>
            <linearGradient id="cx_gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B8935E" />
              <stop offset="55%" stopColor="#D4B884" />
              <stop offset="100%" stopColor="#8B6E44" />
            </linearGradient>
          </defs>

          <ellipse cx={CENTER.x} cy={CENTER.y + 8} rx={RADIUS_OUTER + 20} ry="26" fill="url(#cx_shadow)" />

          <AnimatePresence>
            {!exploded ? (
              <motion.g
                key="closed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
              >
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r={RADIUS_OUTER}
                  fill="url(#cx_tablet)"
                  stroke="#A99C74"
                  strokeWidth="0.6"
                />
                <line
                  x1={CENTER.x - RADIUS_OUTER + 20}
                  y1={CENTER.y}
                  x2={CENTER.x + RADIUS_OUTER - 20}
                  y2={CENTER.y}
                  stroke="#8F8460"
                  strokeWidth="1"
                  strokeOpacity="0.35"
                />
                <ellipse
                  cx={CENTER.x - 60}
                  cy={CENTER.y - 55}
                  rx="60"
                  ry="24"
                  fill="rgba(255,255,255,0.55)"
                />
                <text
                  x={CENTER.x}
                  y={CENTER.y + 8}
                  textAnchor="middle"
                  fill="#17203D"
                  fontFamily="Iowan Old Style, Palatino, serif"
                  fontSize="28"
                  fontWeight="700"
                  letterSpacing="4"
                  opacity="0.75"
                >
                  ÆX
                </text>
                <text
                  x={CENTER.x}
                  y={CENTER.y + 60}
                  textAnchor="middle"
                  fill="#6B7085"
                  fontFamily="Inter, sans-serif"
                  fontSize="11"
                  fontWeight="600"
                  letterSpacing="4"
                >
                  TAP TO OPEN
                </text>
              </motion.g>
            ) : (
              <motion.g
                key="exploded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {items.map((ing, i) => {
                  const startDeg = i * wedge;
                  const endDeg = (i + 1) * wedge;
                  const midDeg = startDeg + wedge / 2;
                  const offset = polarPoint(0, 0, EXPLODE_DISTANCE, midDeg);
                  const label = polarPoint(CENTER.x + offset.x, CENTER.y + offset.y, (RADIUS_OUTER + RADIUS_INNER) / 2, midDeg);
                  const isHovered = hovered === i;
                  const isActive = detail?.index === i;
                  return (
                    <motion.g
                      key={ing.name}
                      initial={{ x: 0, y: 0, opacity: 0 }}
                      animate={{ x: offset.x, y: offset.y, opacity: 1 }}
                      exit={{ x: 0, y: 0, opacity: 0 }}
                      transition={{ duration: 0.55, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetail({ index: i, ing });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <path
                        d={wedgePath(CENTER.x, CENTER.y, RADIUS_OUTER, RADIUS_INNER, startDeg, endDeg)}
                        fill={WEDGE_FILLS[i % WEDGE_FILLS.length]}
                        stroke={isActive ? "#17203D" : isHovered ? "#8B6E44" : "#A99C74"}
                        strokeWidth={isActive ? 2 : isHovered ? 1.6 : 0.6}
                        style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
                      />
                      <text
                        x={label.x}
                        y={label.y + 4}
                        textAnchor="middle"
                        fill="#17203D"
                        fontFamily="Inter, sans-serif"
                        fontSize="14"
                        fontWeight="700"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </text>
                    </motion.g>
                  );
                })}
                <circle
                  cx={CENTER.x}
                  cy={CENTER.y}
                  r={RADIUS_INNER - 6}
                  fill="url(#cx_tablet)"
                  stroke="url(#cx_gold)"
                  strokeWidth="1.5"
                />
                <text
                  x={CENTER.x}
                  y={CENTER.y - 4}
                  textAnchor="middle"
                  fill="#17203D"
                  fontFamily="Inter, sans-serif"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="3"
                >
                  10
                </text>
                <text
                  x={CENTER.x}
                  y={CENTER.y + 12}
                  textAnchor="middle"
                  fill="#6B7085"
                  fontFamily="Inter, sans-serif"
                  fontSize="8"
                  fontWeight="600"
                  letterSpacing="2"
                >
                  ACTIVES
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Floating detail card for the selected wedge */}
        <AnimatePresence>
          {exploded && detail ? (
            <motion.div
              key={detail.ing.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-x-0 bottom-2 mx-auto max-w-md rounded-2xl border border-hairline bg-canvas/95 p-4 shadow-card backdrop-blur"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="tnum text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                    {String(detail.index + 1).padStart(2, "0")}
                  </span>
                  <h4 className="text-lg font-semibold tracking-tight text-ink">{detail.ing.name}</h4>
                </div>
                <span className="tnum shrink-0 rounded-full bg-gold-soft px-3 py-1 text-[12px] font-semibold text-gold-deep">
                  {detail.ing.dose}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{detail.ing.description}</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 text-[12px] text-muted">
        {exploded ? (
          <>
            <span>Click a wedge to read its ingredient · </span>
            <button
              type="button"
              onClick={() => setExploded(false)}
              className="btn-link text-[12px]"
            >
              Close tablet
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setExploded(true)}
            className="btn-link"
          >
            Open the tablet
            <span aria-hidden>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
