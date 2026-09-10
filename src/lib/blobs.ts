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
 * True on any Netlify runtime. process.env.NETLIFY is only reliably
 * set at build; inside the Next.js Functions runtime we look for the
 * AWS Lambda / Netlify function markers that DO get injected.
 */
export function isBlobsAvailable(): boolean {
  return (
    process.env.NETLIFY === "true" ||
    process.env.NETLIFY_DEV === "true" ||
    !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
    !!process.env.LAMBDA_TASK_ROOT ||
    !!process.env.NETLIFY_BLOBS_CONTEXT
  );
}

function contentStore(): Store {
  // Auto-context works when Netlify's Next.js plugin injects
  // NETLIFY_BLOBS_CONTEXT. If that isn't there (some function
  // runtimes) but we have SITE_ID + a Netlify API token, fall back
  // to explicit credentials so the store still resolves.
  const siteID = process.env.SITE_ID ?? process.env.NETLIFY_SITE_ID;
  const token =
    process.env.NETLIFY_BLOBS_TOKEN ??
    process.env.NETLIFY_API_TOKEN ??
    process.env.NETLIFY_AUTH_TOKEN;
  if (siteID && token && !process.env.NETLIFY_BLOBS_CONTEXT) {
    return getStore({ name: STORE_NAME, consistency: "strong", siteID, token });
  }
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
