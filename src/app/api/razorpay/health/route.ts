import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Read-only diagnostic: reports which env vars the running function
 * can actually see, and — if both keys are present — tries a real
 * (throwaway) authenticated Razorpay call to prove the key/secret
 * pair works. Never returns secret values.
 */
export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID ?? "";
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";

  const razorpayVarNames = Object.keys(process.env)
    .filter((k) => k.toUpperCase().includes("RAZOR"))
    .sort();

  // Live auth probe: fetch a tiny (harmless) endpoint that requires
  // Basic Auth against the key pair. GET /v1/orders?count=1 lists at
  // most one existing order; a mismatched pair returns 401 with
  // "Authentication failed", a valid pair returns 200 with { items,
  // count } even if the count is 0.
  let authProbe: {
    attempted: boolean;
    ok?: boolean;
    status?: number;
    razorpayError?: unknown;
    hint?: string;
  } = { attempted: false };

  if (keyId && secret) {
    try {
      const auth = Buffer.from(`${keyId}:${secret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders?count=1", {
        method: "GET",
        headers: { Authorization: `Basic ${auth}` },
        cache: "no-store"
      });
      const contentType = res.headers.get("content-type") ?? "";
      const bodyRaw = contentType.includes("application/json")
        ? await res.json().catch(() => null)
        : await res.text().catch(() => null);
      authProbe = {
        attempted: true,
        ok: res.ok,
        status: res.status,
        razorpayError:
          !res.ok && bodyRaw && typeof bodyRaw === "object"
            ? (bodyRaw as { error?: unknown }).error ?? bodyRaw
            : !res.ok
              ? bodyRaw
              : undefined,
        hint: !res.ok
          ? "If status=401 with 'Authentication failed' the KEY_ID and KEY_SECRET are not a matching pair. Regenerate a fresh pair in the Razorpay dashboard (Settings → API Keys) and paste BOTH values in the same session into Netlify env vars, then trigger a deploy."
          : undefined
      };
    } catch (err) {
      authProbe = {
        attempted: true,
        ok: false,
        razorpayError: err instanceof Error ? err.message : String(err),
        hint: "Network error reaching api.razorpay.com from the Netlify function."
      };
    }
  }

  return NextResponse.json({
    keyIdPresent: keyId.length > 0,
    keyIdPrefix: keyId ? keyId.slice(0, 8) + "…" : null,
    keyIdLength: keyId.length || null,
    secretPresent: secret.length > 0,
    secretLength: secret.length || null,
    runtimeMarkers: {
      NETLIFY: process.env.NETLIFY ?? null,
      NETLIFY_DEV: process.env.NETLIFY_DEV ?? null,
      AWS_LAMBDA_FUNCTION_NAME: process.env.AWS_LAMBDA_FUNCTION_NAME ?? null,
      NODE_ENV: process.env.NODE_ENV ?? null
    },
    razorpayVarNamesInEnv: razorpayVarNames,
    authProbe
  });
}
