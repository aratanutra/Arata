"use client";

import Link from "next/link";
import type { SiteContent } from "@/types/content";
import { asset } from "@/lib/asset";

type Props = {
  brand: SiteContent["brand"];
  footer: SiteContent["footer"];
};

function FooterLink({
  href,
  children,
  waHref
}: {
  href: string;
  children: React.ReactNode;
  waHref: string;
}) {
  const className = "text-[14px] text-muted transition-colors hover:text-ink";
  if (href === "whatsapp") {
    return (
      <a href={waHref} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  const isExternalOrAnchor =
    href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:");
  if (isExternalOrAnchor) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function VegLogo() {
  return (
    <span
      title="Vegetarian"
      className="inline-flex h-5 w-5 items-center justify-center rounded-sm border-2 border-emerald-700 bg-canvas"
    >
      <span className="h-2 w-2 rounded-full bg-emerald-600" />
    </span>
  );
}

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
  const waHref = `https://wa.me/${brand.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    brand.whatsappGreeting
  )}`;

  return (
    <footer className="relative border-t border-hairline bg-paper pt-12 pb-10 md:pt-16 md:pb-12">
      <div className="container-app">
        {/* Top row: brand (big) + compliance addresses + nav — no more empty middle */}
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          {/* Brand — takes 5 cols on desktop; big logo carries the weight */}
          <div className="md:col-span-5">
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
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <FssaiBadge license={brand.fssaiLicense} />
              {brand.vegetarian ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-canvas px-3 py-2.5">
                  <VegLogo />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-ink">
                    Vegetarian
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Marketed + Manufactured addresses now live inline in the top row */}
          <div className="md:col-span-4">
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                Marketed by
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{brand.marketer}</p>
              <p className="tnum mt-1 text-[11px] uppercase tracking-widest text-muted">
                {footer.fssaiText} {brand.fssaiLicense}
              </p>
            </div>
            <div className="mt-5">
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
                Manufactured by
              </h4>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{brand.manufacturer}</p>
              <p className="tnum mt-1 text-[11px] uppercase tracking-widest text-muted">
                {footer.fssaiText} {brand.fssaiManufacturerLicense}
              </p>
            </div>
          </div>

          {/* Nav — stacked into a single narrower column */}
          <div className="grid gap-6 md:col-span-3 md:grid-cols-1">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-ink">
                  {col.title}
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <FooterLink href={l.href} waHref={waHref}>
                        {l.label}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance strip: FSSAI Disclosure + Grievance + Order Policies */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
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
              {footer.grievanceOfficer.label}
            </div>
            <a
              href={`tel:${footer.grievanceOfficer.phone.replace(/\s+/g, "")}`}
              className="tnum mt-2 inline-block text-[13px] font-semibold text-ink hover:text-gold-deep"
            >
              {footer.grievanceOfficer.phone}
            </a>
            <p className="mt-2 text-[12px] leading-relaxed text-muted">
              {footer.grievanceOfficer.note}
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
