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
 * Read the current site content, preferring the Netlify Blobs copy
 * (the durable store admin edits write to). Falls back to the
 * committed JSON on disk when Blobs is unset or the site has never
 * been saved from the admin.
 */
export async function readContent(): Promise<SiteContent> {
  if (isBlobsAvailable()) {
    const blob = await readContentBlob<SiteContent>();
    if (blob) return blob;
  }
  return readFromDisk();
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
