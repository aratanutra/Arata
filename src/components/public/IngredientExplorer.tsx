"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

type Props = { data: SiteContent["ingredientsSection"] };

type PlayerHooks = {
  __aeternyxPlayerPlay?: (n: number) => void;
  __aeternyxPlayerState?: () => number | null | undefined;
  __aeternyxPlayerCount?: () => number;
};

function advanceOne(w: Window | null) {
  try {
    const hooks = w as unknown as PlayerHooks;
    const play = hooks?.__aeternyxPlayerPlay;
    if (typeof play !== "function") return false;
    const cur = hooks?.__aeternyxPlayerState?.();
    const total = hooks?.__aeternyxPlayerCount?.() || 10;
    const next = (cur === null || cur === undefined ? 0 : (cur + 1) % total) + 1;
    play(next);
    return true;
  } catch {
    return false;
  }
}

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

    let viewObserver: IntersectionObserver | null = null;
    let inView = true;
    let driverRaf = 0;
    let lastAdvanceAt = 0;

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

        resizeObserver = new ResizeObserver(() => fitHeight(doc));
        resizeObserver.observe(doc.body);
      } catch {
        /* cross-origin (shouldn't happen for same-origin asset) — keep fallback height */
      }
    }

    // Parent-side autoplay driver: iOS Safari throttles setTimeout/setInterval
    // inside iframes (even RAF), but the PARENT document's RAF runs at native
    // frame rate whenever the tab is visible. Every 3 s we call into the
    // iframe's exposed play() to force the next ingredient.
    function drive() {
      const now = performance.now();
      if (inView && now - lastAdvanceAt > 3000) {
        if (advanceOne(el?.contentWindow ?? null)) {
          lastAdvanceAt = now;
        }
      }
      driverRaf = requestAnimationFrame(drive);
    }

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

    // Start the parent-side driver after a beat so the artifact has time to
    // expose its play() hooks on window.
    const driverStart = window.setTimeout(() => {
      lastAdvanceAt = performance.now();
      driverRaf = requestAnimationFrame(drive);
    }, 1500);

    return () => {
      el.removeEventListener("load", attach);
      resizeObserver?.disconnect();
      viewObserver?.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(driverRaf);
      clearTimeout(driverStart);
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
          className="relative mt-12 overflow-hidden rounded-3xl border border-hairline bg-canvas shadow-sm"
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
