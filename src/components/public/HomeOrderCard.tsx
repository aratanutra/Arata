"use client";

import { useMemo, useState } from "react";
import type { SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  hero: SiteContent["productHero"];
};

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.4L4 29l7.8-1.8A11.9 11.9 0 0016 27c6.6 0 12-5.4 12-12S22.6 3 16 3zm5.5 15.2c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1s-.2-.5.1-.6c.1-.1.3-.4.5-.5s.2-.3.3-.5.1-.4 0-.5-.7-1.6-.9-2.2-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1-1.1 2.5 1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4s.3-1.3.2-1.4-.3-.2-.6-.4z" />
    </svg>
  );
}

/**
 * Compact "order window" — pack selector + Order now → WhatsApp.
 * Uses productHero.packs data so the same three packs and messages that
 * appear on /aeternyx power this card too.
 */
export default function HomeOrderCard({ brand, hero }: Props) {
  const digits = brand.whatsappNumber.replace(/\D/g, "");
  const packs = hero.packs?.length ? hero.packs : [];
  const defaultIndex = packs.length > 1 ? 1 : 0;
  const [selectedIdx, setSelectedIdx] = useState(defaultIndex);
  const selectedPack = packs[selectedIdx];
  const waMessage = selectedPack?.waMessage ?? brand.whatsappOrderMessage;
  const waHref = useMemo(
    () => `https://wa.me/${digits}?text=${encodeURIComponent(waMessage)}`,
    [digits, waMessage]
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-hairline bg-paper p-5 md:p-6">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
        Pick your pack
      </div>
      <div className="mt-3 grid gap-2">
        {packs.map((pack, i) => {
          const active = i === selectedIdx;
          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => setSelectedIdx(i)}
              aria-pressed={active}
              className={`relative flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
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
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-ink">{pack.label}</span>
                <span className="mt-0.5 text-[11px] leading-snug text-muted">
                  {pack.sublabel}
                </span>
                {pack.shippingLabel ? (
                  <span
                    className={`mt-1 inline-block self-start rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
                      pack.shippingFree
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-hairline/60 text-muted"
                    }`}
                  >
                    {pack.shippingLabel}
                  </span>
                ) : null}
              </div>
              <div className="tnum flex items-baseline gap-1 whitespace-nowrap">
                <span className="text-[15px] font-semibold text-ink">{pack.price}</span>
                {pack.priceOriginal ? (
                  <span className="text-[11px] text-muted line-through">
                    {pack.priceOriginal}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-3">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-widest text-muted">
            {hero.mrpLabel}
          </div>
          <div className="tnum mt-0.5 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {selectedPack?.price ?? hero.mrp}
            </span>
            {selectedPack?.priceOriginal ? (
              <span className="text-base font-medium text-muted line-through">
                {selectedPack.priceOriginal}
              </span>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-medium uppercase tracking-widest text-muted">
            Pack
          </div>
          <div className="tnum mt-0.5 text-[13px] font-semibold text-ink">
            {selectedPack?.label ?? "1 Strip"}
          </div>
        </div>
      </div>

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:brightness-95 hover:shadow-card-hover"
      >
        <WhatsAppGlyph className="h-5 w-5" />
        Order now
      </a>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        {hero.shipLine}
      </p>
    </div>
  );
}
