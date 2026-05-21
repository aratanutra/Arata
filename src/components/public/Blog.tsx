"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";

export default function Blog({ data }: { data: SiteContent["blog"] }) {
  const visible = data.posts.filter((p) => p.published);
  return (
    <section id="blog" className="relative py-32 md:py-40">
      <div className="container-luxe">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="eyebrow">{data.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
              {data.title}
            </h2>
          </div>
          <a href="#" className="hidden md:inline-flex btn-ghost">
            All Entries
          </a>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {visible.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="luxe-card group overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-surface to-deep">
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={
                    post.image
                      ? { backgroundImage: `url(${post.image})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : undefined
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full border border-gold/30 bg-obsidian/60 px-3 py-1 font-accent text-[9px] tracking-widest text-gold backdrop-blur">
                  Essay
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl leading-tight text-text-primary transition-colors group-hover:text-gold">
                  {post.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
                  {post.excerpt}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-accent text-[9px] uppercase tracking-widest text-text-secondary">
                    Read essay
                  </span>
                  <span className="text-gold">→</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
