const PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? "";

/**
 * Prefix a public asset path with the configured deploy basePath.
 * Used for raw URLs read from JSON (e.g. CSS background-image strings) that
 * Next.js does not auto-rewrite. Returns the input untouched when no prefix is
 * configured, or when the input is absolute / a data URI / already prefixed.
 */
export function asset(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("data:")) return path;
  if (!PREFIX) return path;
  if (path.startsWith(PREFIX + "/") || path === PREFIX) return path;
  return PREFIX + (path.startsWith("/") ? path : "/" + path);
}
