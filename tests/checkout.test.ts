import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const root = mkdtempSync(path.join(tmpdir(), "mura-checkout-"));
const dataDir = path.join(root, "data");
const filesDir = path.join(root, "files");
const PRODUCT = "assignment-command-center";

type Mods = {
  checkout: typeof import("@/lib/server/checkout");
  flw: typeof import("@/lib/server/flutterwave");
  store: typeof import("@/lib/server/order-store");
  pricing: typeof import("@/lib/commerce/pricing");
  catalog: typeof import("@/lib/catalog");
};
let m: Mods;

/** Fake Flutterwave API. Each test sets what verification returns. */
let verifyResponse: { status: number; body: unknown } = { status: 200, body: {} };
let paymentsResponse: { status: number; body: unknown } = { status: 200, body: { status: "success", data: { link: "https://checkout.flutterwave.com/v3/hosted/pay/test" } } };
const calls: { url: string; init?: RequestInit }[] = [];

beforeAll(async () => {
  process.env.MURA_DATA_DIR = dataDir;
  process.env.PRODUCT_FILES_DIR = filesDir;
  process.env.MURA_STORAGE = "file";
  process.env.DOWNLOAD_TOKEN_SECRET = "test-secret";
  process.env.NEXT_PUBLIC_PAYMENTS_ENABLED = "true";
  process.env.FLW_SECRET_KEY = "FLWSECK_TEST-not-a-real-key-X";
  process.env.FLW_SECRET_HASH = "test-hash";
  delete process.env.FLW_MODE;
  delete process.env.SMTP_HOST;
  mkdirSync(path.join(filesDir, PRODUCT), { recursive: true });
  writeFileSync(path.join(filesDir, `${PRODUCT}/mura-${PRODUCT}.zip`), "PK test");

  vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    const r = url.includes("/payments") ? paymentsResponse : verifyResponse;
    return new Response(JSON.stringify(r.body), { status: r.status, headers: { "Content-Type": "application/json" } });
  });

  vi.resetModules();
  m = {
    checkout: await import("@/lib/server/checkout"),
    flw: await import("@/lib/server/flutterwave"),
    store: await import("@/lib/server/order-store"),
    pricing: await import("@/lib/commerce/pricing"),
    catalog: await import("@/lib/catalog"),
  };
});

afterAll(() => {
  vi.unstubAllGlobals();
  rmSync(root, { recursive: true, force: true });
});

beforeEach(() => {
  rmSync(dataDir, { recursive: true, force: true });
  calls.length = 0;
  paymentsResponse = { status: 200, body: { status: "success", data: { link: "https://checkout.flutterwave.com/v3/hosted/pay/test" } } };
});

const customerEmails = () => {
  try {
    return readdirSync(path.join(dataDir, "outbox")).filter((f) => f.endsWith(".json") && !f.includes("mura.creates@gmail.com"));
  } catch {
    return [];
  }
};

const expectedCents = () => {
  const p = m.pricing.resolvePrice(m.catalog.getProduct(PRODUCT)!);
  if (p.model !== "paid") throw new Error("test product must be paid");
  return p.final;
};

const tx = (order: { reference: string }, over: Record<string, unknown> = {}) => ({
  status: 200,
  body: {
    status: "success",
    data: {
      id: 555001,
      tx_ref: order.reference,
      status: "successful",
      currency: "USD",
      amount: expectedCents() / 100,
      charged_amount: expectedCents() / 100 + 0.35,
      app_fee: 0.35,
      ...over,
    },
  },
});

async function started() {
  const r = await m.checkout.startCheckout("Buyer@Example.com", PRODUCT);
  if (!r.ok) throw new Error(r.error);
  return r.order;
}

describe("configuration", () => {
  it("accepts a test key in test mode and refuses mismatched keys", () => {
    expect(m.flw.flutterwaveConfig()).toMatchObject({ ok: true, mode: "test" });
    const key = process.env.FLW_SECRET_KEY;
    process.env.FLW_SECRET_KEY = "FLWSECK-live-key-X";
    expect(m.flw.flutterwaveConfig().ok).toBe(false);
    process.env.FLW_MODE = "live";
    expect(m.flw.flutterwaveConfig()).toMatchObject({ ok: true, mode: "live" });
    process.env.FLW_SECRET_KEY = key;
    expect(m.flw.flutterwaveConfig().ok).toBe(false);
    delete process.env.FLW_MODE;
  });

  it("checks the webhook secret hash", () => {
    expect(m.flw.isValidWebhookSignature("test-hash")).toBe(true);
    expect(m.flw.isValidWebhookSignature("wrong")).toBe(false);
    expect(m.flw.isValidWebhookSignature(null)).toBe(false);
  });
});

