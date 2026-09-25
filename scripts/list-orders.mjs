#!/usr/bin/env node
/**
 * List recent MÚRÀ orders from Netlify Blobs (read-only).
 *
 *   NETLIFY_SITE_ID=... NETLIFY_AUTH_TOKEN=... node scripts/list-orders.mjs
 */
import { getStore } from "@netlify/blobs";

const { NETLIFY_SITE_ID: siteID, NETLIFY_AUTH_TOKEN: token } = process.env;
if (!siteID || !token) {
  console.error("Set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN.");
  process.exit(1);
}
const store = getStore({ name: "orders", siteID, token });
const { blobs } = await store.list({ prefix: "order/" });
const orders = (await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })))).filter(Boolean);
orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
for (const o of orders) {
  const total = o.total === 0 ? "free" : `${(o.total / 100).toFixed(2)} ${o.currency}`;
  console.log(`${o.createdAt.slice(0, 16)}  ${o.status.padEnd(9)} ${total.padEnd(12)} ${o.email.padEnd(32)} ${o.items.map((i) => i.productName).join(", ")}`);
}
console.log(`\n${orders.length} order(s)`);
