"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

type Props = { data: SiteContent["ingredientsSection"] };

/**
 * Standalone bundled ingredient-explorer artifact (React app packaged into
 * one self-contained HTML file, ~1.3 MB with all assets embedded).
 * Mounted lazily via <iframe> so it doesn't add to the initial page bundle
 * and doesn't parse until the section approaches the viewport.
 */
export default function IngredientExplorer({ data }: Props) {
  return (
    <section id="composition" className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="eyebrow">{data.eyebrow}</span>
          <h2 className="mt-4 heading-md">{data.title}</h2>
          <p className="mt-4 body-base">{data.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 overflow-hidden rounded-3xl border border-hairline bg-canvas shadow-sm"
        >
          <iframe
            src={asset("/ingredient-explorer.html")}
            title="AETERNYX Ingredient Explorer"
            loading="lazy"
            className="block h-[720px] w-full md:h-[820px] lg:h-[880px]"
            style={{ border: 0 }}
            allow="clipboard-write"
          />
        </motion.div>
      </div>
    </section>
  );
}
