"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

/* ---------- Logo marks (official brand assets) ---------- */

function LogoChip({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-hairline bg-canvas">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(src)} alt={alt} className="h-11 w-11 object-contain" />
    </div>
  );
}

function FssaiMark() {
  return <LogoChip src="/brand/certifications/fssai.png" alt="FSSAI Licensed" />;
}

function GmpMark() {
  return <LogoChip src="/brand/certifications/gmp.png" alt="GMP Quality Certified" />;
}

function IsoMark() {
  return <LogoChip src="/brand/certifications/iso.png" alt="ISO Certified" />;
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
