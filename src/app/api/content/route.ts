import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/content";
import { isBlobsAvailable } from "@/lib/blobs";
import { commitContent, githubCommitEnabled } from "@/lib/github";
import type { SiteContent } from "@/types/content";

export const dynamic = "force-dynamic";

// Every public route that reads content — bust its cache on save so the
// next request re-reads from Blobs and picks up the admin edit.
const REVALIDATE_PATHS = [
  "/",
  "/aeternyx",
  "/about",
  "/terms",
  "/privacy",
  "/refund-and-cancellation",
  "/return-policy",
  "/shipping-policy"
];

export async function GET() {
  const content = await readContent();
  return NextResponse.json(content);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: SiteContent;
  try {
    body = (await req.json()) as SiteContent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !body.brand || !body.hero) {
    return NextResponse.json({ error: "Malformed content" }, { status: 400 });
  }

  const authorEmail = session.user?.email ?? "admin@aratanutra.com";

  // Preferred path on Netlify: durable KV via Netlify Blobs, no external
  // credentials required. writeContent() handles the Blobs write when
  // process.env.NETLIFY is set.
  if (isBlobsAvailable()) {
    try {
      await writeContent(body);
      REVALIDATE_PATHS.forEach((p) => revalidatePath(p));
      return NextResponse.json({
        ok: true,
        mode: "blobs",
        note: "Saved. Live within seconds."
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Blobs write failed";
      return NextResponse.json({ error: msg }, { status: 502 });
    }
  }

  // Alternative production path: commit to GitHub so the JSON is
  // versioned in git. Slower (waits for a Netlify rebuild) but
  // audit-friendly. Kept for anyone who prefers git as source of truth.
  if (githubCommitEnabled()) {
    try {
      const { commitSha, commitUrl } = await commitContent(body, authorEmail);
      return NextResponse.json({
        ok: true,
        mode: "github",
        commitSha,
        commitUrl,
        note: "Committed to main. Live in ~90 s."
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown GitHub error";
      return NextResponse.json({ error: msg }, { status: 502 });
    }
  }

  // Local dev only — writes the JSON to disk so `npm run dev` behaves.
  try {
    await writeContent(body);
    REVALIDATE_PATHS.forEach((p) => revalidatePath(p));
    return NextResponse.json({ ok: true, mode: "local" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Write failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
