import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import nodemailer, { type Transporter } from "nodemailer";
import { serverEnv, smtpConfigured } from "./env";

export type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendResult = { ok: true; via: "smtp" | "outbox" } | { ok: false; error: string };

let transport: Transporter | undefined;
const getTransport = () =>
  (transport ??= nodemailer.createTransport({
    host: serverEnv.smtp.host,
    port: serverEnv.smtp.port,
    secure: serverEnv.smtp.secure,
    auth: { user: serverEnv.smtp.user, pass: serverEnv.smtp.pass },
  }));

/**
 * Sends one email. With SMTP configured it sends for real (Gmail works with an
 * app password). Without it, development writes to .data/outbox so flows can be
 * tested; production refuses, so the site never claims an email was sent when it wasn't.
 */
export async function sendEmail(email: Email): Promise<SendResult> {
  if (smtpConfigured()) {
    try {
      await getTransport().sendMail({ from: serverEnv.emailFrom, ...email });
      return { ok: true, via: "smtp" };
    } catch (e) {
      const err = e as Error & { code?: string; responseCode?: number };
      console.error(`[email] SMTP send failed (${err.code ?? "error"}${err.responseCode ? ` ${err.responseCode}` : ""}):`, err.message);
      if (err.code === "EAUTH") console.error("[email] The SMTP login was rejected. For Gmail, SMTP_PASS must be an App Password, not the normal password.");
      return { ok: false, error: "Email could not be sent" };
    }
  }
  if (serverEnv.isProd) {
    const missing = [!serverEnv.smtp.host && "SMTP_HOST", !serverEnv.smtp.user && "SMTP_USER", !serverEnv.smtp.pass && "SMTP_PASS", !serverEnv.emailFrom && "EMAIL_FROM"].filter(Boolean);
    console.error(`[email] Email is not set up (missing ${missing.join(", ")}); refusing to pretend an email was sent.`);
    return { ok: false, error: "Email is not configured" };
  }
  const dir = path.join(serverEnv.dataDir, "outbox");
  await fs.mkdir(dir, { recursive: true });
  const base = `${Date.now()}-${email.to.replace(/[^a-z0-9@.]/gi, "_")}`;
  await fs.writeFile(path.join(dir, `${base}.json`), JSON.stringify(email, null, 2));
  await fs.writeFile(path.join(dir, `${base}.html`), email.html);
  console.info(`[email] (dev outbox) "${email.subject}" → ${email.to}`);
  return { ok: true, via: "outbox" };
}

export const inboxConfigured = () => !!serverEnv.inboxEmail;
