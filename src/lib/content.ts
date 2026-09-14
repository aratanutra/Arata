import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "@/types/content";
import { isBlobsAvailable, readContentBlob, writeContentBlob } from "./blobs";

const CONTENT_PATH = path.join(process.cwd(), "content", "site-content.json");

async function readFromDisk(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  return JSON.parse(raw) as SiteContent;
}

/**
 * Read the current site content. On Netlify, admin edits live in Blobs
 * and win, but disk (the committed JSON) provides defaults — so any
 * new field we add via git shows up even if the Blobs snapshot is
 * from an older schema (e.g. an old snapshot missing productHero.packs
 * shippingCost).
 */
export async function readContent(): Promise<SiteContent> {
  const disk = await readFromDisk();
  if (!isBlobsAvailable()) return disk;

  const blob = await readContentBlob<SiteContent>();
  if (!blob) return disk;

  // Shallow merge at the top level: any section only in disk (new field
  // shipped via git) flows through; any section admin has edited (in
  // Blobs) wins.
  const merged: SiteContent = { ...disk, ...blob };

  // Packs are edited in code, not admin, so let disk supply defaults per
  // pack id — this fills in fields like `shippingCost` on stale Blobs
  // snapshots without wiping any admin overrides.
  if (blob.productHero?.packs && disk.productHero?.packs) {
    merged.productHero = {
      ...disk.productHero,
      ...blob.productHero,
      packs: blob.productHero.packs.map((p) => {
        const diskPack = disk.productHero.packs.find((d) => d.id === p.id);
        return diskPack ? { ...diskPack, ...p } : p;
      })
    };
  }

  return merged;
}

/**
 * Persist the site content. On Netlify, writes to Blobs (durable
 * across deploys). Locally, writes to the JSON on disk so
 * `npm run dev` behaves the same as before.
 */
export async function writeContent(next: SiteContent): Promise<void> {
  if (isBlobsAvailable()) {
    await writeContentBlob(next);
    return;
  }
  const serialised = JSON.stringify(next, null, 2);
  await fs.writeFile(CONTENT_PATH, serialised, "utf8");
}
