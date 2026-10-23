import { NextResponse } from "next/server";
import { getPhoto, photosEnabled } from "@/lib/review-photos";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Public: serve a review photo by key. Immutable cached (keys are
 * random; photos are never overwritten).
 */
export async function GET(_req: Request, { params }: { params: { key: string } }) {
  if (!photosEnabled()) {
    return new NextResponse("Not available", { status: 503 });
  }
  if (!/^[a-f0-9]{32}$/.test(params.key)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const photo = await getPhoto(params.key);
  if (!photo) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(photo.bytes, {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
