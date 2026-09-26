import "server-only";
import type { Order } from "@/lib/commerce/orders";
import { getProduct, isAvailable } from "@/lib/catalog";
import { resolvePrice } from "@/lib/commerce/pricing";
import { paymentsEnabled } from "@/lib/commerce/config";
import { brand, absoluteUrl } from "@/lib/brand";
import { orderStore } from "./order-store";
import { newId } from "./ids";
import { fulfilOrder, missingFiles } from "./fulfilment";
import {
  createPaymentLink,
  flutterwaveConfigured,
  FlutterwaveError,
  verifyByReference,
  verifyTransaction,
  type FlutterwaveTransaction,
} from "./flutterwave";

/** Where Flutterwave sends the customer back to. It appends status, tx_ref and transaction_id. */
export const CHECKOUT_RETURN_PATH = "/checkout/complete";

export const checkoutOpen = () => paymentsEnabled && flutterwaveConfigured();

export type StartCheckoutResult = { ok: true; link: string; order: Order } | { ok: false; status: number; error: string };

/**
 * Creates a pending order at today's price and a Flutterwave payment link for it.
 * Nothing is delivered until the payment is verified server-side.
 */
export async function startCheckout(rawEmail: string, productId: string): Promise<StartCheckoutResult> {
  const email = rawEmail.trim().toLowerCase();
  const product = getProduct(productId);
  if (!product || !isAvailable(product) || product.pricing.model !== "paid") {
    return { ok: false, status: 404, error: "This product isn't available to buy." };
  }
  if (!checkoutOpen()) return { ok: false, status: 503, error: "Checkout is temporarily unavailable. Please try again soon." };

  const price = resolvePrice(product);
  if (price.model !== "paid") return { ok: false, status: 404, error: "This product isn't available to buy." };

  // Never take money for something we can't deliver right away.
  if ((await missingFiles([product])).length) {
    return { ok: false, status: 503, error: "This product is being prepared. Please try again soon." };
  }

  const store = orderStore();
  const order = await store.create({
    id: newId("ord"),
    email,
    items: [
      { productId: product.id, productName: product.name, unitAmount: price.final, quantity: 1, campaignId: price.discount?.campaign.id },
    ],
    currency: brand.currency,
    subtotal: price.final,
    providerFee: null,
    total: price.final,
    status: "pending",
    provider: "flutterwave",
    reference: newId("mura"),
    createdAt: new Date().toISOString(),
    fulfilment: { downloads: 0 },
  });

  try {
    const link = await createPaymentLink({
      txRef: order.reference,
      amount: order.subtotal,
      currency: order.currency,
      email,
      redirectUrl: absoluteUrl(CHECKOUT_RETURN_PATH),
      title: brand.name,
      description: product.name,
      meta: { order_id: order.id, product_id: product.id },
    });
    return { ok: true, link, order };
  } catch (e) {
    console.error("[checkout] could not create payment link", e);
    await store.update(order.id, (o) => ({ ...o, status: "failed", failureReason: "Payment link could not be created" }));
    return { ok: false, status: 502, error: "We couldn't reach the payment provider. Please try again in a moment." };
  }
}

export type PaymentOutcome =
  /** Verified and recorded. `delivered` is false if the email couldn't be sent yet. */
  | { state: "paid"; order: Order; delivered: boolean }
  /** Provider hasn't settled it yet (e.g. bank transfer still processing). */
  | { state: "pending"; order: Order }
  | { state: "cancelled"; order: Order }
  | { state: "failed"; order: Order }
  /** We couldn't confirm either way (provider unreachable, or a mismatched callback). */
  | { state: "unverified"; order: Order }
  | { state: "not-found" };

type Check = { result: "successful" } | { result: "pending" } | { result: "failed"; reason: string } | { result: "ignore"; reason: string };

/** Everything a transaction must match before an order is marked paid. */
export function checkTransaction(tx: FlutterwaveTransaction, order: Order): Check {
  // A transaction for another reference says nothing about this order — never act on it.
  if (tx.tx_ref !== order.reference) return { result: "ignore", reason: `reference mismatch (${tx.tx_ref})` };
  const status = tx.status?.toLowerCase();
  if (status === "failed" || status === "cancelled") return { result: "failed", reason: `provider status ${status}` };
  if (status !== "successful") return { result: "pending" };
  if (tx.currency?.toUpperCase() !== order.currency.toUpperCase()) {
    return { result: "failed", reason: `currency mismatch (${tx.currency}, expected ${order.currency})` };
  }
  if (!(Math.round(Number(tx.amount) * 100) >= order.subtotal)) {
    return { result: "failed", reason: `amount mismatch (${tx.amount}, expected ${order.subtotal / 100})` };
  }
  return { result: "successful" };
}

