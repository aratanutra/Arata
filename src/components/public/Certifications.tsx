"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

function CertBadge({ code }: { code: string }) {
  return (
    <div className="grid h-14 w-14 place-items-center rounded-xl border border-hairline bg-canvas">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">{code}</span>
    </div>
  );
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
