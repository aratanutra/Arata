"use client";

import Link from "next/link";
import type { SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  footer: SiteContent["footer"];
};

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternalOrAnchor = href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:");
  const className = "text-[14px] text-muted transition-colors hover:text-ink";
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

export default function Footer({ brand, footer }: Props) {
  return (
    <footer className="relative border-t border-hairline bg-mist py-20">
      <div className="container-app">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-semibold text-canvas">
                {brand.logoMark}
              </span>
              <span className="text-lg font-semibold tracking-tight text-ink">
                {brand.company}
              </span>
            </Link>
            <p className="mt-5 text-base text-ink-soft">{footer.tagline}</p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-3 inline-block text-[13px] text-muted transition-colors hover:text-ink"
            >
              {brand.email}
            </a>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-widest text-ink">{col.title}</h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-hairline pt-8 text-muted md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] uppercase tracking-widest">{footer.address}</p>
          <p className="text-[12px]">{footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
