"use client";

import { motion } from "framer-motion";

type Props = {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
};

/**
 * Aeternyx tablet blister strip. Renders a 2x5 grid of round tablets in
 * an aluminium blister sheet with a printed navy header carrying the
 * AETERNYX wordmark in gold. Matches the product artwork.
 */
export default function TabletStrip({ size = "md", animate = true }: Props) {
  const height = size === "lg" ? 500 : size === "md" ? 380 : 280;

  const strip = (
    <svg
      viewBox="0 0 220 360"
      style={{ height, width: "auto" }}
      role="img"
      aria-label="Aeternyx tablet blister strip"
    >
      <defs>
        <linearGradient id="ts_foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8E4D6" />
          <stop offset="50%" stopColor="#F5EFDE" />
          <stop offset="100%" stopColor="#D9D2BE" />
        </linearGradient>
        <linearGradient id="ts_navy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2340" />
          <stop offset="100%" stopColor="#0F1628" />
        </linearGradient>
        <radialGradient id="ts_tablet" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FBF7EA" />
          <stop offset="55%" stopColor="#EEE6CE" />
          <stop offset="100%" stopColor="#C9BE9E" />
        </radialGradient>
        <linearGradient id="ts_gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B8935E" />
          <stop offset="50%" stopColor="#D4B884" />
          <stop offset="100%" stopColor="#8B6E44" />
        </linearGradient>
        <filter id="ts_shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      <rect x="2" y="2" width="216" height="356" rx="14" fill="url(#ts_foil)" stroke="#B8B2A0" strokeWidth="0.5" />

      <rect x="12" y="12" width="196" height="60" rx="6" fill="url(#ts_navy)" />
      <text
        x="110"
        y="42"
        textAnchor="middle"
        fill="url(#ts_gold)"
        fontFamily="Iowan Old Style, Palatino, serif"
        fontSize="20"
        fontWeight="700"
        letterSpacing="3"
      >
        AETERNYX
      </text>
      <text
        x="110"
        y="60"
        textAnchor="middle"
        fill="#D4B884"
        fontFamily="Iowan Old Style, Palatino, serif"
        fontStyle="italic"
        fontSize="9"
        letterSpacing="1.5"
      >
        Cellular Intelligence
      </text>

      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 2 }).map((__, col) => {
          const cx = 68 + col * 84;
          const cy = 106 + row * 52;
          return (
            <g key={`t-${row}-${col}`}>
              <ellipse cx={cx + 1} cy={cy + 2} rx="26" ry="19" fill="rgba(0,0,0,0.10)" filter="url(#ts_shadow)" />
              <ellipse cx={cx} cy={cy} rx="26" ry="19" fill="url(#ts_tablet)" stroke="#B0A784" strokeWidth="0.4" />
              <ellipse cx={cx - 7} cy={cy - 5} rx="6" ry="3" fill="rgba(255,255,255,0.55)" />
            </g>
          );
        })
      )}

      <rect x="12" y="326" width="196" height="22" rx="4" fill="#F0E8D0" stroke="#D0C6AC" strokeWidth="0.4" />
      <text
        x="110"
        y="341"
        textAnchor="middle"
        fill="#8B6E44"
        fontFamily="Inter, sans-serif"
        fontSize="8"
        letterSpacing="2"
      >
        1×10 TABLETS · NUTRACEUTICAL · ARATA
      </text>
    </svg>
  );

  if (!animate) return <div className="inline-block">{strip}</div>;

  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [-3, 1, -3] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block"
      style={{ filter: "drop-shadow(0 30px 40px rgba(23,32,61,0.18))" }}
    >
      {strip}
    </motion.div>
  );
}
