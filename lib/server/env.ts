import "server-only";

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

export const serverEnv = {
  isProd,
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
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: (process.env.SMTP_SECURE ?? "true") === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  /** Sender shown to customers, e.g. "MÚRÀ <hello@example.com>". */
  emailFrom: process.env.EMAIL_FROM,
  /** Company inbox for contact messages and order notifications. */
  inboxEmail: process.env.MURA_INBOX_EMAIL,
};

export const smtpConfigured = () => !!(serverEnv.smtp.host && serverEnv.smtp.user && serverEnv.smtp.pass && serverEnv.emailFrom);
