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
    <div className="inline-flex items-center gap-3 rounded-xl border border-hairline bg-canvas px-4 py-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold-deep" fill="none" aria-hidden>
          <path
            d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M9 12l2.4 2.4L15.4 10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-ink">FSSAI</div>
        <div className="tnum text-[12px] font-medium text-muted">Lic. {license}</div>
      </div>
    </div>
  );
}

export default function Footer({ brand, footer }: Props) {
  const waHref = `https://wa.me/${brand.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    brand.whatsappGreeting
  )}`;
  return (
    <footer className="relative border-t border-hairline bg-paper py-20">
      <div className="container-app">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1.4fr]">
          <div>
            <Link href="/" className="inline-flex items-start" aria-label={`${brand.company} home`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(brand.logoAsset)}
                alt={brand.company}
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 text-base text-ink-soft">{footer.tagline}</p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-3 inline-block text-[13px] text-muted transition-colors hover:text-ink"
            >
              {brand.email}
            </a>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <FssaiBadge license={brand.fssaiLicense} />
              {brand.vegetarian ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-canvas px-3 py-3">
                  <VegLogo />
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-ink">
                    Vegetarian
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-ink">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
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

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-hairline bg-canvas/70 p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
              Marketed by
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{brand.marketer}</p>
            <p className="mt-2 tnum text-[11px] uppercase tracking-widest text-muted">
              {footer.fssaiText} {brand.fssaiLicense}
            </p>
          </div>
          <div className="rounded-2xl border border-hairline bg-canvas/70 p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
              Manufactured by
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{brand.manufacturer}</p>
            <p className="mt-2 tnum text-[11px] uppercase tracking-widest text-muted">
              {footer.fssaiText} {brand.fssaiManufacturerLicense}
            </p>
          </div>
          <div className="rounded-2xl border border-hairline bg-canvas/70 p-6">
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
        </div>

        {/* Grievance officer + Order policies */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-hairline bg-canvas/70 p-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-gold-deep">
              {footer.grievanceOfficer.label}
            </div>
            <p className="mt-2 text-[13px] font-semibold tracking-tight text-ink">
              {footer.grievanceOfficer.name}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-soft">
              <a href={`mailto:${footer.grievanceOfficer.email}`} className="hover:text-ink">
                {footer.grievanceOfficer.email}
              </a>
              <a
                href={`tel:${footer.grievanceOfficer.phone.replace(/\s+/g, "")}`}
                className="tnum hover:text-ink"
              >
                {footer.grievanceOfficer.phone}
              </a>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-muted">
              {footer.grievanceOfficer.note}
            </p>
          </div>
          <div className="rounded-2xl border border-hairline bg-canvas/70 p-6">
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

        <div className="mt-10 flex flex-col gap-3 border-t border-hairline pt-8 text-muted md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] uppercase tracking-widest">{footer.address}</p>
          <p className="text-[12px]">{footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
