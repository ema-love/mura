#!/usr/bin/env node
/**
 * Set up everything a customer receives for one product, in one go:
 * downloadable files and Google "Make a copy" links. Customers pick on their
 * download page.
 *
 *   NETLIFY_SITE_ID=… NETLIFY_AUTH_TOKEN=… npm run set-template -- student-reset \
 *     --pdf ./Student-Reset.pdf \
 *     --excel ./Student-Reset.xlsx \
 *     --docs "https://docs.google.com/document/d/…/edit?usp=sharing" \
 *     --sheets "https://docs.google.com/spreadsheets/d/…/edit?usp=sharing"
 *
 * Options (use any; at least one):
 *   --docs <link>    Google Docs share link   (turned into a "make a copy" link)
 *   --sheets <link>  Google Sheets share link (turned into a "make a copy" link)
 *   --excel <file>   .xlsx       --word <file>  .docx       --pdf <file>  .pdf
 *   --local          write to the local private folder instead of Netlify
 *
 * Share each Google file as "Anyone with the link → Viewer" first. Running the
 * command again replaces the product's previous set.
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";

const args = process.argv.slice(2);
const productId = args.shift();
const opts = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--local") opts.local = true;
  else if (a.startsWith("--")) opts[a.slice(2)] = args[++i];
}

const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

if (!productId || productId.startsWith("--") || !/^[a-z0-9-]+$/.test(productId)) {
  fail("Usage: npm run set-template -- <product-id> [--docs <link>] [--sheets <link>] [--excel <file>] [--word <file>] [--pdf <file>] [--local]");
}
const known = new Set(["docs", "sheets", "excel", "word", "pdf", "local"]);
for (const k of Object.keys(opts)) if (!known.has(k)) fail(`Unknown option --${k}`);

/** Any Google Docs/Sheets link → its "make a copy" form. */
function copyLink(url, kind) {
  let u;
  try {
    u = new URL(url);
  } catch {
    fail(`--${kind} is not a link: ${url}`);
  }
  const match = u.pathname.match(/^\/(document|spreadsheets)\/d\/([^/]+)/);
  if (u.hostname !== "docs.google.com" || !match) fail(`--${kind} must be a docs.google.com document or spreadsheet link`);
  if ((kind === "docs") !== (match[1] === "document")) fail(`--${kind} looks like the wrong kind of Google file`);
  return `https://docs.google.com/${match[1]}/d/${match[2]}/copy`;
}

const files = [
  ["pdf", "PDF", ".pdf", "application/pdf"],
  ["excel", "Excel", ".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ["word", "Word", ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
];

const items = [];
if (opts.docs) items.push({ kind: "link", label: "Google Docs", url: copyLink(opts.docs, "docs") });
if (opts.sheets) items.push({ kind: "link", label: "Google Sheets", url: copyLink(opts.sheets, "sheets") });
const uploads = [];
for (const [flag, label, ext, contentType] of files) {
  if (!opts[flag]) continue;
  if (path.extname(opts[flag]).toLowerCase() !== ext) fail(`--${flag} expects a ${ext} file, got ${opts[flag]}`);
  const key = `${productId}/mura-${productId}${ext}`;
  uploads.push({ key, source: opts[flag], contentType });
  items.push({ kind: "file", label, key });
}
if (!items.length) fail("Nothing to set: add at least one of --docs, --sheets, --excel, --word, --pdf");

const manifest = Buffer.from(JSON.stringify({ items }, null, 2));

if (opts.local) {
  const base = path.resolve(process.env.PRODUCT_FILES_DIR ?? "private/products");
  await mkdir(path.join(base, productId), { recursive: true });
  for (const u of uploads) await writeFile(path.join(base, u.key), await readFile(u.source));
  await writeFile(path.join(base, productId, "delivery.json"), manifest);
} else {
  const { NETLIFY_SITE_ID: siteID, NETLIFY_AUTH_TOKEN: token } = process.env;
  if (!siteID || !token) fail("Set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN (or use --local).");
  const store = getStore({ name: "product-files", siteID, token });
  for (const u of uploads) {
    const { size } = await stat(u.source);
    await store.set(u.key, await readFile(u.source), { metadata: { size, fileName: path.basename(u.key), contentType: u.contentType } });
  }
  await store.set(`${productId}/delivery.json`, manifest, {
    metadata: { size: manifest.length, fileName: "delivery.json", contentType: "application/json" },
  });
}

console.log(`${productId}: customers can now choose from`);
for (const i of items) console.log(`  • ${i.kind === "link" ? `Make a copy in ${i.label}` : `Download ${i.label}`}`);
