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
 * Top-level SiteContent sections the admin console at /admin can
 * actually edit. Anything in this set is read from the Netlify Blobs
 * snapshot (so admin edits persist). Anything NOT in this set is
 * always read from the committed JSON on disk, so schema-shipped
 * copy changes (e.g. productHero.bestBefore, metricsPanel pill values)
 * go live the moment they're merged to main — no stale Blobs snapshot
 * can shadow them.
 *
 * Keep in sync with the section list rendered by
 * src/components/admin/AdminDashboard.tsx.
 */
const ADMIN_EDITABLE_SECTIONS = new Set<keyof SiteContent>([
  "brand",
  "orderStatus",
  "hero",
  "trustBar",
  "homeFeatured",
  "homeValues",
  "product",
  "ingredientsSection",
  "science",
  "benefits",
  "philosophy",
  "aeternyxPage",
  "about",
  "footer"
]);

export async function readContent(): Promise<SiteContent> {
  const disk = await readFromDisk();
  if (!isBlobsAvailable()) return disk;

  const blob = await readContentBlob<SiteContent>();
  if (!blob) return disk;

  // Start from disk (always fresh). For each admin-editable section,
  // SHALLOW-MERGE the Blobs overlay on top of disk's version of that
  // same section — so new top-level fields shipped in the schema
  // (e.g. orderStatus.useWhatsAppOrders) always show through, even
  // if the Blobs snapshot was last written before that field existed.
  // Admin-written fields still override disk defaults.
  const merged = { ...disk } as SiteContent;
  for (const key of ADMIN_EDITABLE_SECTIONS) {
    const blobSection = (blob as Partial<SiteContent>)[key];
    if (blobSection === undefined) continue;
    const diskSection = (disk as Partial<SiteContent>)[key];
    if (
      diskSection &&
      typeof diskSection === "object" &&
      !Array.isArray(diskSection) &&
      blobSection &&
      typeof blobSection === "object" &&
      !Array.isArray(blobSection)
    ) {
      (merged as unknown as Record<string, unknown>)[key] = {
        ...(diskSection as Record<string, unknown>),
        ...(blobSection as Record<string, unknown>)
      };
    } else {
      (merged as unknown as Record<string, unknown>)[key] = blobSection;
    }
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