describe("starting checkout", () => {
  it("creates a pending order at the catalogue price and a hosted payment link", async () => {
    const r = await m.checkout.startCheckout("Buyer@Example.com", PRODUCT);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.link).toContain("flutterwave.com");
    expect(r.order).toMatchObject({ status: "pending", email: "buyer@example.com", subtotal: expectedCents(), currency: "USD", providerFee: null });

    const body = JSON.parse(String(calls[0].init?.body));
    expect(calls[0].url).toBe("https://api.flutterwave.com/v3/payments");
    expect((calls[0].init?.headers as Record<string, string>).Authorization).toBe("Bearer FLWSECK_TEST-not-a-real-key-X");
    expect(body).toMatchObject({ tx_ref: r.order.reference, amount: (expectedCents() / 100).toFixed(2), currency: "USD", customer: { email: "buyer@example.com" } });
    expect(body.redirect_url).toMatch(/\/checkout\/complete$/);
  });

  it("refuses free, draft and unknown products", async () => {
    for (const id of ["student-reset", "exam-prep-system", "nope"]) {
      expect((await m.checkout.startCheckout("a@b.co", id)).ok).toBe(false);
    }
    expect(calls).toHaveLength(0);
  });

  it("won't take payment for a product whose file is missing", async () => {
    const r = await m.checkout.startCheckout("a@b.co", "grade-tgpa-tracker");
    expect(r).toMatchObject({ ok: false, status: 503 });
    expect(calls).toHaveLength(0);
  });

  it("marks the order failed when Flutterwave rejects the request", async () => {
    paymentsResponse = { status: 400, body: { status: "error", message: "Invalid currency" } };
    const r = await m.checkout.startCheckout("a@b.co", PRODUCT);
    expect(r).toMatchObject({ ok: false, status: 502 });
    const [order] = await m.store.orderStore().listByEmail("a@b.co");
    expect(order.status).toBe("failed");
  });
});

describe("confirming payment", () => {
  it("verifies server-side, records the charge, and delivers once", async () => {
    const order = await started();
    verifyResponse = tx(order);
    const r = await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "555001", redirectStatus: "successful" });
    expect(r.state).toBe("paid");
    if (r.state !== "paid") return;
    expect(r.delivered).toBe(true);
    expect(r.order).toMatchObject({ status: "paid", providerTransactionId: "555001", providerFee: 35, total: expectedCents() + 35 });
    expect(calls.at(-1)!.url).toBe("https://api.flutterwave.com/v3/transactions/555001/verify");
    expect(customerEmails()).toHaveLength(1);
  });

  it("is idempotent across duplicate redirects and webhooks", async () => {
    const order = await started();
    verifyResponse = tx(order);
    await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "555001" });
    const again = await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "555001" });
    const hook = await m.checkout.handleWebhook({ event: "charge.completed", data: { id: 555001, tx_ref: order.reference, status: "successful" } });
    expect(again.state).toBe("paid");
    expect(hook.state).toBe("paid");
    expect(customerEmails()).toHaveLength(1);
  });

  it("never trusts the redirect's status — only the verified transaction", async () => {
    const order = await started();
    verifyResponse = tx(order, { status: "failed" });
    const r = await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "555001", redirectStatus: "successful" });
    expect(r.state).toBe("failed");
    expect(customerEmails()).toHaveLength(0);
  });

  it("records a cancellation without calling the provider", async () => {
    const order = await started();
    calls.length = 0;
    const r = await m.checkout.confirmPayment({ txRef: order.reference, redirectStatus: "cancelled" });
    expect(r.state).toBe("cancelled");
    expect(calls).toHaveLength(0);
  });

  it("rejects a wrong amount", async () => {
    const order = await started();
    verifyResponse = tx(order, { amount: 0.5, charged_amount: 0.5 });
    const r = await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "555001" });
    expect(r.state).toBe("failed");
    expect((await m.store.orderStore().get(order.id))?.failureReason).toMatch(/amount/);
    expect(customerEmails()).toHaveLength(0);
  });

  it("rejects a wrong currency", async () => {
    const order = await started();
    verifyResponse = tx(order, { currency: "NGN" });
    expect((await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "555001" })).state).toBe("failed");
    expect(customerEmails()).toHaveLength(0);
  });

  it("ignores a transaction that belongs to another reference", async () => {
    const order = await started();
    verifyResponse = tx({ reference: "mura_someone_else" });
    const r = await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "555001" });
    expect(r.state).toBe("unverified");
    expect((await m.store.orderStore().get(order.id))?.status).toBe("pending");
  });

  it("returns not-found for an unknown reference", async () => {
    expect((await m.checkout.confirmPayment({ txRef: "mura_unknown", transactionId: "1" })).state).toBe("not-found");
    expect(calls).toHaveLength(0);
  });

  it("keeps the order pending while the provider is still processing", async () => {
    const order = await started();
    verifyResponse = tx(order, { status: "pending" });
    expect((await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "555001" })).state).toBe("pending");
  });

  it("reports unverified when Flutterwave can't be reached", async () => {
    const order = await started();
    verifyResponse = { status: 502, body: {} };
    expect((await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "555001" })).state).toBe("unverified");
    expect((await m.store.orderStore().get(order.id))?.status).toBe("pending");
  });

  it("accepts a later successful retry after a failed attempt", async () => {
    const order = await started();
    verifyResponse = tx(order, { status: "failed", id: 1 });
    await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "1" });
    verifyResponse = tx(order, { id: 2 });
    const r = await m.checkout.confirmPayment({ txRef: order.reference, transactionId: "2" });
    expect(r).toMatchObject({ state: "paid", delivered: true });
  });

  it("ignores webhook events that aren't charges", async () => {
    expect((await m.checkout.handleWebhook({ event: "transfer.completed", data: { id: 1, tx_ref: "x" } })).state).toBe("ignored");
    expect((await m.checkout.handleWebhook(null)).state).toBe("ignored");
  });
});
