import "server-only";
import { brand } from "@/lib/brand";

/**
 * Server-side configuration. Secrets are read here and nowhere else, and never
 * use the NEXT_PUBLIC_ prefix, so they cannot reach the browser bundle.
 */
const isProd = process.env.NODE_ENV === "production";

function required(name: string, devFallback?: string) {
  const value = process.env[name];
  if (value) return value;
  if (!isProd && devFallback !== undefined) return devFallback;
  throw new Error(`Missing required environment variable ${name}`);
}

/**
 * Where orders and product files live:
 * - "netlify-blobs" on Netlify (serverless, no persistent disk) — detected automatically
 * - "file" for local development or a Node server with a persistent disk
 */
const storage: "netlify-blobs" | "file" =
  process.env.MURA_STORAGE === "netlify-blobs" || process.env.MURA_STORAGE === "file"
    ? process.env.MURA_STORAGE
    : process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT
      ? "netlify-blobs"
      : "file";

const smtpUser = process.env.SMTP_USER?.trim() || undefined;
const isGmail = !!smtpUser && /@(gmail|googlemail)\.com$/i.test(smtpUser);

export const serverEnv = {
  isProd,
  storage,
  /** Where orders are stored by the file-based store. */
  dataDir: process.env.MURA_DATA_DIR ?? ".data",
  /** Private directory holding product files. Must not be inside /public. */
  productFilesDir: process.env.PRODUCT_FILES_DIR ?? "private/products",
  /** Signs download links. Long random string in production. */
  downloadSecret: () => required("DOWNLOAD_TOKEN_SECRET", "dev-only-download-secret-change-me"),
  /** How long an emailed download link stays valid. */
  downloadTtlDays: Number(process.env.DOWNLOAD_LINK_TTL_DAYS ?? 7),
  /** Downloads allowed per item per order, to discourage link sharing. */
  maxDownloadsPerItem: Number(process.env.MAX_DOWNLOADS_PER_ITEM ?? 20),
  smtp: {
    // A Gmail address needs no host/port settings: Gmail's are the defaults.
    host: process.env.SMTP_HOST?.trim() || (isGmail ? "smtp.gmail.com" : undefined),
    port: Number(process.env.SMTP_PORT || 465),
    secure: (process.env.SMTP_SECURE?.trim() || "true") === "true",
    user: smtpUser,
    // Google shows app passwords in groups ("abcd efgh ijkl mnop"); the spaces aren't part of it.
    pass: isGmail ? process.env.SMTP_PASS?.replace(/\s+/g, "") : process.env.SMTP_PASS,
  },
  /** Sender shown to customers, e.g. "MÚRÀ <hello@example.com>". Defaults to the SMTP account. */
  emailFrom: process.env.EMAIL_FROM?.trim() || (smtpUser ? `${brand.name} <${smtpUser}>` : undefined),
  /** Password for the owner's upload page (/admin). Unset = page disabled. */
  adminPassword: process.env.MURA_ADMIN_PASSWORD?.trim() || undefined,
  /** Company inbox for contact messages and order notifications. */
  inboxEmail: process.env.MURA_INBOX_EMAIL || brand.contactEmail,
};

export const smtpConfigured = () => !!(serverEnv.smtp.host && serverEnv.smtp.user && serverEnv.smtp.pass && serverEnv.emailFrom);
