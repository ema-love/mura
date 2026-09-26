import "server-only";
import type { Product } from "@/lib/catalog/types";
import { isSafeFileKey, openProductFile, productFileExists } from "./files";

/**
 * What a customer receives for one product. Either a single file (the product's
 * `fileKey`), or a delivery list uploaded with `npm run set-template`, stored
 * privately next to the files as `<product id>/delivery.json`:
 *
 *   { "items": [
 *     { "kind": "link", "label": "Google Docs", "url": "https://docs.google.com/document/d/…/copy" },
 *     { "kind": "file", "label": "PDF", "key": "student-reset/mura-student-reset.pdf" } ] }
 *
 * "Make a copy" links live here — not in the code — so they're only ever shown
 * behind a valid download link.
 */
export type DeliveryItem = { kind: "file"; label: string; key: string } | { kind: "link"; label: string; url: string };

export const manifestKey = (productId: string) => `${productId}/delivery.json`;

const GOOGLE_HOSTS = ["docs.google.com", "drive.google.com"];

function isAllowedLink(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && GOOGLE_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

/** Parses and validates a delivery list. Anything unexpected is dropped, never trusted. */
export function parseManifest(productId: string, raw: unknown): DeliveryItem[] {
  const items = (raw as { items?: unknown })?.items;
  if (!Array.isArray(items)) return [];
  const out: DeliveryItem[] = [];
  for (const item of items as Record<string, unknown>[]) {
    const label = typeof item?.label === "string" ? item.label.slice(0, 40) : "";
    if (!label) continue;
    if (item.kind === "file" && typeof item.key === "string" && isSafeFileKey(item.key) && item.key.startsWith(`${productId}/`) && item.key !== manifestKey(productId)) {
      out.push({ kind: "file", label, key: item.key });
    } else if (item.kind === "link" && typeof item.url === "string" && isAllowedLink(item.url)) {
      out.push({ kind: "link", label, url: item.url });
    }
  }
  return out;
}

async function readManifest(productId: string): Promise<DeliveryItem[] | null> {
  const file = await openProductFile(manifestKey(productId));
  if (!file) return null;
  try {
    return parseManifest(productId, JSON.parse(await new Response(file.stream).text()));
  } catch (e) {
    console.error(`[delivery] unreadable delivery list for ${productId}`, e);
    return [];
  }
}

/** Everything the customer can choose from for this product, in display order. */
export async function deliveryFor(product: Product): Promise<DeliveryItem[]> {
  const manifest = await readManifest(product.id);
  if (manifest) return manifest;
  return product.fileKey ? [{ kind: "file", label: product.formats.join(" · ") || "Download", key: product.fileKey }] : [];
}

/** Ready to deliver: at least one option, and every listed file actually uploaded. */
export async function isReady(product: Product) {
  const items = await deliveryFor(product);
  if (!items.length) return false;
  for (const item of items) if (item.kind === "file" && !(await productFileExists(item.key))) return false;
  return true;
}
