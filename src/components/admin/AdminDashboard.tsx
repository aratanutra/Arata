"use client";

import { useCallback, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import type { SiteContent, BlogPost, Ingredient } from "@/types/content";
import SectionCard from "./SectionCard";
import { TextField } from "./Field";
import ImageUploader from "./ImageUploader";

type Props = {
  initialContent: SiteContent;
  adminEmail: string;
};

type Status = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; msg: string };

export default function AdminDashboard({ initialContent, adminEmail }: Props) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const update = useCallback(<K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function save() {
    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });
      if (!res.ok) {
        const { error } = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(error ?? `Save failed (${res.status})`);
      }
      setStatus({ kind: "saved" });
      setTimeout(() => setStatus({ kind: "idle" }), 2400);
    } catch (e) {
      setStatus({ kind: "error", msg: e instanceof Error ? e.message : "Save failed" });
    }
  }

  const sections = useMemo(
    () => [
      { id: "brand", label: "Brand" },
      { id: "nav", label: "Navigation" },
      { id: "hero", label: "Hero" },
      { id: "trustBar", label: "Trust Bar" },
      { id: "product", label: "Product" },
      { id: "ingredientsSection", label: "Ingredients" },
      { id: "science", label: "Science" },
      { id: "benefits", label: "Benefits" },
      { id: "philosophy", label: "Philosophy" },
      { id: "prescription", label: "Prescription" },
      { id: "blog", label: "Blog" },
      { id: "newsletter", label: "Newsletter" },
      { id: "footer", label: "Footer" }
    ],
    []
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="flex flex-col gap-4 border-b border-gold-soft pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-accent text-[10px] uppercase tracking-widest text-gold">
            ARATA Nutraceuticals  •  Aeternyx™ Console
          </p>
          <h1 className="mt-2 font-display text-5xl text-gold-gradient">Content Studio</h1>
          <p className="mt-2 font-body text-sm text-text-secondary">
            Edit any field below. Changes are persisted to <code className="text-gold">/content/site-content.json</code>.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-accent text-[10px] uppercase tracking-widest text-text-secondary">
            {adminEmail}
          </span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="btn-ghost"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="sticky top-4 z-10 mt-6 flex items-center justify-between rounded-2xl border border-gold/30 bg-obsidian/85 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-4 overflow-x-auto">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap font-accent text-[10px] uppercase tracking-widest text-text-secondary hover:text-gold"
            >
              {s.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {status.kind === "saved" ? (
            <span className="font-accent text-[10px] uppercase tracking-widest text-gold">
              ✓ Saved
            </span>
          ) : status.kind === "error" ? (
            <span className="font-accent text-[10px] uppercase tracking-widest text-red-300">
              {status.msg}
            </span>
          ) : null}
          <button type="button" onClick={save} disabled={status.kind === "saving"} className="btn-gold">
            {status.kind === "saving" ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <BrandCard content={content} update={update} />
        <NavCard content={content} update={update} />
        <HeroCard content={content} update={update} />
        <TrustBarCard content={content} update={update} />
        <ProductCard content={content} update={update} />
        <IngredientsCard content={content} update={update} />
        <ScienceCard content={content} update={update} />
        <BenefitsCard content={content} update={update} />
        <PhilosophyCard content={content} update={update} />
        <PrescriptionCard content={content} update={update} />
        <BlogCard content={content} update={update} />
        <NewsletterCard content={content} update={update} />
        <FooterCard content={content} update={update} />
      </div>
    </div>
  );
}

type CardProps = {
  content: SiteContent;
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
};

function BrandCard({ content, update }: CardProps) {
  const v = content.brand;
  const set = (patch: Partial<SiteContent["brand"]>) => update("brand", { ...v, ...patch });
  return (
    <SectionCard id="brand" title="Brand Identity" subtitle="Used in nav, hero, footer, prescription card" defaultOpen>
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Product Name" value={v.name} onChange={(x) => set({ name: x })} />
        <TextField label="Trademark" value={v.trademark} onChange={(x) => set({ trademark: x })} />
        <TextField label="Company" value={v.company} onChange={(x) => set({ company: x })} />
        <TextField label="Tagline" value={v.tagline} onChange={(x) => set({ tagline: x })} />
        <TextField label="Price" value={v.price} onChange={(x) => set({ price: x })} />
        <TextField label="Price Cadence" value={v.priceCadence} onChange={(x) => set({ priceCadence: x })} />
        <TextField label="Logo Mark (1 character)" value={v.logoMark} onChange={(x) => set({ logoMark: x })} />
      </div>
    </SectionCard>
  );
}

function NavCard({ content, update }: CardProps) {
  const v = content.nav;
  const set = (patch: Partial<SiteContent["nav"]>) => update("nav", { ...v, ...patch });
  return (
    <SectionCard id="nav" title="Navigation" subtitle="Header links + reservation CTA">
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="CTA Label" value={v.ctaLabel} onChange={(x) => set({ ctaLabel: x })} />
        <TextField label="CTA Href" value={v.ctaHref} onChange={(x) => set({ ctaHref: x })} />
      </div>
      <div>
        <label className="label-luxe">Links</label>
        <div className="space-y-3">
          {v.links.map((link, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                className="input-luxe"
                value={link.label}
                onChange={(e) => {
                  const next = [...v.links];
                  next[i] = { ...link, label: e.target.value };
                  set({ links: next });
                }}
              />
              <input
                className="input-luxe"
                value={link.href}
                onChange={(e) => {
                  const next = [...v.links];
                  next[i] = { ...link, href: e.target.value };
                  set({ links: next });
                }}
              />
              <button
                type="button"
                onClick={() => set({ links: v.links.filter((_, j) => j !== i) })}
                className="font-accent text-[10px] uppercase tracking-widest text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set({ links: [...v.links, { label: "New", href: "#" }] })}
            className="font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
          >
            + Add link
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

function HeroCard({ content, update }: CardProps) {
  const v = content.hero;
  const set = (patch: Partial<SiteContent["hero"]>) => update("hero", { ...v, ...patch });
  return (
    <SectionCard id="hero" title="Hero" subtitle="Full-viewport opening with the gold orb">
      <TextField label="Eyebrow" value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} />
      <TextField label="Title" value={v.title} onChange={(x) => set({ title: x })} />
      <TextField label="Tagline" value={v.tagline} onChange={(x) => set({ tagline: x })} />
      <TextField label="Subtitle" value={v.subtitle} onChange={(x) => set({ subtitle: x })} multiline />
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          label="Primary CTA — Label"
          value={v.primaryCta.label}
          onChange={(x) => set({ primaryCta: { ...v.primaryCta, label: x } })}
        />
        <TextField
          label="Primary CTA — Href"
          value={v.primaryCta.href}
          onChange={(x) => set({ primaryCta: { ...v.primaryCta, href: x } })}
        />
        <TextField
          label="Secondary CTA — Label"
          value={v.secondaryCta.label}
          onChange={(x) => set({ secondaryCta: { ...v.secondaryCta, label: x } })}
        />
        <TextField
          label="Secondary CTA — Href"
          value={v.secondaryCta.href}
          onChange={(x) => set({ secondaryCta: { ...v.secondaryCta, href: x } })}
        />
      </div>
    </SectionCard>
  );
}

function TrustBarCard({ content, update }: CardProps) {
  const v = content.trustBar;
  return (
    <SectionCard id="trustBar" title="Trust Bar" subtitle="Five trust badges below the hero">
      {v.badges.map((b, i) => (
        <div key={i} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            className="input-luxe"
            value={b.title}
            onChange={(e) => {
              const next = [...v.badges];
              next[i] = { ...b, title: e.target.value };
              update("trustBar", { badges: next });
            }}
          />
          <input
            className="input-luxe"
            value={b.subtitle}
            onChange={(e) => {
              const next = [...v.badges];
              next[i] = { ...b, subtitle: e.target.value };
              update("trustBar", { badges: next });
            }}
          />
          <button
            type="button"
            onClick={() => update("trustBar", { badges: v.badges.filter((_, j) => j !== i) })}
            className="font-accent text-[10px] uppercase tracking-widest text-red-300"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          update("trustBar", { badges: [...v.badges, { title: "New Badge", subtitle: "Subtitle" }] })
        }
        className="font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
      >
        + Add badge
      </button>
    </SectionCard>
  );
}

function ProductCard({ content, update }: CardProps) {
  const v = content.product;
  const set = (patch: Partial<SiteContent["product"]>) => update("product", { ...v, ...patch });
  return (
    <SectionCard id="product" title="Product" subtitle="Split layout: capsule visual + stats">
      <TextField label="Eyebrow" value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} />
      <TextField label="Title" value={v.title} onChange={(x) => set({ title: x })} multiline rows={2} />
      <TextField label="Description" value={v.description} onChange={(x) => set({ description: x })} multiline />
      <TextField label="Price" value={v.price} onChange={(x) => set({ price: x })} />
      <TextField label="Cadence" value={v.cadence} onChange={(x) => set({ cadence: x })} />
      <ImageUploader label="Capsule image (optional)" value={v.image} onChange={(url) => set({ image: url })} />
      <div>
        <label className="label-luxe">Stat Cards</label>
        {v.stats.map((s, i) => (
          <div key={i} className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
            <input
              className="input-luxe"
              value={s.value}
              onChange={(e) => {
                const next = [...v.stats];
                next[i] = { ...s, value: e.target.value };
                set({ stats: next });
              }}
            />
            <input
              className="input-luxe"
              value={s.label}
              onChange={(e) => {
                const next = [...v.stats];
                next[i] = { ...s, label: e.target.value };
                set({ stats: next });
              }}
            />
            <button
              type="button"
              onClick={() => set({ stats: v.stats.filter((_, j) => j !== i) })}
              className="font-accent text-[10px] uppercase tracking-widest text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set({ stats: [...v.stats, { value: "0", label: "Label" }] })}
          className="mt-2 font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
        >
          + Add stat
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          label="Primary CTA — Label"
          value={v.primaryCta.label}
          onChange={(x) => set({ primaryCta: { ...v.primaryCta, label: x } })}
        />
        <TextField
          label="Primary CTA — Href"
          value={v.primaryCta.href}
          onChange={(x) => set({ primaryCta: { ...v.primaryCta, href: x } })}
        />
        <TextField
          label="Secondary CTA — Label"
          value={v.secondaryCta.label}
          onChange={(x) => set({ secondaryCta: { ...v.secondaryCta, label: x } })}
        />
        <TextField
          label="Secondary CTA — Href"
          value={v.secondaryCta.href}
          onChange={(x) => set({ secondaryCta: { ...v.secondaryCta, href: x } })}
        />
      </div>
    </SectionCard>
  );
}

function IngredientsCard({ content, update }: CardProps) {
  const v = content.ingredientsSection;
  const set = (patch: Partial<SiteContent["ingredientsSection"]>) =>
    update("ingredientsSection", { ...v, ...patch });
  const setItem = (i: number, patch: Partial<Ingredient>) => {
    const next = [...v.items];
    next[i] = { ...next[i], ...patch };
    set({ items: next });
  };
  return (
    <SectionCard id="ingredientsSection" title="Ingredients" subtitle="All ten bioactives — name, dose, mechanism">
      <TextField label="Eyebrow" value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} />
      <TextField label="Title" value={v.title} onChange={(x) => set({ title: x })} />
      <TextField label="Subtitle" value={v.subtitle} onChange={(x) => set({ subtitle: x })} multiline />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold-soft text-left font-accent text-[10px] uppercase tracking-widest text-text-secondary">
              <th className="py-2 pr-3">#</th>
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Dose</th>
              <th className="py-2 pr-3">Description</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {v.items.map((ing, i) => (
              <tr key={i} className="align-top border-b border-gold-soft/40">
                <td className="py-3 pr-3 font-accent text-[10px] text-text-secondary">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="py-3 pr-3">
                  <input
                    className="input-luxe"
                    value={ing.name}
                    onChange={(e) => setItem(i, { name: e.target.value })}
                  />
                </td>
                <td className="py-3 pr-3">
                  <input
                    className="input-luxe w-28"
                    value={ing.dose}
                    onChange={(e) => setItem(i, { dose: e.target.value })}
                  />
                </td>
                <td className="py-3 pr-3">
                  <textarea
                    className="input-luxe min-h-[88px]"
                    value={ing.description}
                    onChange={(e) => setItem(i, { description: e.target.value })}
                  />
                </td>
                <td className="py-3 pl-2 text-right">
                  <button
                    type="button"
                    onClick={() => set({ items: v.items.filter((_, j) => j !== i) })}
                    className="font-accent text-[10px] uppercase tracking-widest text-red-300"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() =>
          set({
            items: [
              ...v.items,
              { name: "New Ingredient", dose: "0mg", description: "Mechanism and dose rationale." }
            ]
          })
        }
        className="font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
      >
        + Add ingredient
      </button>
    </SectionCard>
  );
}

function ScienceCard({ content, update }: CardProps) {
  const v = content.science;
  const set = (patch: Partial<SiteContent["science"]>) => update("science", { ...v, ...patch });
  return (
    <SectionCard id="science" title="Science" subtitle="Five aging pathways">
      <TextField label="Eyebrow" value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} />
      <TextField label="Title" value={v.title} onChange={(x) => set({ title: x })} />
      <TextField label="Subtitle" value={v.subtitle} onChange={(x) => set({ subtitle: x })} multiline />
      <div>
        <label className="label-luxe">Pathways</label>
        {v.pathways.map((p, i) => (
          <div key={i} className="mb-3 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
            <input
              className="input-luxe"
              value={p.name}
              onChange={(e) => {
                const next = [...v.pathways];
                next[i] = { ...p, name: e.target.value };
                set({ pathways: next });
              }}
            />
            <input
              className="input-luxe"
              value={p.detail}
              onChange={(e) => {
                const next = [...v.pathways];
                next[i] = { ...p, detail: e.target.value };
                set({ pathways: next });
              }}
            />
            <button
              type="button"
              onClick={() => set({ pathways: v.pathways.filter((_, j) => j !== i) })}
              className="font-accent text-[10px] uppercase tracking-widest text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set({ pathways: [...v.pathways, { name: "New pathway", detail: "Detail" }] })}
          className="font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
        >
          + Add pathway
        </button>
      </div>
    </SectionCard>
  );
}

function BenefitsCard({ content, update }: CardProps) {
  const v = content.benefits;
  const set = (patch: Partial<SiteContent["benefits"]>) => update("benefits", { ...v, ...patch });
  return (
    <SectionCard id="benefits" title="Benefits" subtitle="Eight system-level outcomes">
      <TextField label="Eyebrow" value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} />
      <TextField label="Title" value={v.title} onChange={(x) => set({ title: x })} />
      <div>
        <label className="label-luxe">Tiles (icon keys: energy, cognition, heart, skin, eye, cell, shield, gut)</label>
        {v.tiles.map((t, i) => (
          <div key={i} className="mb-3 grid gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
            <input
              className="input-luxe"
              value={t.icon}
              onChange={(e) => {
                const next = [...v.tiles];
                next[i] = { ...t, icon: e.target.value };
                set({ tiles: next });
              }}
            />
            <input
              className="input-luxe"
              value={t.title}
              onChange={(e) => {
                const next = [...v.tiles];
                next[i] = { ...t, title: e.target.value };
                set({ tiles: next });
              }}
            />
            <input
              className="input-luxe"
              value={t.detail}
              onChange={(e) => {
                const next = [...v.tiles];
                next[i] = { ...t, detail: e.target.value };
                set({ tiles: next });
              }}
            />
            <button
              type="button"
              onClick={() => set({ tiles: v.tiles.filter((_, j) => j !== i) })}
              className="font-accent text-[10px] uppercase tracking-widest text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            set({ tiles: [...v.tiles, { icon: "cell", title: "New Tile", detail: "Detail" }] })
          }
          className="font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
        >
          + Add tile
        </button>
      </div>
    </SectionCard>
  );
}

function PhilosophyCard({ content, update }: CardProps) {
  const v = content.philosophy;
  const set = (patch: Partial<SiteContent["philosophy"]>) => update("philosophy", { ...v, ...patch });
  return (
    <SectionCard id="philosophy" title="Philosophy" subtitle="Founder quote">
      <TextField label="Eyebrow" value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} />
      <TextField label="Quote" value={v.quote} onChange={(x) => set({ quote: x })} multiline rows={6} />
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Founder Name" value={v.founderName} onChange={(x) => set({ founderName: x })} />
        <TextField label="Founder Title" value={v.founderTitle} onChange={(x) => set({ founderTitle: x })} />
      </div>
    </SectionCard>
  );
}

function PrescriptionCard({ content, update }: CardProps) {
  const v = content.prescription;
  const set = (patch: Partial<SiteContent["prescription"]>) => update("prescription", { ...v, ...patch });
  return (
    <SectionCard id="prescription" title="Prescription" subtitle="Doctor specialties + Rx card">
      <TextField label="Eyebrow" value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} />
      <TextField label="Title" value={v.title} onChange={(x) => set({ title: x })} />
      <TextField label="Subtitle" value={v.subtitle} onChange={(x) => set({ subtitle: x })} multiline />
      <div>
        <label className="label-luxe">Specialties</label>
        {v.specialties.map((s, i) => (
          <div key={i} className="mb-2 flex gap-3">
            <input
              className="input-luxe"
              value={s}
              onChange={(e) => {
                const next = [...v.specialties];
                next[i] = e.target.value;
                set({ specialties: next });
              }}
            />
            <button
              type="button"
              onClick={() => set({ specialties: v.specialties.filter((_, j) => j !== i) })}
              className="font-accent text-[10px] uppercase tracking-widest text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set({ specialties: [...v.specialties, "New specialty"] })}
          className="font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
        >
          + Add specialty
        </button>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          label="Rx Header"
          value={v.rxCard.header}
          onChange={(x) => set({ rxCard: { ...v.rxCard, header: x } })}
        />
        <TextField
          label="Rx Date Placeholder"
          value={v.rxCard.date}
          onChange={(x) => set({ rxCard: { ...v.rxCard, date: x } })}
        />
        <TextField
          label="Rx Patient Line"
          value={v.rxCard.patient}
          onChange={(x) => set({ rxCard: { ...v.rxCard, patient: x } })}
        />
        <TextField
          label="Rx Signature"
          value={v.rxCard.signature}
          onChange={(x) => set({ rxCard: { ...v.rxCard, signature: x } })}
        />
      </div>
      <div>
        <label className="label-luxe">Rx Lines</label>
        {v.rxCard.lines.map((line, i) => (
          <div key={i} className="mb-2 flex gap-3">
            <input
              className="input-luxe"
              value={line}
              onChange={(e) => {
                const next = [...v.rxCard.lines];
                next[i] = e.target.value;
                set({ rxCard: { ...v.rxCard, lines: next } });
              }}
            />
            <button
              type="button"
              onClick={() =>
                set({ rxCard: { ...v.rxCard, lines: v.rxCard.lines.filter((_, j) => j !== i) } })
              }
              className="font-accent text-[10px] uppercase tracking-widest text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => set({ rxCard: { ...v.rxCard, lines: [...v.rxCard.lines, "New line"] } })}
          className="font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
        >
          + Add line
        </button>
      </div>
    </SectionCard>
  );
}

function BlogCard({ content, update }: CardProps) {
  const v = content.blog;
  const set = (patch: Partial<SiteContent["blog"]>) => update("blog", { ...v, ...patch });
  const setPost = (i: number, patch: Partial<BlogPost>) => {
    const next = [...v.posts];
    next[i] = { ...next[i], ...patch };
    set({ posts: next });
  };
  return (
    <SectionCard id="blog" title="Blog / Journal" subtitle="Three-card grid of essays">
      <TextField label="Eyebrow" value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} />
      <TextField label="Title" value={v.title} onChange={(x) => set({ title: x })} />
      <div className="space-y-6">
        {v.posts.map((p, i) => (
          <div key={p.id} className="rounded-xl border border-gold-soft p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-accent text-[10px] uppercase tracking-widest text-gold">
                Post #{i + 1}  •  id: {p.id}
              </span>
              <button
                type="button"
                onClick={() => set({ posts: v.posts.filter((_, j) => j !== i) })}
                className="font-accent text-[10px] uppercase tracking-widest text-red-300"
              >
                Delete
              </button>
            </div>
            <TextField label="Title" value={p.title} onChange={(x) => setPost(i, { title: x })} />
            <TextField label="Slug" value={p.slug} onChange={(x) => setPost(i, { slug: x })} />
            <TextField label="Excerpt" value={p.excerpt} onChange={(x) => setPost(i, { excerpt: x })} multiline />
            <TextField
              label="Body (optional, markdown)"
              value={p.body ?? ""}
              onChange={(x) => setPost(i, { body: x })}
              multiline
              rows={6}
            />
            <ImageUploader label="Image" value={p.image} onChange={(url) => setPost(i, { image: url })} />
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={p.published}
                onChange={(e) => setPost(i, { published: e.target.checked })}
                className="h-4 w-4 accent-[#C9A96E]"
              />
              <span className="font-accent text-[10px] uppercase tracking-widest text-text-secondary">
                Published
              </span>
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            set({
              posts: [
                ...v.posts,
                {
                  id: `p${Date.now()}`,
                  title: "New essay",
                  slug: "new-essay",
                  excerpt: "Short excerpt",
                  image: "",
                  published: false
                }
              ]
            })
          }
          className="font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
        >
          + Add post
        </button>
      </div>
    </SectionCard>
  );
}

function NewsletterCard({ content, update }: CardProps) {
  const v = content.newsletter;
  const set = (patch: Partial<SiteContent["newsletter"]>) => update("newsletter", { ...v, ...patch });
  return (
    <SectionCard id="newsletter" title="Newsletter" subtitle="Email capture">
      <TextField label="Eyebrow" value={v.eyebrow} onChange={(x) => set({ eyebrow: x })} />
      <TextField label="Title" value={v.title} onChange={(x) => set({ title: x })} />
      <TextField label="Subtitle" value={v.subtitle} onChange={(x) => set({ subtitle: x })} multiline />
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Placeholder" value={v.placeholder} onChange={(x) => set({ placeholder: x })} />
        <TextField label="Button Label" value={v.buttonLabel} onChange={(x) => set({ buttonLabel: x })} />
      </div>
      <TextField label="Disclaimer" value={v.disclaimer} onChange={(x) => set({ disclaimer: x })} />
    </SectionCard>
  );
}

function FooterCard({ content, update }: CardProps) {
  const v = content.footer;
  const set = (patch: Partial<SiteContent["footer"]>) => update("footer", { ...v, ...patch });
  return (
    <SectionCard id="footer" title="Footer" subtitle="Four columns of links + legal line">
      <TextField label="Tagline" value={v.tagline} onChange={(x) => set({ tagline: x })} />
      <TextField label="Address" value={v.address} onChange={(x) => set({ address: x })} />
      <TextField label="Rights" value={v.rights} onChange={(x) => set({ rights: x })} />

      {v.columns.map((col, ci) => (
        <div key={ci} className="rounded-xl border border-gold-soft p-5 space-y-3">
          <div className="flex items-center justify-between">
            <input
              className="input-luxe font-display text-lg"
              value={col.title}
              onChange={(e) => {
                const next = [...v.columns];
                next[ci] = { ...col, title: e.target.value };
                set({ columns: next });
              }}
            />
            <button
              type="button"
              onClick={() => set({ columns: v.columns.filter((_, j) => j !== ci) })}
              className="ml-3 font-accent text-[10px] uppercase tracking-widest text-red-300"
            >
              Delete column
            </button>
          </div>
          {col.links.map((l, li) => (
            <div key={li} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input
                className="input-luxe"
                value={l.label}
                onChange={(e) => {
                  const nextCols = [...v.columns];
                  const nextLinks = [...col.links];
                  nextLinks[li] = { ...l, label: e.target.value };
                  nextCols[ci] = { ...col, links: nextLinks };
                  set({ columns: nextCols });
                }}
              />
              <input
                className="input-luxe"
                value={l.href}
                onChange={(e) => {
                  const nextCols = [...v.columns];
                  const nextLinks = [...col.links];
                  nextLinks[li] = { ...l, href: e.target.value };
                  nextCols[ci] = { ...col, links: nextLinks };
                  set({ columns: nextCols });
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const nextCols = [...v.columns];
                  nextCols[ci] = { ...col, links: col.links.filter((_, k) => k !== li) };
                  set({ columns: nextCols });
                }}
                className="font-accent text-[10px] uppercase tracking-widest text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const nextCols = [...v.columns];
              nextCols[ci] = { ...col, links: [...col.links, { label: "New", href: "#" }] };
              set({ columns: nextCols });
            }}
            className="font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
          >
            + Add link
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => set({ columns: [...v.columns, { title: "New Column", links: [] }] })}
        className="font-accent text-[10px] uppercase tracking-widest text-gold hover:text-gold-light"
      >
        + Add column
      </button>
    </SectionCard>
  );
}
