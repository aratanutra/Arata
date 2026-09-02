"use client";

import { motion } from "framer-motion";

type Props = {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
};

/**
 * AETERNYX™ tablet blister strip. Cinematic product render — brushed
 * aluminium foil, ten embossed tablets in a 2×5 grid, navy header with
 * gold AETERNYX wordmark and italic Cellular Intelligence™ tagline.
 * Deliberately no marketing-copy banner below the tablets.
 */
export default function TabletStrip({ size = "md", animate = true }: Props) {
  const height = size === "lg" ? 520 : size === "md" ? 400 : 300;

  const strip = (
    <svg
      viewBox="0 0 240 380"
      style={{ height, width: "auto" }}
      role="img"
      aria-label="AETERNYX™ tablet blister strip"
    >
      <defs>
        {/* brushed aluminium foil */}
        <linearGradient id="ts_foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E4DECC" />
          <stop offset="18%" stopColor="#F5EFDE" />
          <stop offset="50%" stopColor="#FBF7EA" />
          <stop offset="82%" stopColor="#EEE7D2" />
          <stop offset="100%" stopColor="#D6CFBB" />
        </linearGradient>
        <linearGradient id="ts_foil_h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        {/* navy header panel */}
        <linearGradient id="ts_navy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F2748" />
          <stop offset="55%" stopColor="#17203D" />
          <stop offset="100%" stopColor="#0D1424" />
        </linearGradient>
        {/* tablet body — subtle warm cream with a dome */}
        <radialGradient id="ts_tablet" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFDF6" />
          <stop offset="40%" stopColor="#F1EAD2" />
          <stop offset="78%" stopColor="#DFD4B0" />
          <stop offset="100%" stopColor="#B8AC85" />
        </radialGradient>
        {/* well shadow around each tablet on the foil */}
        <radialGradient id="ts_well" cx="50%" cy="50%" r="52%">
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(23,32,61,0.18)" />
        </radialGradient>
        {/* gold gradient for the wordmark */}
        <linearGradient id="ts_gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B8935E" />
          <stop offset="50%" stopColor="#D4B884" />
          <stop offset="100%" stopColor="#8B6E44" />
        </linearGradient>
        {/* soft outer drop shadow */}
        <filter id="ts_drop" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dy="4" result="off" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.35" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* foil card */}
      <g filter="url(#ts_drop)">
        <rect x="4" y="4" width="232" height="372" rx="16" fill="url(#ts_foil)" />
        <rect x="4" y="4" width="232" height="372" rx="16" fill="url(#ts_foil_h)" opacity="0.35" />
        <rect x="4" y="4" width="232" height="372" rx="16" fill="none" stroke="#B8B2A0" strokeOpacity="0.6" strokeWidth="0.6" />
      </g>

      {/* navy header */}
      <g>
        <rect x="14" y="14" width="212" height="66" rx="8" fill="url(#ts_navy)" />
        <rect x="14" y="14" width="212" height="66" rx="8" fill="none" stroke="rgba(184,147,94,0.35)" strokeWidth="0.5" />
        <text
          x="120"
          y="46"
          textAnchor="middle"
          fill="url(#ts_gold)"
          fontFamily="Iowan Old Style, Palatino, serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="4"
        >
          AETERNYX
        </text>
        <text
          x="181"
          y="34"
          fill="url(#ts_gold)"
          fontFamily="Inter, sans-serif"
          fontSize="7"
          fontWeight="600"
        >
          ™
        </text>
        <text
          x="120"
          y="64"
          textAnchor="middle"
          fill="#D4B884"
          fontFamily="Iowan Old Style, Palatino, serif"
          fontStyle="italic"
          fontSize="10"
          letterSpacing="1.5"
        >
          Cellular Intelligence
        </text>
        <text
          x="176"
          y="57"
          fill="#D4B884"
          fontFamily="Inter, sans-serif"
          fontSize="5"
          fontWeight="600"
        >
          ™
        </text>
      </g>

      {/* tablet grid — 2 columns × 5 rows */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 2 }).map((__, col) => {
          const cx = 78 + col * 84;
          const cy = 118 + row * 50;
          return (
            <g key={`t-${row}-${col}`}>
              {/* well shadow */}
              <ellipse cx={cx} cy={cy + 1.5} rx="30" ry="22" fill="url(#ts_well)" />
              {/* tablet body */}
              <ellipse cx={cx} cy={cy} rx="26" ry="19" fill="url(#ts_tablet)" stroke="#A99C74" strokeWidth="0.4" />
              {/* subtle score line */}
              <line x1={cx - 20} y1={cy} x2={cx + 20} y2={cy} stroke="#8F8460" strokeWidth="0.4" strokeOpacity="0.35" />
              {/* highlight */}
              <ellipse cx={cx - 8} cy={cy - 6} rx="7" ry="3" fill="rgba(255,255,255,0.65)" />
              <ellipse cx={cx + 10} cy={cy + 6} rx="4" ry="1.5" fill="rgba(255,255,255,0.25)" />
            </g>
          );
        })
      )}
    </svg>
  );

  if (!animate) return <div className="inline-block">{strip}</div>;

  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [-3, 1, -3] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block"
      style={{ filter: "drop-shadow(0 40px 50px rgba(23,32,61,0.22))" }}
    >
      {strip}
    </motion.div>
  );
}
