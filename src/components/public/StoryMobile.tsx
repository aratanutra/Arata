"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { asset } from "@/lib/asset";

/**
 * "AETERNYX — Inside one tablet" — a bundled story artifact (self-contained
 * HTML with all assets embedded). Rendered as an iframe that auto-fits its
 * content height so it doesn't get an inner scroll trap on any viewport.
 *
 * Visible on every breakpoint — replaces the older IngredientExplorer as
 * the primary formulation section.
 */
export default function StoryMobile() {
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

    function attach() {
      try {
        const doc = el?.contentDocument;
        if (!doc || !doc.body) return;

        const override = doc.createElement("style");
        override.textContent =
          "html, body { min-height: 0 !important; height: auto !important; }";
        doc.head.appendChild(override);

        fitHeight(doc);
        resizeObserver = new ResizeObserver(() => fitHeight(doc));
        resizeObserver.observe(doc.body);
      } catch {
        /* noop */
      }
    }

    el.addEventListener("load", attach);
    if (el.contentDocument?.readyState === "complete") attach();

    return () => {
      el.removeEventListener("load", attach);
      resizeObserver?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="story"
      className="relative overflow-hidden bg-canvas py-12 md:py-20"
    >
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-3xl border border-hairline bg-canvas shadow-sm"
        >
          <iframe
            ref={iframeRef}
            src={asset("/aeternyx-story-mobile.html")}
            title="AETERNYX — Inside one tablet"
            loading="lazy"
            scrolling="no"
            className="block w-full"
            style={{ border: 0, height: 720 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
