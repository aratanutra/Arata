import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Read-only diagnostic: reports which env vars the running function
 * can actually see. Never returns secret values. Also lists all env
 * var *names* that start with RAZORPAY (helps catch typos like
 * RAZOR_PAY_KEY_ID or trailing whitespace).
 */
export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID ?? "";
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";

  const razorpayVarNames = Object.keys(process.env)
    .filter((k) => k.toUpperCase().includes("RAZOR"))
    .sort();

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
    razorpayVarNamesInEnv: razorpayVarNames
  });
}
