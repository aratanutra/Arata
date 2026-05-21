"use client";

import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

export default function Blog({ data }: { data: SiteContent["blog"] }) {
  const visible = data.posts.filter((p) => p.published);
  return (
    <section id="blog" className="relative bg-mist py-28 md:py-40">
      <div className="container-app">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="eyebrow">{data.eyebrow}</span>
            <h2 className="mt-4 heading-lg">{data.title}</h2>
          </div>
          <a href="#" className="hidden md:inline-flex btn-link">
            All Entries
            <span aria-hidden>→</span>
          </a>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {visible.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="card group overflow-hidden hover:shadow-card"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cloud">
                {post.image ? (
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{
                      backgroundImage: `url(${asset(post.image)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />
                ) : null}
                <div className="absolute left-4 top-4 rounded-full bg-canvas/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink backdrop-blur">
                  Essay
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold leading-snug tracking-tight text-ink transition-colors group-hover:text-sage-deep">
                  {post.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-widest text-muted">
                    Read essay
                  </span>
                  <span className="text-sage">→</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
