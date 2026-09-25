#!/usr/bin/env node
/**
 * Upload a product file to MÚRÀ's private Netlify Blobs store.
 *
 *   NETLIFY_SITE_ID=... NETLIFY_AUTH_TOKEN=... \
 *   node scripts/upload-product-file.mjs student-reset/mura-student-reset.pdf ./files/mura-student-reset.pdf
 *
 * The first argument must match the product's `fileKey` in lib/catalog/products.ts.
 * Site ID: Netlify → Site configuration → General. Token: Netlify → User settings →
 * Applications → Personal access tokens. Files are private; nothing becomes public.
 */
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { getStore } from "@netlify/blobs";

const [fileKey, filePath] = process.argv.slice(2);
const { NETLIFY_SITE_ID: siteID, NETLIFY_AUTH_TOKEN: token } = process.env;

if (!fileKey || !filePath || !siteID || !token) {
  console.error("Usage: NETLIFY_SITE_ID=… NETLIFY_AUTH_TOKEN=… node scripts/upload-product-file.mjs <fileKey> <path-to-file>");
  process.exit(1);
}
if (fileKey.split("/").some((p) => p === ".." || p === "") || path.isAbsolute(fileKey)) {
  console.error("fileKey must be a relative path like student-reset/mura-student-reset.pdf");
  process.exit(1);
}

const types = { ".pdf": "application/pdf", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".zip": "application/zip" };
const data = await readFile(filePath);
const { size } = await stat(filePath);
const fileName = path.basename(fileKey);
const store = getStore({ name: "product-files", siteID, token });
await store.set(fileKey, data, { metadata: { size, fileName, contentType: types[path.extname(fileName).toLowerCase()] ?? "application/octet-stream" } });
console.log(`Uploaded ${filePath} → product-files/${fileKey} (${(size / 1024).toFixed(1)} KB)`);
