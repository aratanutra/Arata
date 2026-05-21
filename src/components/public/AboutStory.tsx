"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function AboutStory({ story }: { story: SiteContent["about"]["story"] }) {
  return (
    <section className="relative bg-mist py-24 md:py-32">
      <div className="container-tight">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="heading-md text-center"
        >
          {story.title}
        </motion.h2>
        <div className="mx-auto mt-12 max-w-3xl space-y-6 text-[17px] leading-[1.75] text-ink-soft md:text-lg">
          {story.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
