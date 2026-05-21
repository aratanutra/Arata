import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { promises as fs } from "fs";
import path from "path";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"]);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || mimeToExt(file.type);
  const safeBase = path
    .basename(file.name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .slice(0, 40) || "upload";
  const filename = `${safeBase}-${Date.now()}${ext}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const target = path.join(uploadsDir, filename);
  await fs.writeFile(target, bytes);

  return NextResponse.json({ url: `/uploads/${filename}` });
}

function mimeToExt(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/svg+xml":
      return ".svg";
    case "image/gif":
      return ".gif";
    default:
      return "";
  }
}
