import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  newReviewId,
  reviewsEnabled,
  saveReview,
  type StoredReview
} from "@/lib/reviews";
import { getOrder, ordersEnabled } from "@/lib/orders";
import { savePhoto } from "@/lib/review-photos";
import { rateLimit } from "@/lib/ratelimit";
import { sendReviewSubmittedAlert } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Public: submit a review (with optional photo). Multipart form body.
 * Fields: name, city, state?, rating (1-5), title, body, email?, orderId?,
 *         website (honeypot — must be empty), photo? (image/jpeg|png|webp, <= 4MB)
 *
 * Review is created in "pending" status. Admin approves via /admin/reviews.
 * Admin email alert fires immediately so you can act on new submissions.
 */
export async function POST(req: Request) {
  if (!reviewsEnabled()) {
    return NextResponse.json(
      { error: "Reviews are currently unavailable. Please try again later." },
      { status: 503 }
    );
  }

  // Rate-limit by IP: 5 submissions per hour per IP.
  const hdrs = headers();
  const ip =
    hdrs.get("x-nf-client-connection-ip") ??
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const rl = rateLimit(`review:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many reviews from this address. Please try again later." },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data body." }, { status: 400 });
  }

  // Honeypot — bots fill it, humans don't see it.
  const honeypot = String(form.get("website") ?? "").trim();
  if (honeypot) {
    // Silent pretend-success so the bot doesn't retry.
    return NextResponse.json({ ok: true });
  }

  const name = str(form.get("name"));
  const city = str(form.get("city"));
  const state = str(form.get("state"));
  const ratingRaw = Number(form.get("rating"));
  const title = str(form.get("title"));
  const body = str(form.get("body"));
  const email = str(form.get("email"));
  const orderIdInput = str(form.get("orderId"));

  const errs: string[] = [];
  if (!name || name.length < 2) errs.push("name required (min 2 chars)");
  if (!city || city.length < 2) errs.push("city required");
  if (![1, 2, 3, 4, 5].includes(ratingRaw)) errs.push("rating must be 1-5");
  if (!title || title.length < 3) errs.push("title required (min 3 chars)");
  if (!body || body.length < 10) errs.push("review body required (min 10 chars)");
  if (body && body.length > 2000) errs.push("review body too long (max 2000 chars)");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errs.push("invalid email format");
  if (errs.length) {
    return NextResponse.json({ error: errs.join(" · ") }, { status: 400 });
  }

  // Verified-purchaser check — only if orderId was provided and matches a real order
  // whose stored customer email matches the submitted email (if provided), OR just
  // that the order exists in our Blobs store at all.
  let verifiedPurchaser = false;
  if (orderIdInput && ordersEnabled()) {
    const order = await getOrder(orderIdInput);
    if (order) {
      if (!email || order.customer.email.toLowerCase() === email.toLowerCase()) {
        verifiedPurchaser = true;
      }
    }
  }

  // Optional photo upload
  let photoKey: string | undefined;
  const photo = form.get("photo");
  if (photo && photo instanceof File && photo.size > 0) {
    const bytes = await photo.arrayBuffer();
    const res = await savePhoto(bytes, photo.type);
    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }
    photoKey = res.key;
  }

  const review: StoredReview = {
    id: newReviewId(),
    name: name!,
    city: city!,
    state: state || undefined,
    rating: ratingRaw as 1 | 2 | 3 | 4 | 5,
    title: title!,
    body: body!,
    email: email || undefined,
    orderId: orderIdInput || undefined,
    verifiedPurchaser,
    photoKey,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  await saveReview(review);

  // Fire admin alert — best-effort, don't block response on email failures.
  sendReviewSubmittedAlert(review).catch((err) => {
    console.error("[review.alert]", err);
  });

  return NextResponse.json({ ok: true, id: review.id });
}

function str(v: FormDataEntryValue | null): string {
  if (typeof v !== "string") return "";
  return v.trim();
}
