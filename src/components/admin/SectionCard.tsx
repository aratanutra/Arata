"use client";

import { useState } from "react";

type Props = {
  id: string;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export default function SectionCard({ id, title, subtitle, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} className="luxe-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div>
          <div className="font-accent text-[10px] uppercase tracking-widest text-gold">{id}</div>
          <h2 className="mt-1 font-display text-2xl text-text-primary">{title}</h2>
          {subtitle ? <p className="mt-1 font-body text-sm text-text-secondary">{subtitle}</p> : null}
        </div>
        <span className={`font-display text-2xl text-gold transition-transform ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open ? <div className="border-t border-gold-soft px-6 py-6 space-y-5">{children}</div> : null}
    </section>
  );
}
