"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

type Props = { data: SiteContent["ingredientsSection"] };

/**
 * Standalone bundled ingredient-explorer artifact (React app packaged into
 * one self-contained HTML file, ~1.3 MB with all assets embedded).
 *
 * Mounted via a same-origin <iframe> whose height auto-fits its content —
 * that removes the inner scroll bar that was fighting the outer page scroll
 * on mobile. The artifact ships with `body { min-height: 100vh }`; we
 * override that on load so scrollHeight reflects real content.
 */
export default function IngredientExplorer({ data }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;

    let resizeObserver: ResizeObserver | null = null;
    let raf = 0;

    function fitHeight(doc: Document) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!el) return;
        const next = Math.max(
          doc.body?.scrollHeight ?? 0,
          doc.documentElement?.scrollHeight ?? 0
        );
        if (next > 0) el.style.height = `${next}px`;
      });
    }

    let keepaliveInterval = 0;
    let viewObserver: IntersectionObserver | null = null;
    let inView = true;

    function attach() {
      try {
        const doc = el?.contentDocument;
        if (!doc || !doc.body) return;

        // Neutralise the artifact's viewport-height baseline so the body wraps
        // content tightly. We intentionally do NOT force overflow:hidden — the
        // artifact draws absolutely-positioned graphics (anatomy diagrams) that
        // need to render outside the flow, and clipping was hiding them on
        // narrow viewports.
        const override = doc.createElement("style");
        override.textContent =
          "html, body { min-height: 0 !important; height: auto !important; }";
        doc.head.appendChild(override);

        fitHeight(doc);

        // Wake the artifact's own ResizeObserver / autoplay loop by dispatching
        // resize events into its window. iOS Safari throttles setTimeout inside
        // iframes when the outer page is scrolling, so we also fire a periodic
        // ping while the iframe is on-screen — cheap heartbeat that keeps the
        // animation loop from drifting into the throttled state.
        const kick = () => {
          try {
            el?.contentWindow?.dispatchEvent(new Event("resize"));
          } catch {
            /* noop */
          }
        };
        setTimeout(kick, 200);
        setTimeout(kick, 900);
        setTimeout(kick, 1800);

        keepaliveInterval = window.setInterval(() => {
          if (inView) kick();
        }, 2500);

        resizeObserver = new ResizeObserver(() => fitHeight(doc));
        resizeObserver.observe(doc.body);
      } catch {
        /* cross-origin (shouldn't happen for same-origin asset) — keep fallback height */
      }
    }

    // Track visibility so the keepalive stops when the iframe is off-screen.
    if ("IntersectionObserver" in window) {
      viewObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry) inView = entry.isIntersecting;
        },
        { rootMargin: "200px" }
      );
      viewObserver.observe(el);
    }

    // Attach after the iframe finishes loading; also try immediately in case it's already loaded.
    el.addEventListener("load", attach);
    if (el.contentDocument?.readyState === "complete") attach();

    return () => {
      el.removeEventListener("load", attach);
      resizeObserver?.disconnect();
      viewObserver?.disconnect();
      if (keepaliveInterval) clearInterval(keepaliveInterval);
      cancelAnimationFrame(raf);
    };
  }, []);

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
            ref={iframeRef}
            src={asset("/ingredient-explorer.html")}
            title="AETERNYX Ingredient Explorer"
            loading="eager"
            scrolling="no"
            className="block w-full"
            style={{ border: 0, height: 720 }}
            allow="clipboard-write"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...({ fetchpriority: "high" } as any)}
          />
        </motion.div>
      </div>
    </section>
  );
}