/** Minor units actually charged, and the payment charge the customer paid (if any). */
function charged(tx: FlutterwaveTransaction, order: Order) {
  const requested = Math.round(Number(tx.amount) * 100);
  const total = Math.round(Number(tx.charged_amount ?? tx.amount) * 100);
  const fee = total - requested;
  return { total: Number.isFinite(total) ? total : order.subtotal, providerFee: fee > 0 ? fee : null };
}

const RETRY_DELIVERY_AFTER_MS = 60_000;

async function deliver(order: Order): Promise<{ order: Order; delivered: boolean }> {
  try {
    const updated = await fulfilOrder(order);
    return { order: updated, delivered: !!updated.fulfilment?.emailedAt };
  } catch (e) {
    console.error(`[checkout] paid order ${order.id} not delivered yet`, e);
    return { order, delivered: false };
  }
}

/**
 * Confirms a payment with Flutterwave — from the customer's redirect or from the
 * webhook, whichever arrives first. Safe to call any number of times: an order is
 * marked paid once, and the delivery email is sent once.
 */
export async function confirmPayment({
  txRef,
  transactionId,
  redirectStatus,
}: {
  txRef: string;
  transactionId?: string | number | null;
  redirectStatus?: string | null;
}): Promise<PaymentOutcome> {
  const store = orderStore();
  const order = txRef ? await store.getByReference(txRef) : undefined;
  if (!order || order.provider !== "flutterwave") return { state: "not-found" };

  if (order.status === "paid") {
    // Already verified. Retry delivery only if an earlier attempt clearly didn't finish.
    const stale = !order.fulfilment?.emailedAt && Date.now() - Date.parse(order.verifiedAt ?? order.createdAt) > RETRY_DELIVERY_AFTER_MS;
    if (stale) return { state: "paid", ...(await deliver(order)) };
    return { state: "paid", order, delivered: !!order.fulfilment?.emailedAt };
  }

  // Cancelled on the payment page: there is no transaction to verify.
  if (!transactionId && redirectStatus === "cancelled") {
    const updated = await store.update(order.id, (o) => (o.status === "pending" ? { ...o, status: "cancelled" } : o));
    return updated.status === "paid" ? { state: "paid", order: updated, delivered: !!updated.fulfilment?.emailedAt } : { state: "cancelled", order: updated };
  }

  let tx: FlutterwaveTransaction;
  try {
    tx = transactionId ? await verifyTransaction(transactionId) : await verifyByReference(order.reference);
  } catch (e) {
    if (!(e instanceof FlutterwaveError)) throw e;
    console.error(`[checkout] verification failed for ${order.reference}`, e.message);
    return { state: "unverified", order };
  }

  const check = checkTransaction(tx, order);
  if (check.result === "ignore") {
    console.error(`[checkout] ${order.reference}: ${check.reason}`);
    return { state: "unverified", order };
  }
  if (check.result === "pending") return { state: "pending", order };
  if (check.result === "failed") {
    console.error(`[checkout] ${order.reference} not accepted: ${check.reason}`);
    const updated = await store.update(order.id, (o) =>
      o.status === "paid" ? o : { ...o, status: "failed", failureReason: check.reason, providerTransactionId: String(tx.id) },
    );
    return updated.status === "paid" ? { state: "paid", order: updated, delivered: !!updated.fulfilment?.emailedAt } : { state: "failed", order: updated };
  }

  // Mark paid exactly once, even if the redirect and the webhook race.
  let transitioned = false;
  const { total, providerFee } = charged(tx, order);
  const paid = await store.update(order.id, (o) => {
    if (o.status === "paid") {
      transitioned = false;
      return o;
    }
    transitioned = true;
    return {
      ...o,
      status: "paid",
      total,
      providerFee,
      providerTransactionId: String(tx.id),
      verifiedAt: new Date().toISOString(),
      failureReason: undefined,
    };
  });

  if (!transitioned) return { state: "paid", order: paid, delivered: !!paid.fulfilment?.emailedAt };
  return { state: "paid", ...(await deliver(paid)) };
}

/** Flutterwave webhook body (v3). Only the reference and id are trusted — and then re-verified. */
export async function handleWebhook(body: unknown): Promise<PaymentOutcome | { state: "ignored" }> {
  const payload = body as { event?: string; "event.type"?: string; data?: { id?: number | string; tx_ref?: string } } | null;
  const event = payload?.event ?? "";
  const data = payload?.data;
  if (!event.startsWith("charge.") || !data?.tx_ref || data.id === undefined) return { state: "ignored" };
  return confirmPayment({ txRef: String(data.tx_ref), transactionId: data.id });
}
