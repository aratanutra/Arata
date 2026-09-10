/**
 * Netlify Blobs helper — durable storage for admin-edited content.
 *
 * On Netlify (Functions, Edge Functions, Next.js runtime), the SDK
 * auto-discovers site/token from the platform. No env vars required.
 * Locally (`npm run dev`), Blobs is unavailable — callers should fall
 * back to disk.
 */

import { getStore, type Store } from "@netlify/blobs";

const STORE_NAME = "site-content";
const CONTENT_KEY = "site-content.json";

/**
 * True on any Netlify runtime (build, functions, edge). Netlify sets
 * NETLIFY=true; some contexts also expose NETLIFY_DEV=true for local
 * `netlify dev` sessions where Blobs is also wired up.
 */
export function isBlobsAvailable(): boolean {
  return process.env.NETLIFY === "true" || process.env.NETLIFY_DEV === "true";
}

function contentStore(): Store {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export async function readContentBlob<T>(): Promise<T | null> {
  if (!isBlobsAvailable()) return null;
  try {
    const value = await contentStore().get(CONTENT_KEY, { type: "json" });
    return (value as T) ?? null;
  } catch {
    return null;
  }
}

export async function writeContentBlob(next: unknown): Promise<void> {
  await contentStore().setJSON(CONTENT_KEY, next);
}
