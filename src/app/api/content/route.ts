import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/content";
import { commitContent, githubCommitEnabled } from "@/lib/github";
import type { SiteContent } from "@/types/content";

export const dynamic = "force-dynamic";

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

  // Production: commit to GitHub → triggers Netlify build → new JSON goes live.
  // Local dev (no GITHUB_TOKEN): write to disk so `npm run dev` still works.
  if (githubCommitEnabled()) {
    try {
      const { commitSha, commitUrl } = await commitContent(body, authorEmail);
      return NextResponse.json({
        ok: true,
        mode: "github",
        commitSha,
        commitUrl,
        note: "Committed to main. Netlify will rebuild — the live site updates in ~90 s."
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown GitHub error";
      return NextResponse.json({ error: msg }, { status: 502 });
    }
  }

  try {
    await writeContent(body);
    revalidatePath("/");
    return NextResponse.json({ ok: true, mode: "local" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Write failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
