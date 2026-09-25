import "server-only";
import type { Order } from "@/lib/commerce/orders";
import type { Product } from "@/lib/catalog/types";
import { bundleItems, getProduct } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/brand";
import { orderStore } from "./order-store";
import { createDownloadToken } from "./tokens";
import { productFileExists } from "./files";
import { sendEmail, inboxConfigured } from "./email";
import { deliveryEmail, orderNotification, type DeliveryLine } from "./email-templates";
import { serverEnv } from "./env";

export class FulfilmentError extends Error {
  constructor(
    message: string,
    readonly code: "not-deliverable" | "files-missing" | "email-failed",
  ) {
    super(message);
  }
}

/** Products that produce files for an order. A bundle delivers each of its items. */
export function deliverables(order: Order): Product[] {
  const out: Product[] = [];
  for (const item of order.items) {
    const product = getProduct(item.productId);
    if (!product) continue;
    for (const p of product.type === "bundle" ? bundleItems(product) : [product]) {
      if (!out.some((o) => o.id === p.id)) out.push(p);
    }
  }
  return out;
}

/** An order may be delivered only once it's free or verified as paid. */
export const isDeliverable = (order: Order) => order.status === "paid" || order.status === "free";

/** Does this order entitle the holder to download this product? */
export const orderIncludes = (order: Order, productId: string) => deliverables(order).some((p) => p.id === productId);

export async function missingFiles(products: Product[]) {
  const missing: string[] = [];
  for (const p of products) if (!p.fileKey || !(await productFileExists(p.fileKey))) missing.push(p.id);
  return missing;
}

export function downloadLines(order: Order, now = Date.now()): DeliveryLine[] {
  return deliverables(order).map((p) => ({
    productName: p.name,
    url: absoluteUrl(`/downloads/${createDownloadToken(order.id, p.id, now)}`),
  }));
}

/**
 * Emails the customer their download links. Idempotent: an order that has already
 * been emailed isn't emailed again unless `force` is set (e.g. an explicit resend).
 */
export async function fulfilOrder(order: Order, { force = false } = {}): Promise<Order> {
  if (!isDeliverable(order)) throw new FulfilmentError("Order is not paid", "not-deliverable");
  if (order.fulfilment?.emailedAt && !force) return order;

  const products = deliverables(order);
  const missing = await missingFiles(products);
  if (missing.length) {
    console.error(`[fulfilment] Missing files for ${missing.join(", ")} (order ${order.id})`);
    throw new FulfilmentError("Files are not available yet", "files-missing");
  }

  const free = order.status === "free";
  const mail = deliveryEmail({ lines: downloadLines(order), free, orderId: order.id });
  const sent = await sendEmail({ to: order.email, ...mail });
  if (!sent.ok) throw new FulfilmentError(sent.error, "email-failed");

  const updated = await orderStore().update(order.id, (o) => ({
    ...o,
    fulfilment: { downloads: o.fulfilment?.downloads ?? 0, ...o.fulfilment, emailedAt: new Date().toISOString() },
  }));

  // Tell the company inbox — best effort, never blocks the customer.
  if (inboxConfigured() && !order.fulfilment?.emailedAt) {
    const note = orderNotification({ orderId: order.id, email: order.email, items: order.items.map((i) => i.productName), free });
    sendEmail({ to: serverEnv.inboxEmail!, ...note }).catch(() => undefined);
  }
  return updated;
}
