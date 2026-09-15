/**
 * Orders store — persists paid + pending orders in Netlify Blobs so
 * we can look them up server-side (admin view, shipping, refunds).
 * Keyed by Razorpay order_id.
 */

import { getStore, type Store } from "@netlify/blobs";
import { isBlobsAvailable } from "./blobs";

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type StoredOrder = {
  orderId: string;
  receipt: string;
  amount: number; // paise
  currency: string;
  pack: { id: string; label: string; sublabel?: string };
  breakdown: {
    productPaise: number;
    shippingPaise: number;
  };
  customer: CustomerInfo;
  status: "created" | "paid" | "failed";
  createdAt: string;
  paidAt?: string;
  paymentId?: string;
};

const STORE_NAME = "orders";

function ordersStore(): Store {
  const siteID = process.env.SITE_ID ?? process.env.NETLIFY_SITE_ID;
  const token =
    process.env.NETLIFY_BLOBS_TOKEN ??
    process.env.NETLIFY_API_TOKEN ??
    process.env.NETLIFY_AUTH_TOKEN;
  if (siteID && token && !process.env.NETLIFY_BLOBS_CONTEXT) {
    return getStore({ name: STORE_NAME, consistency: "strong", siteID, token });
  }
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export function ordersEnabled(): boolean {
  return isBlobsAvailable();
}

export async function saveOrder(order: StoredOrder): Promise<void> {
  await ordersStore().setJSON(order.orderId, order);
}

export async function getOrder(orderId: string): Promise<StoredOrder | null> {
  try {
    const val = await ordersStore().get(orderId, { type: "json" });
    return (val as StoredOrder) ?? null;
  } catch {
    return null;
  }
}

export async function markOrderPaid(
  orderId: string,
  paymentId: string
): Promise<StoredOrder | null> {
  const existing = await getOrder(orderId);
  if (!existing) return null;
  const updated: StoredOrder = {
    ...existing,
    status: "paid",
    paymentId,
    paidAt: new Date().toISOString()
  };
  await saveOrder(updated);
  return updated;
}

export async function listOrders(limit = 100): Promise<StoredOrder[]> {
  const store = ordersStore();
  const out: StoredOrder[] = [];
  try {
    const listing = await store.list();
    const keys = listing.blobs.map((b) => b.key).slice(0, limit);
    for (const key of keys) {
      const val = await store.get(key, { type: "json" });
      if (val) out.push(val as StoredOrder);
    }
  } catch {
    // fall through; return whatever we managed
  }
  // Newest first.
  out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return out;
}
