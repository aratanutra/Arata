"use client";

import type { SiteContent } from "@/types/content";

type Props = {
  brand: SiteContent["brand"];
  footer: SiteContent["footer"];
};

export default function Footer({ brand, footer }: Props) {
  return (
    <footer className="relative border-t border-gold-soft bg-obsidian py-20">
      <div className="container-luxe">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 font-display text-lg text-gold">
                {brand.logoMark}
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl text-gold-gradient">
                  {brand.name}
                  <sup className="ml-0.5 text-[8px] text-gold/70">{brand.trademark}</sup>
                </span>
                <span className="font-accent text-[8px] uppercase tracking-widest text-text-secondary">
                  {brand.company}
                </span>
              </span>
            </div>
            <p className="mt-5 font-display text-lg italic text-text-secondary">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-accent text-[10px] uppercase tracking-widest text-gold">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="font-body text-sm text-text-secondary transition-colors hover:text-gold"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-gold-soft pt-8 text-text-secondary md:flex-row md:items-center md:justify-between">
          <p className="font-accent text-[9px] uppercase tracking-widest">{footer.address}</p>
          <p className="font-body text-xs">{footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
