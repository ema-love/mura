import "server-only";
import type { Order } from "@/lib/commerce/orders";
import { getProduct } from "@/lib/catalog";
import { brand } from "@/lib/brand";
import { orderStore } from "./order-store";
import { newId } from "./ids";
import { fulfilOrder, missingFiles, FulfilmentError } from "./fulfilment";

export type ClaimResult =
  | { ok: true; order: Order; resent: boolean }
  | { ok: false; status: number; error: string };

/**
 * Claim a free product: records a zero-value order and emails the download.
 * Claiming the same product twice with the same email resends the link instead of
 * creating duplicate orders.
 */
export async function claimFreeProduct(rawEmail: string, productId: string): Promise<ClaimResult> {
  const email = rawEmail.trim().toLowerCase();
  const product = getProduct(productId);
  if (!product || product.pricing.model !== "free" || product.status !== "published") {
    return { ok: false, status: 404, error: "This product isn't available for free download." };
  }

  if ((await missingFiles([product])).length) {
    return { ok: false, status: 503, error: "This download is being prepared. Please try again soon." };
  }

  const store = orderStore();
  const existing = (await store.listByEmail(email)).find((o) => o.status === "free" && o.items.some((i) => i.productId === product.id));

  try {
    if (existing) {
      const order = await fulfilOrder(existing, { force: true });
      return { ok: true, order, resent: true };
    }
    const now = new Date().toISOString();
    const order = await store.create({
      id: newId("ord"),
      email,
      items: [{ productId: product.id, productName: product.name, unitAmount: 0, quantity: 1 }],
      currency: brand.currency,
      subtotal: 0,
      providerFee: null,
      total: 0,
      status: "free",
      provider: "none",
      reference: newId("free"),
      createdAt: now,
      verifiedAt: now,
      fulfilment: { downloads: 0 },
    });
    return { ok: true, order: await fulfilOrder(order), resent: false };
  } catch (e) {
    if (e instanceof FulfilmentError && e.code === "email-failed") {
      return { ok: false, status: 502, error: "We couldn't send the email just now. Please try again in a moment." };
    }
    console.error("[claim]", e);
    return { ok: false, status: 500, error: "Something went wrong. Please try again." };
  }
}
