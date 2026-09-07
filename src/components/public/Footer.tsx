"use client";

import Link from "next/link";
import type { SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

type Props = {
  brand: SiteContent["brand"];
  footer: SiteContent["footer"];
};

function FssaiBadge({ license }: { license: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-hairline bg-canvas px-4 py-2.5">
      <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-canvas">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/brand/certifications/fssai.png")}
          alt="FSSAI"
          className="h-7 w-7 object-contain"
        />
      </div>
      <div className="leading-tight">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-ink">FSSAI</div>
        <div className="tnum text-[11px] font-medium text-muted">Lic. {license}</div>
      </div>
    </div>
  );
}

export default function Footer({ brand, footer }: Props) {
  return (
    <footer className="relative border-t border-hairline bg-paper pt-12 pb-10 md:pt-16 md:pb-12">
      <div className="container-app">
        {/* Top: brand block (left) · compliance addresses (right) */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label={`${brand.company} home`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(brand.logoAsset)}
                alt={brand.company}
                className="h-28 w-auto object-contain md:h-36"
              />
            </Link>
            <p className="mt-5 text-[15px] leading-relaxed text-ink">{footer.tagline}</p>
            <div className="mt-5">
              <FssaiBadge license={brand.fssaiLicense} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-1">
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                Marketed by
              </h4>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{brand.marketer}</p>
              <p className="tnum mt-1 text-[11px] uppercase tracking-widest text-muted">
                {footer.fssaiText} {brand.fssaiLicense}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                Manufactured by
              </h4>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{brand.manufacturer}</p>
              <p className="tnum mt-1 text-[11px] uppercase tracking-widest text-muted">
                {footer.fssaiText} {brand.fssaiManufacturerLicense}
              </p>
            </div>
          </div>
        </div>

        {/* Compliance strip: FSSAI Disclosure + Order Policies */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
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

        <div className="mt-8 flex flex-col gap-3 border-t border-hairline pt-6 text-muted md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] uppercase tracking-widest">{footer.address}</p>
          <p className="text-[12px]">{footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
