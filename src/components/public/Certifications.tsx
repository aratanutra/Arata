"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

/* ---------- Logo marks ---------- */

function FssaiMark() {
  // Stylised approximation of the regulatory FSSAI wordmark:
  // navy "fssai" lettering on a cream chip with the F terminal check.
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-hairline bg-canvas">
      <svg viewBox="0 0 96 48" className="h-9 w-auto" aria-label="FSSAI">
        <g fill="#0E3D8F">
          <path d="M8 12h14v6H14v6h6v6h-6v10H8V12Z" />
          <path d="M30 34c0 4 3 6 8 6 4 0 7-2 7-5 0-3-3-4-8-5-7-2-11-4-11-9 0-6 5-9 12-9 5 0 10 2 12 6l-6 3c-1-2-3-4-6-4-3 0-6 1-6 4 0 2 3 3 8 4 8 2 12 5 12 10 0 6-5 10-13 10-8 0-13-3-15-9l6-2Z" />
          <path d="M60 34c0 4 3 6 8 6 4 0 7-2 7-5 0-3-3-4-8-5-7-2-11-4-11-9 0-6 5-9 12-9 5 0 10 2 12 6l-6 3c-1-2-3-4-6-4-3 0-6 1-6 4 0 2 3 3 8 4 8 2 12 5 12 10 0 6-5 10-13 10-8 0-13-3-15-9l6-2Z" />
        </g>
        {/* small green check on the terminal to echo FSSAI's licensed mark */}
        <path
          d="M84 8l3 3 5-6"
          stroke="#2E9A56"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function GmpMark() {
  // Circular seal reminiscent of a WHO-GMP certification badge.
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-hairline bg-canvas">
      <svg viewBox="0 0 64 64" className="h-12 w-12" aria-label="WHO-GMP + HACCP">
        <defs>
          <linearGradient id="gmpRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#B8935E" />
            <stop offset="1" stopColor="#8B6E44" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="28" fill="none" stroke="url(#gmpRing)" strokeWidth="2" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="#8B6E44" strokeWidth="0.6" opacity="0.6" />
        {/* laurel dots */}
        <g fill="#8B6E44" opacity="0.6">
          <circle cx="32" cy="6" r="1" />
          <circle cx="58" cy="32" r="1" />
          <circle cx="32" cy="58" r="1" />
          <circle cx="6" cy="32" r="1" />
        </g>
        <text
          x="32"
          y="30"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fill="#8B6E44"
          fontFamily="ui-sans-serif, system-ui"
          letterSpacing="0.5"
        >
          GMP
        </text>
        <text
          x="32"
          y="42"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="700"
          fill="#8B6E44"
          fontFamily="ui-sans-serif, system-ui"
          letterSpacing="2"
        >
          HACCP
        </text>
      </svg>
    </div>
  );
}

function IsoMark() {
  // Layered ISO badge with the three ISO clauses stacked.
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-hairline bg-canvas">
      <svg viewBox="0 0 64 64" className="h-12 w-12" aria-label="ISO Certified">
        <circle cx="32" cy="32" r="28" fill="none" stroke="#0E3D8F" strokeWidth="2" />
        <circle cx="32" cy="32" r="22" fill="none" stroke="#0E3D8F" strokeWidth="0.6" opacity="0.4" />
        <text
          x="32"
          y="24"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fill="#0E3D8F"
          fontFamily="ui-sans-serif, system-ui"
          letterSpacing="1.5"
        >
          ISO
        </text>
        <g
          fill="#0E3D8F"
          fontSize="5.5"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui"
          textAnchor="middle"
        >
          <text x="32" y="34">9001</text>
          <text x="32" y="42">14001</text>
          <text x="32" y="50">22000</text>
        </g>
      </svg>
    </div>
  );
}

function VegMark() {
  // Indian regulatory vegetarian mark: green filled circle in a green outlined square.
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-hairline bg-canvas">
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-sm border-[3px] border-emerald-700 bg-canvas"
        aria-label="100% Vegetarian"
      >
        <span className="h-4 w-4 rounded-full bg-emerald-600" />
      </span>
    </div>
  );
}

const MARKS: Record<string, JSX.Element> = {
  FSSAI: <FssaiMark />,
  GMP: <GmpMark />,
  ISO: <IsoMark />,
  VEG: <VegMark />
};

function CertBadge({ code }: { code: string }) {
  return MARKS[code] ?? MARKS.VEG;
}

export default function Certifications({ data }: { data: SiteContent["certifications"] }) {
  return (
    <section className="relative bg-canvas py-24 md:py-32">
      <div className="container-app">
        <div className="max-w-2xl">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-md">{data.title}</h2>
          <p className="mt-4 body-base">{data.subtitle}</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="card flex h-full flex-col gap-5 p-6"
            >
              <CertBadge code={item.code} />
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
