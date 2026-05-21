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
    <section id={id} className="overflow-hidden rounded-2xl border border-hairline bg-canvas">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-mist"
      >
        <div>
          <div className="text-[11px] font-medium uppercase tracking-widest text-sage">{id}</div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">{title}</h2>
          {subtitle ? <p className="mt-1 text-[14px] text-muted">{subtitle}</p> : null}
        </div>
        <span className={`text-2xl text-muted transition-transform ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open ? <div className="space-y-5 border-t border-hairline px-6 py-6">{children}</div> : null}
    </section>
  );
}
