import "server-only";
import type { Order } from "@/lib/commerce/orders";
import type { Product } from "@/lib/catalog/types";
import { getProduct } from "@/lib/catalog";
import { orderStore } from "./order-store";
import { verifyDownloadToken } from "./tokens";
import { deliverables, isDeliverable, orderIncludes } from "./fulfilment";
import { deliveryFor, isReady, type DeliveryItem } from "./delivery";
import { serverEnv } from "./env";

export type DownloadCheck =
  | { ok: true; order: Order; product: Product; items: DeliveryItem[] }
  | { ok: false; reason: "invalid" | "expired" | "not-paid" | "limit" | "unavailable" };

/**
 * Every check a download must pass: a valid, unexpired signature; a real order that
 * is free or verified-paid; a product that belongs to it; a file that exists; and a
 * sensible download count.
 */
export async function checkDownload(token: string): Promise<DownloadCheck> {
  const verified = verifyDownloadToken(token);
  if (!verified.ok) return { ok: false, reason: verified.reason === "expired" ? "expired" : "invalid" };

  const order = await orderStore().get(verified.claim.orderId);
  if (!order || !orderIncludes(order, verified.claim.productId)) return { ok: false, reason: "invalid" };
  if (!isDeliverable(order)) return { ok: false, reason: "not-paid" };

  const product = getProduct(verified.claim.productId);
  if (!product || !(await isReady(product))) return { ok: false, reason: "unavailable" };

  // Downloads are counted per order; the allowance scales with the number of files.
  const allowance = serverEnv.maxDownloadsPerItem * deliverables(order).length;
  if ((order.fulfilment?.downloads ?? 0) >= allowance) return { ok: false, reason: "limit" };

  return { ok: true, order, product, items: await deliveryFor(product) };
}

export async function recordDownload(orderId: string) {
  await orderStore().update(orderId, (o) => ({
    ...o,
    fulfilment: { ...o.fulfilment, downloads: (o.fulfilment?.downloads ?? 0) + 1, lastDownloadAt: new Date().toISOString() },
  }));
}
