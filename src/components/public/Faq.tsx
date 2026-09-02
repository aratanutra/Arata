"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Faq({ data }: { data: SiteContent["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative bg-paper py-24 md:py-32">
      <div className="container-tight">
        <div className="text-center">
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-md">{data.title}</h2>
        </div>
        <div className="mt-10 divide-y divide-hairline rounded-3xl border border-hairline bg-canvas">
          {data.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen((v) => (v === i ? null : i))}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-paper md:px-8 md:py-6"
                >
                  <span className="text-[15px] font-semibold tracking-tight text-ink md:text-base">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-hairline text-gold-deep transition-transform duration-300 ${
                      isOpen ? "rotate-45 border-ink text-ink" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-[14px] leading-relaxed text-muted md:px-8 md:pb-7 md:text-[15px]">
                        {item.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
