"use client";

import Link from "next/link";
import type { SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

type Props = {
  brand: SiteContent["brand"];
  footer: SiteContent["footer"];
};

export default function Footer({ brand, footer }: Props) {
  return (
    <footer className="relative border-t border-hairline bg-paper pt-12 pb-10 md:pt-16 md:pb-12">
      <div className="container-app">
        {/* Top: brand (natural width, left) · addresses as two side-by-side columns.
            Using flex-shrink so the brand block never stretches past its content and
            the addresses sit right after it — no more empty gutter. */}
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-12 lg:gap-16">
          <div className="md:shrink-0">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label={`${brand.company} home`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(brand.logoAsset)}
                alt={brand.company}
                className="h-28 w-auto object-contain md:h-32"
              />
            </Link>
            <p className="mt-4 text-[14px] leading-relaxed text-ink">{footer.tagline}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 md:flex-1 md:gap-10">
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                Marketed by
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{brand.marketer}</p>
              <p className="tnum mt-1 text-[11px] uppercase tracking-widest text-muted">
                {footer.fssaiText} {brand.fssaiLicense}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                Manufactured by
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{brand.manufacturer}</p>
              <p className="tnum mt-1 text-[11px] uppercase tracking-widest text-muted">
                {footer.fssaiText} {brand.fssaiManufacturerLicense}
              </p>
            </div>
          </div>
        </div>

        {/* Compliance strip: FSSAI Disclosure + Order Policies */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-hairline bg-canvas/70 p-5">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
              FSSAI Disclosure
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              {footer.complianceDisclaimer}
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-widest text-muted">
              Category: {brand.fssaiCategory}
            </p>
          </div>

          <div className="rounded-2xl border border-hairline bg-canvas/70 p-5">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
              {footer.policies.label}
            </div>
            <dl className="mt-3 space-y-3 text-[13px] leading-relaxed text-ink-soft">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-ink">
                  Returns
                </dt>
                <dd className="mt-1">{footer.policies.returns}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-ink">
                  Cancellation
                </dt>
                <dd className="mt-1">{footer.policies.cancellation}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-ink">
                  Delivery
                </dt>
                <dd className="mt-1">{footer.policies.delivery}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1 border-t border-hairline pt-3 text-muted md:flex-row md:items-center md:justify-between">
          <p className="text-[8px] uppercase tracking-[0.2em]">{footer.address}</p>
          <p className="text-[9px] tracking-tight">{footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
