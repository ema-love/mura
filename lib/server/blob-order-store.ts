import "server-only";
import { createHash } from "node:crypto";
import type { Order } from "@/lib/commerce/orders";
import type { OrderStore } from "./order-store";

/** The subset of a Netlify Blobs store this module needs — also easy to fake in tests. */
export interface BlobStoreLike {
  get(key: string, options: { type: "json"; consistency?: "strong" | "eventual" }): Promise<unknown>;
  getWithMetadata(key: string, options: { type: "json"; consistency?: "strong" | "eventual" }): Promise<{ data: unknown; etag?: string } | null>;
  setJSON(key: string, data: unknown, options?: { onlyIfNew?: boolean; onlyIfMatch?: string }): Promise<{ modified: boolean; etag?: string }>;
  list(options: { prefix: string }): Promise<{ blobs: { key: string }[] }>;
}

const emailKey = (email: string) => createHash("sha256").update(email.trim().toLowerCase()).digest("hex").slice(0, 32);
const strong = { type: "json" as const, consistency: "strong" as const };

/**
 * Orders on Netlify Blobs, for serverless hosting where there is no persistent disk.
 *
 *   order/<id>                 the order
 *   ref/<reference>            → { id }   (claimed with onlyIfNew, so references stay unique)
 *   email/<sha256>/<id>        index for "email me my downloads" (emails are hashed in keys)
 *
 * Updates use ETags (onlyIfMatch) and retry, so concurrent writes never silently overwrite.
 */
export class BlobOrderStore implements OrderStore {
  constructor(private readonly store: BlobStoreLike) {}

  async create(order: Order) {
    const ref = await this.store.setJSON(`ref/${order.reference}`, { id: order.id }, { onlyIfNew: true });
    if (!ref.modified) throw new Error("Duplicate order");
    const saved = await this.store.setJSON(`order/${order.id}`, order, { onlyIfNew: true });
    if (!saved.modified) throw new Error("Duplicate order");
    await this.store.setJSON(`email/${emailKey(order.email)}/${order.id}`, { id: order.id });
    return order;
  }

  async get(id: string) {
    return ((await this.store.get(`order/${id}`, strong)) as Order | null) ?? undefined;
  }

  async getByReference(reference: string) {
    const ref = (await this.store.get(`ref/${reference}`, strong)) as { id: string } | null;
    return ref ? this.get(ref.id) : undefined;
  }

  async listByEmail(email: string) {
    const { blobs } = await this.store.list({ prefix: `email/${emailKey(email)}/` });
    const orders = await Promise.all(blobs.map((b) => this.get(b.key.split("/").pop()!)));
    return orders.filter((o): o is Order => !!o);
  }

  async update(id: string, patch: (order: Order) => Order) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const current = await this.store.getWithMetadata(`order/${id}`, strong);
      if (!current?.data) throw new Error("Order not found");
      const next = patch(current.data as Order);
      const result = await this.store.setJSON(`order/${id}`, next, { onlyIfMatch: current.etag });
      if (result.modified) return next;
    }
    throw new Error("Order update conflicted repeatedly");
  }
}
