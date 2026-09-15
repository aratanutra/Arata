import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Admin-gated helper: bcrypt-hash a plaintext password. Meant for
 * one-time migration from ADMIN_PASSWORD (plaintext) → ADMIN_PASSWORD_HASH
 * (bcrypt). The plaintext is never stored server-side — this endpoint
 * just runs bcrypt.hash and returns the hash for the admin to paste
 * into Netlify's env vars.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { password?: unknown; cost?: unknown };
  try {
    body = (await req.json()) as { password?: unknown; cost?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }
  if (password.length > 200) {
    return NextResponse.json(
      { error: "Password is too long (max 200 characters)." },
      { status: 400 }
    );
  }

  const cost = Number.isInteger(body.cost) ? Math.max(10, Math.min(14, Number(body.cost))) : 12;
  const hash = await bcrypt.hash(password, cost);
  return NextResponse.json({ hash, cost });
}
