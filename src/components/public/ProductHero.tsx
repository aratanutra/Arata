"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { SiteContent } from "@/types/content";
import Product3DSlider from "./Product3DSlider";

/** Hand-off duration before we send the viewer to WhatsApp. Matches the applause. */
const ORDER_HANDOFF_MS = 3000;

type Props = {
  brand: SiteContent["brand"];
  hero: SiteContent["productHero"];
};

function Tick() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7.5 12.4l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.4L4 29l7.8-1.8A11.9 11.9 0 0016 27c6.6 0 12-5.4 12-12S22.6 3 16 3zm5.5 15.2c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1s-.2-.5.1-.6c.1-.1.3-.4.5-.5s.2-.3.3-.5.1-.4 0-.5-.7-1.6-.9-2.2-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1-1.1 2.5 1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.3-.2-.6-.4z"/>
    </svg>
  );
}

export default function ProductHero({ brand, hero }: Props) {
  const digits = brand.whatsappNumber.replace(/\D/g, "");
  const packs = hero.packs?.length ? hero.packs : [];
  const defaultIndex = packs.length > 1 ? 1 : 0; // pick the 30-day as default when available
  const [selectedIdx, setSelectedIdx] = useState(defaultIndex);
  const selectedPack = packs[selectedIdx];

  // Order-now flow: WhatsApp opens with the SELECTED PACK's message. Falls back
  // to the generic order greeting if packs aren't configured.
  const waOrderMessage = selectedPack?.waMessage ?? brand.whatsappOrderMessage;
  const waOrderHref = useMemo(
    () =>
      `https://wa.me/${digits}?text=${encodeURIComponent(waOrderMessage)}`,
    [digits, waOrderMessage]
  );

  function resolveHref(href: string): { href: string; external: boolean } {
    if (href === "whatsapp") return { href: waOrderHref, external: true };
    return { href, external: false };
  }

  const primary = resolveHref(hero.primaryCta.href);
  const secondary = resolveHref(hero.secondaryCta.href);

  const [ordering, setOrdering] = useState(false);

  // Order-now feedback: LOUD cheering applause. Two synthesised layers stack
  // to sound like a real crowd rather than one pair of hands.
  //   Layer A: sustained band-passed noise wash — the "crowd hum"
  //   Layer B: ~50 filtered clap bursts scattered at random over the window
  function playOrderClaps() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      const now = ctx.currentTime;
      const duration = 2.6;

      // ——— Layer A: sustained crowd-noise wash ————————————————————
      const sampleRate = ctx.sampleRate;
      const bufSize = Math.floor(sampleRate * duration);
      const buf = ctx.createBuffer(1, bufSize, sampleRate);
      const data = buf.getChannelData(0);
      // Amplitude envelope: 60 ms rise, then held, 350 ms decay.
      const rise = 0.06 * sampleRate;
      const tail = 0.35 * sampleRate;
      for (let i = 0; i < bufSize; i++) {
        let env = 1;
        if (i < rise) env = i / rise;
        else if (i > bufSize - tail) env = (bufSize - i) / tail;
        data[i] = (Math.random() * 2 - 1) * env;
      }
      const wash = ctx.createBufferSource();
      wash.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 2200;
      bp.Q.value = 0.55;
      const washGain = ctx.createGain();
      washGain.gain.value = 0.55; // sustained crowd body
      wash.connect(bp);
      bp.connect(washGain);
      washGain.connect(ctx.destination);
      wash.start(now);
      wash.stop(now + duration);

      // ——— Layer B: individual clap peaks scattered over the window ——
      const CLAP_COUNT = 50;
      for (let i = 0; i < CLAP_COUNT; i++) {
        const t = now + 0.03 + Math.random() * (duration - 0.35);
        const csize = Math.floor(sampleRate * 0.03);
        const cbuf = ctx.createBuffer(1, csize, sampleRate);
        const cd = cbuf.getChannelData(0);
        for (let j = 0; j < csize; j++) cd[j] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = cbuf;
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 900 + Math.random() * 900;
        const g = ctx.createGain();
        const peak = 0.42 + Math.random() * 0.25;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(peak, t + 0.003);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
        src.connect(hp);
        hp.connect(g);
        g.connect(ctx.destination);
        src.start(t);
        src.stop(t + 0.09);
      }

      window.setTimeout(() => ctx.close().catch(() => {}), duration * 1000 + 200);
    } catch {
      /* audio unavailable — silently skip */
    }
  }

  async function fireConfetti() {
    try {
      const mod = await import("canvas-confetti");
      const confetti = mod.default;
      const colours = [
        "#E88F3A",
        "#F4A65C",
        "#F7C87A",
        "#17203D",
        "#B8935E",
        "#F2E9D2",
        "#25D366"
      ];

      // 1) Big central burst — the "opening pop".
      confetti({
        particleCount: 220,
        spread: 90,
        startVelocity: 55,
        origin: { x: 0.5, y: 0.65 },
        colors: colours,
        scalar: 1.1
      });

      // 2) Left cannon, angled toward the centre.
      window.setTimeout(() => {
        confetti({
          particleCount: 140,
          angle: 60,
          spread: 65,
          startVelocity: 60,
          origin: { x: 0, y: 0.75 },
          colors: colours,
          scalar: 1
        });
      }, 180);

      // 3) Right cannon, mirror of the left.
      window.setTimeout(() => {
        confetti({
          particleCount: 140,
          angle: 120,
          spread: 65,
          startVelocity: 60,
          origin: { x: 1, y: 0.75 },
          colors: colours,
          scalar: 1
        });
      }, 260);

      // 4) Rain from the top of the viewport.
      window.setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 120,
          startVelocity: 22,
          origin: { x: 0.5, y: 0 },
          gravity: 0.65,
          colors: colours,
          scalar: 0.95
        });
      }, 550);

      // 5) Second big central burst — the crowd "roar".
      window.setTimeout(() => {
        confetti({
          particleCount: 220,
          spread: 130,
          startVelocity: 50,
          origin: { x: 0.5, y: 0.55 },
          colors: colours,
          scalar: 1.05
        });
      }, 900);

      // 6) Tail flourish — smaller sparkles keep the moment alive.
      window.setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 100,
          startVelocity: 45,
          origin: { x: 0.5, y: 0.7 },
          colors: colours,
          scalar: 0.85
        });
      }, 1500);
    } catch {
      /* confetti library missing — skip gracefully */
    }
  }

  function handleOrderClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (ordering) return;
    setOrdering(true);
    // Celebration stays on the current page — claps + confetti — then the tab
    // navigates to WhatsApp. Same-tab hand-off avoids the intermediate blank
    // popup users were seeing before the sound finished.
    playOrderClaps();
    void fireConfetti();
    window.setTimeout(() => {
      window.location.href = waOrderHref;
    }, ORDER_HANDOFF_MS);
  }

  return (
    <section
      id="buy"
      className="relative scroll-mt-16 overflow-hidden bg-canvas pt-28 pb-16 md:scroll-mt-20 md:pt-36 md:pb-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[45vh] bg-[radial-gradient(ellipse_at_top,_rgba(184,147,94,0.10)_0%,_transparent_60%)]"
      />
      <div className="container-app relative">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Left: product visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <Product3DSlider
              className="relative aspect-[4/5] w-full overflow-hidden"
              showHint={false}
            />
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] uppercase tracking-widest text-muted">
              <span>10 Actives</span>
              <span className="h-1 w-1 rounded-full bg-hairline" />
              <span>Vegetarian</span>
            </div>
          </motion.div>

          {/* Right: purchase panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-hairline bg-paper px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink">
                {hero.tag}
              </span>
              <span className="inline-flex items-center gap-2 text-[12px] font-medium text-muted">
                {hero.endorsement}
              </span>
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl">
              <span className="wordmark-gold">{hero.title}</span>
              <sup className="ml-1 align-super text-[0.28em] font-medium text-muted">
                {brand.trademark}
              </sup>
            </h1>
            <p className="mt-2 text-sm font-medium uppercase tracking-widest text-gold-deep md:text-base">
              {hero.tagline}
              <sup className="ml-0.5 text-[0.55em] font-medium">{brand.taglineTrademark}</sup>
            </p>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted md:text-base">{hero.lead}</p>

            <ul className="mt-6 space-y-2.5">
              {hero.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink md:text-[15px]">
                  <Tick />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-hairline bg-paper p-5 md:p-6">
              {/* Pack selector — pill row on wider viewports, stacks on mobile */}
              {packs.length > 1 ? (
                <div className="mb-5">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                    Pick your pack
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {packs.map((pack, i) => {
                      const active = i === selectedIdx;
                      return (
                        <button
                          key={pack.id}
                          type="button"
                          onClick={() => setSelectedIdx(i)}
                          aria-pressed={active}
                          className={`relative flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-colors ${
                            active
                              ? "border-ink bg-canvas shadow-sm"
                              : "border-hairline bg-canvas/60 hover:border-ink/60"
                          }`}
                        >
                          {pack.badge ? (
                            <span className="absolute -top-2 right-2 rounded-full bg-gold-deep px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white">
                              {pack.badge}
                            </span>
                          ) : null}
                          <span className="text-[13px] font-semibold text-ink">
                            {pack.label}
                          </span>
                          <span className="mt-0.5 text-[11px] leading-snug text-muted">
                            {pack.sublabel}
                          </span>
                          {pack.discountLabel ? (
                            <span className="mt-1 inline-block rounded bg-gold-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                              {pack.discountLabel}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-widest text-muted">
                    {hero.mrpLabel}
                  </div>
                  <div className="tnum mt-1 flex items-baseline gap-3">
                    <span className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                      {selectedPack?.price ?? hero.mrp}
                    </span>
                    {selectedPack?.priceOriginal ? (
                      <span className="text-lg font-medium text-muted line-through">
                        {selectedPack.priceOriginal}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                    {hero.mrpNote}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-medium uppercase tracking-widest text-muted">
                    Pack
                  </div>
                  <div className="tnum mt-1 text-xl font-semibold tracking-tight text-ink">
                    {selectedPack?.label ?? "1 Strip"}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-muted">
                    {selectedPack?.sublabel ?? "10-day supply"}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[12px] leading-relaxed text-muted">
                <span className="font-semibold text-ink">{hero.netQuantity}</span>
                <br />
                {hero.bestBefore}
              </p>

              <div className="mt-5 flex flex-col gap-3">
                {primary.external ? (
                  <a
                    href={primary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleOrderClick}
                    aria-disabled={ordering}
                    className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:brightness-95 hover:shadow-card-hover ${
                      ordering ? "pointer-events-none opacity-90" : ""
                    }`}
                  >
                    <WhatsAppGlyph className="h-5 w-5" />
                    {ordering ? "Opening WhatsApp…" : hero.primaryCta.label}
                  </a>
                ) : hero.primaryCta.href.startsWith("#") ? (
                  <a href={hero.primaryCta.href} className="btn-primary text-[15px]">
                    {hero.primaryCta.label} <span aria-hidden>→</span>
                  </a>
                ) : (
                  <Link href={hero.primaryCta.href} className="btn-primary text-[15px]">
                    {hero.primaryCta.label} <span aria-hidden>→</span>
                  </Link>
                )}
                {secondary.external ? (
                  <a
                    href={secondary.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-canvas px-6 py-3 text-sm font-medium text-ink transition-all duration-200 hover:border-ink hover:bg-paper"
                  >
                    <WhatsAppGlyph className="h-4 w-4 text-[#25D366]" />
                    {hero.secondaryCta.label}
                  </a>
                ) : hero.secondaryCta.href.startsWith("#") ? (
                  <a href={hero.secondaryCta.href} className="btn-secondary">
                    {hero.secondaryCta.label}
                  </a>
                ) : (
                  <Link href={hero.secondaryCta.href} className="btn-secondary">
                    {hero.secondaryCta.label}
                  </Link>
                )}
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-muted">
                {hero.shipLine}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              {hero.trustIcons.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted"
                >
                  <span aria-hidden className="text-gold-deep">✦</span>
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
