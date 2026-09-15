/**
 * Tiny in-memory sliding-window rate limiter.
 *
 * Netlify Functions can spin up multiple concurrent instances, so this
 * doesn't stop a determined distributed attacker — it does stop the
 * common case (one bad actor spamming a single instance) at near-zero
 * cost. For stronger protection, front the route with a real limiter
 * (Netlify Edge Functions, Cloudflare, Upstash Redis).
 */

type Bucket = { hits: number[]; lastCleaned: number };

const buckets = new Map<string, Bucket>();

const MAX_BUCKETS = 5000;

/**
 * Returns true if the request is allowed, false if it's rate-limited.
 * `key` should uniquely identify the requester (e.g. client IP).
 */
export function rateLimit(key: string, limit: number, windowMs: number): {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
} {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [], lastCleaned: now };

  // Prune expired hits.
  const cutoff = now - windowMs;
  const recent = bucket.hits.filter((t) => t > cutoff);

  if (recent.length >= limit) {
    const oldest = recent[0];
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, oldest + windowMs - now)
    };
  }

  recent.push(now);
  buckets.set(key, { hits: recent, lastCleaned: now });

  // Occasional GC of stale buckets to keep the map bounded.
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, v] of buckets) {
      if (v.hits.every((t) => t < cutoff)) buckets.delete(k);
    }
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - recent.length),
    retryAfterMs: 0
  };
}

/**
 * Best-effort client-ip extractor. Netlify Functions receive the
 * originating IP in X-Forwarded-For / X-NF-Client-Connection-Ip.
 */
export function clientIp(req: Request): string {
  const headers = req.headers;
  const nf = headers.get("x-nf-client-connection-ip");
  if (nf) return nf.trim();
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return "unknown";
}
