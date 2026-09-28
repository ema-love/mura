import "server-only";
import nodemailer from "nodemailer";
import { brand } from "@/lib/brand";
import { paymentsEnabled } from "@/lib/commerce/config";
import { serverEnv, smtpConfigured } from "./env";
import { flutterwaveConfig } from "./flutterwave";
import { sendEmail } from "./email";

/**
 * Plain-language checks of the live configuration, for the owner's admin page.
 * Reports what is wrong and how to fix it — never a secret value.
 */
export type Check = { name: string; ok: boolean; detail: string };

const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(Object.assign(new Error("Timed out"), { code: "ETIMEDOUT" })), ms))]);

async function emailCheck(): Promise<Check> {
  const name = "Email (Gmail)";
  const s = serverEnv.smtp;
  const missing = [!s.user && "SMTP_USER", !s.pass && "SMTP_PASS", !s.host && "SMTP_HOST", !serverEnv.emailFrom && "EMAIL_FROM"].filter(Boolean);
  if (!smtpConfigured()) {
    return { name, ok: false, detail: `Not set up: add ${missing.join(", ")} in Netlify, then redeploy. SMTP_USER is the Gmail address; SMTP_PASS is a Gmail App Password.` };
  }
  try {
    const transport = nodemailer.createTransport({
      host: s.host,
      port: s.port,
      secure: s.secure,
      auth: { user: s.user, pass: s.pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
    });
    await withTimeout(transport.verify(), 15_000);
    return { name, ok: true, detail: `Signed in to ${s.host} as ${s.user}.` };
  } catch (e) {
    const err = e as Error & { code?: string; responseCode?: number };
    if (err.code === "EAUTH") {
      return {
        name,
        ok: false,
        detail: `Gmail rejected the login for ${s.user}. SMTP_PASS must be a Gmail App Password (Google Account → Security → 2-Step Verification on → App passwords), not the normal password. Update it in Netlify and redeploy.`,
      };
    }
    if (err.code === "ETIMEDOUT" || err.code === "ECONNECTION" || err.code === "ESOCKET") {
      return {
        name,
        ok: false,
        detail: `Couldn't connect to ${s.host}:${s.port} (${err.code}). For Gmail, delete SMTP_HOST, SMTP_PORT and SMTP_SECURE in Netlify (the defaults are correct), or set them to smtp.gmail.com, 465, true.`,
      };
    }
    return { name, ok: false, detail: `Email failed: ${err.code ?? ""} ${err.message}`.trim() };
  }
}

async function flutterwaveCheck(): Promise<Check[]> {
  const out: Check[] = [];
  out.push(
    paymentsEnabled
      ? { name: "Checkout switched on", ok: true, detail: "NEXT_PUBLIC_PAYMENTS_ENABLED is true." }
      : { name: "Checkout switched on", ok: false, detail: 'Set NEXT_PUBLIC_PAYMENTS_ENABLED to exactly "true" (not secret) in Netlify, then redeploy.' },
  );
  const config = flutterwaveConfig();
  if (!config.ok) {
    out.push({
      name: "Flutterwave key",
      ok: false,
      detail: `${config.reason}. FLW_SECRET_KEY must be the Secret key starting FLWSECK_TEST- and FLW_MODE must be "test". Fix in Netlify, then redeploy.`,
    });
    return out;
  }
  try {
    const res = await fetch("https://api.flutterwave.com/v3/balances", {
      headers: { Authorization: `Bearer ${config.secretKey}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const json = (await res.json().catch(() => null)) as { message?: string } | null;
    out.push(
      res.ok
        ? { name: "Flutterwave key", ok: true, detail: `Flutterwave accepted the ${config.mode} key.` }
        : { name: "Flutterwave key", ok: false, detail: `Flutterwave rejected the key (${res.status}: ${json?.message ?? "no message"}). Copy the Secret key again into FLW_SECRET_KEY and redeploy.` },
    );
  } catch (e) {
    out.push({ name: "Flutterwave key", ok: false, detail: `Couldn't reach Flutterwave: ${(e as Error).message}` });
  }
  out.push(
    config.secretHash
      ? { name: "Flutterwave webhook secret", ok: true, detail: "FLW_SECRET_HASH is set." }
      : { name: "Flutterwave webhook secret", ok: false, detail: "Add FLW_SECRET_HASH (the same phrase as in Flutterwave → Settings → Webhooks)." },
  );
  return out;
}

export async function runHealthChecks(): Promise<Check[]> {
  const downloadSecret = !!process.env.DOWNLOAD_TOKEN_SECRET;
  const site = brand.url;
  const [email, payments] = await Promise.all([emailCheck(), flutterwaveCheck()]);
  return [
    email,
    downloadSecret
      ? { name: "Download links", ok: true, detail: "DOWNLOAD_TOKEN_SECRET is set." }
      : { name: "Download links", ok: false, detail: "Add DOWNLOAD_TOKEN_SECRET (a long random value, secret) in Netlify, then redeploy." },
    site.startsWith("https://")
      ? { name: "Site address", ok: true, detail: `Links in emails point to ${site}.` }
      : { name: "Site address", ok: false, detail: `Links in emails point to ${site}. Set NEXT_PUBLIC_SITE_URL to https://mura-digitals.netlify.app and redeploy.` },
    serverEnv.storage === "netlify-blobs"
      ? { name: "File storage", ok: true, detail: "Using Netlify Blobs." }
      : { name: "File storage", ok: false, detail: "Not using Netlify Blobs — remove MURA_STORAGE from Netlify if it is set." },
    ...payments,
  ];
}

/** Sends a real test email to the company inbox. */
export async function sendTestEmail(): Promise<Check> {
  const to = serverEnv.inboxEmail;
  const sent = await sendEmail({
    to,
    subject: `${brand.asciiName} test email`,
    text: "This is a test from your website's admin page. If you can read this, customer emails work.",
    html: "<p>This is a test from your website's admin page. If you can read this, customer emails work.</p>",
  });
  return sent.ok
    ? { name: "Test email", ok: true, detail: `Sent to ${to}. Check that inbox (and spam).` }
    : { name: "Test email", ok: false, detail: `Not sent: ${sent.error}. See the Email check above.` };
}
