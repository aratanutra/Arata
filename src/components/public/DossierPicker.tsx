"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DossierSpecialty } from "@/types/content";

type Props = {
  specialties: DossierSpecialty[];
  fallbackEmail: string;
  footnote: string;
};

export default function DossierPicker({ specialties, fallbackEmail, footnote }: Props) {
  const [selected, setSelected] = useState<DossierSpecialty | null>(null);

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {specialties.map((s, i) => {
          const isActive = selected?.name === s.name;
          return (
            <motion.button
              key={s.name}
              type="button"
              onClick={() => setSelected(s)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              className={`group flex h-full flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all ${
                isActive
                  ? "border-ink bg-ink text-canvas shadow-card"
                  : "border-hairline bg-canvas hover:border-ink hover:shadow-card"
              }`}
            >
              <span
                className={`text-[11px] font-medium uppercase tracking-widest ${
                  isActive ? "text-sage" : "text-sage"
                }`}
              >
                Specialty
              </span>
              <h3
                className={`text-lg font-semibold tracking-tight ${
                  isActive ? "text-canvas" : "text-ink"
                }`}
              >
                {s.name}
              </h3>
              <p
                className={`text-[13px] leading-relaxed ${
                  isActive ? "text-canvas/85" : "text-muted"
                }`}
              >
                {s.summary}
              </p>
              <span
                aria-hidden
                className={`mt-auto text-[11px] uppercase tracking-widest ${
                  isActive ? "text-canvas" : "text-sage"
                }`}
              >
                {isActive ? "Selected" : "Select →"}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={selected.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 card-elevated p-8 md:p-12"
          >
            <span className="eyebrow">Aeternyx™ Clinical Brief</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink md:text-4xl">
              {selected.name} dossier
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{selected.summary}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {selected.url ? (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn-primary"
                >
                  Download PDF
                  <span aria-hidden>↓</span>
                </a>
              ) : (
                <a
                  href={`mailto:${fallbackEmail}?subject=${encodeURIComponent(
                    `[Dossier request] ${selected.name}`
                  )}&body=${encodeURIComponent(
                    `Please send the Aeternyx clinical dossier for: ${selected.name}.\n\nName:\nClinic / Hospital:\nMCI / state registration:`
                  )}`}
                  className="btn-primary"
                >
                  Request by email
                </a>
              )}
              <button type="button" onClick={() => setSelected(null)} className="btn-secondary">
                Choose another specialty
              </button>
            </div>

            {!selected.url ? (
              <p className="mt-5 text-[13px] text-muted">
                We are finalising the typeset PDFs. Click <span className="text-ink">Request by email</span> and we will send the latest brief within one business day.
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <p className="mt-10 max-w-3xl text-[13px] leading-relaxed text-muted">
        <strong className="text-ink">For healthcare professionals only.</strong> {footnote}
      </p>
    </div>
  );
}
