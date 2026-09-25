import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { serverEnv } from "./env";

/**
 * Signed download tokens: `<payload>.<signature>`, HMAC-SHA256, base64url.
 * They name one order, one product and an expiry — nothing else, and no file paths.
 */
export type DownloadClaim = { orderId: string; productId: string; expiresAt: number };

const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function createDownloadToken(orderId: string, productId: string, now = Date.now(), secret = serverEnv.downloadSecret()) {
  const claim: DownloadClaim = { orderId, productId, expiresAt: now + serverEnv.downloadTtlDays * 86_400_000 };
  const payload = Buffer.from(JSON.stringify([claim.orderId, claim.productId, claim.expiresAt])).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export type VerifyResult = { ok: true; claim: DownloadClaim } | { ok: false; reason: "malformed" | "invalid" | "expired" };

export function verifyDownloadToken(token: string, now = Date.now(), secret = serverEnv.downloadSecret()): VerifyResult {
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, reason: "malformed" };
  const [payload, signature] = parts;
  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: "invalid" };
  try {
    const [orderId, productId, expiresAt] = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof orderId !== "string" || typeof productId !== "string" || typeof expiresAt !== "number") return { ok: false, reason: "malformed" };
    if (now > expiresAt) return { ok: false, reason: "expired" };
    return { ok: true, claim: { orderId, productId, expiresAt } };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}
