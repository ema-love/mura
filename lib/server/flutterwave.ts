import "server-only";
import { timingSafeEqual, createHash } from "node:crypto";

/**
 * Flutterwave v3 (Standard / hosted checkout).
 *
 * Keys come from the environment only:
 *   FLW_SECRET_KEY   FLWSECK_TEST-… in test mode, FLWSECK-… in live mode
 *   FLW_SECRET_HASH  the "Secret hash" set on the Flutterwave webhook settings page
 *   FLW_MODE         "test" (default) or "live". Live keys are refused unless this
 *                    is explicitly "live", and test keys are refused in live mode, so
 *                    a key pasted into the wrong place can never charge real cards.
 *
 * Payment charges are never computed here. When the account is set so the customer
 * pays the charge, Flutterwave adds it on its payment page and reports it back in
 * `charged_amount`, which is what we record.
 */

const API = "https://api.flutterwave.com/v3";

export type FlutterwaveMode = "test" | "live";

export class FlutterwaveError extends Error {
  constructor(
    message: string,
    readonly code: "not-configured" | "request-failed" | "rejected",
  ) {
    super(message);
  }
}

export function flutterwaveConfig() {
  const mode: FlutterwaveMode = process.env.FLW_MODE === "live" ? "live" : "test";
  const secretKey = process.env.FLW_SECRET_KEY?.trim();
  const secretHash = process.env.FLW_SECRET_HASH?.trim() || undefined;
  if (!secretKey) return { ok: false as const, mode, reason: "FLW_SECRET_KEY is not set" };
  const isTestKey = secretKey.startsWith("FLWSECK_TEST");
  if (mode === "test" && !isTestKey) return { ok: false as const, mode, reason: "FLW_MODE is test but FLW_SECRET_KEY is not a test key" };
  if (mode === "live" && isTestKey) return { ok: false as const, mode, reason: "FLW_MODE is live but FLW_SECRET_KEY is a test key" };
  return { ok: true as const, mode, secretKey, secretHash };
}

export const flutterwaveConfigured = () => flutterwaveConfig().ok;

function secretKey() {
  const config = flutterwaveConfig();
  if (!config.ok) throw new FlutterwaveError(config.reason, "not-configured");
  return config.secretKey;
}

async function call<T>(path: string, init: { method: "GET" | "POST"; body?: unknown }): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: init.method,
      headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json", Accept: "application/json" },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
  } catch (e) {
    if (e instanceof FlutterwaveError) throw e;
    throw new FlutterwaveError(`Flutterwave unreachable: ${(e as Error).message}`, "request-failed");
  }
  const json = (await res.json().catch(() => null)) as { status?: string; message?: string; data?: unknown } | null;
  if (!res.ok || json?.status !== "success") {
    const code = res.status >= 500 || !json ? "request-failed" : "rejected";
    throw new FlutterwaveError(`Flutterwave ${path.split("?")[0]} → ${res.status}: ${json?.message ?? "no message"}`, code);
  }
  return json.data as T;
}

export type PaymentRequest = {
  txRef: string;
  /** Minor units (cents). */
  amount: number;
  currency: string;
  email: string;
  redirectUrl: string;
  title: string;
  description: string;
  meta: Record<string, string>;
};

/** Creates a hosted payment link. The customer is redirected there to pay. */
export async function createPaymentLink(req: PaymentRequest): Promise<string> {
  const data = await call<{ link?: string }>("/payments", {
    method: "POST",
    body: {
      tx_ref: req.txRef,
      amount: (req.amount / 100).toFixed(2),
      currency: req.currency,
      redirect_url: req.redirectUrl,
      customer: { email: req.email },
      customizations: { title: req.title, description: req.description },
      meta: req.meta,
    },
  });
  if (!data?.link) throw new FlutterwaveError("Flutterwave returned no payment link", "request-failed");
  return data.link;
}

/** The fields of a verified transaction that MÚRÀ relies on. */
export type FlutterwaveTransaction = {
  id: number;
  tx_ref: string;
  status: string;
  currency: string;
  /** Amount requested, in major units. */
  amount: number;
  /** Amount actually charged, including any payment charge the customer paid. */
  charged_amount?: number;
  app_fee?: number;
  customer?: { email?: string };
};

/** Server-side verification by Flutterwave transaction id. */
export const verifyTransaction = (id: string | number) =>
  call<FlutterwaveTransaction>(`/transactions/${encodeURIComponent(String(id))}/verify`, { method: "GET" });

/** Server-side verification by our own reference, when no transaction id is available. */
export const verifyByReference = (txRef: string) =>
  call<FlutterwaveTransaction>(`/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`, { method: "GET" });

/** Webhooks carry the secret hash in the `verif-hash` header. Constant-time compare. */
export function isValidWebhookSignature(header: string | null) {
  const config = flutterwaveConfig();
  if (!config.ok || !config.secretHash || !header) return false;
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(header), digest(config.secretHash));
}
