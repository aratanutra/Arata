import { getStore, type Store } from "@netlify/blobs";
import { isBlobsAvailable } from "./blobs";

const STORE_NAME = "review-photos";

function photoStore(): Store {
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

export function photosEnabled(): boolean {
  return isBlobsAvailable();
}

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB after client-side resize

export type SavePhotoResult =
  | { ok: true; key: string; contentType: string }
  | { ok: false; error: string };

export async function savePhoto(bytes: ArrayBuffer, contentType: string): Promise<SavePhotoResult> {
  if (!ALLOWED.has(contentType)) {
    return { ok: false, error: `Unsupported image type: ${contentType}. Use JPG, PNG, or WebP.` };
  }
  if (bytes.byteLength > MAX_BYTES) {
    return { ok: false, error: `Image too large (${(bytes.byteLength / 1024 / 1024).toFixed(1)} MB). Max 4 MB.` };
  }
  const key = newPhotoKey();
  await photoStore().set(key, bytes, {
    metadata: { contentType }
  });
  return { ok: true, key, contentType };
}

export async function getPhoto(key: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  try {
    const result = await photoStore().getWithMetadata(key, { type: "arrayBuffer" });
    if (!result) return null;
    const contentType =
      typeof result.metadata?.contentType === "string" ? result.metadata.contentType : "image/jpeg";
    return { bytes: result.data as ArrayBuffer, contentType };
  } catch {
    return null;
  }
}

export async function deletePhoto(key: string): Promise<boolean> {
  try {
    await photoStore().delete(key);
    return true;
  } catch {
    return false;
  }
}

function newPhotoKey(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
