import { describe, expect, it } from "vitest";
import { BlobOrderStore, type BlobStoreLike } from "@/lib/server/blob-order-store";
import type { Order } from "@/lib/commerce/orders";

/** In-memory stand-in for a Netlify Blobs store, with ETags and conditional writes. */
class FakeBlobs implements BlobStoreLike {
  data = new Map<string, { value: unknown; etag: string }>();
  n = 0;
  /** Simulate another writer landing between our read and write, this many times. */
  interleave = 0;
  async get(key: string) {
    return structuredClone(this.data.get(key)?.value ?? null);
  }
  async getWithMetadata(key: string) {
    const e = this.data.get(key);
    const result = e ? { data: structuredClone(e.value), etag: e.etag } : null;
    if (e && this.interleave > 0) {
      this.interleave--;
      this.data.set(key, { value: e.value, etag: `e${++this.n}` });
    }
    return result;
  }
  async setJSON(key: string, value: unknown, opts: { onlyIfNew?: boolean; onlyIfMatch?: string } = {}) {
    const e = this.data.get(key);
    if (opts.onlyIfNew && e) return { modified: false };
    if (opts.onlyIfMatch && e?.etag !== opts.onlyIfMatch) return { modified: false };
    const etag = `e${++this.n}`;
    this.data.set(key, { value: structuredClone(value), etag });
    return { modified: true, etag };
  }
  async list({ prefix }: { prefix: string }) {
    return { blobs: [...this.data.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) };
  }
}

const order = (id: string, email = "A@Example.com"): Order => ({
  id,
  email: email.toLowerCase(),
  items: [{ productId: "student-reset", productName: "Mura Student Reset", unitAmount: 0, quantity: 1 }],
  currency: "USD",
  subtotal: 0,
  providerFee: null,
  total: 0,
  status: "free",
  provider: "none",
  reference: `ref_${id}`,
  createdAt: new Date().toISOString(),
});

describe("BlobOrderStore", () => {
  it("creates, reads and finds orders by reference and email", async () => {
    const store = new BlobOrderStore(new FakeBlobs());
    await store.create(order("o1"));
    await store.create(order("o2"));
    await store.create(order("o3", "other@example.com"));
    expect((await store.get("o1"))?.id).toBe("o1");
    expect((await store.getByReference("ref_o2"))?.id).toBe("o2");
    expect((await store.listByEmail(" a@example.com ")).map((o) => o.id).sort()).toEqual(["o1", "o2"]);
    expect(await store.get("missing")).toBeUndefined();
  });

  it("rejects duplicate references", async () => {
    const store = new BlobOrderStore(new FakeBlobs());
    await store.create(order("o1"));
    await expect(store.create({ ...order("o2"), reference: "ref_o1" })).rejects.toThrow("Duplicate");
  });

  it("never stores raw email addresses in keys", async () => {
    const blobs = new FakeBlobs();
    await new BlobOrderStore(blobs).create(order("o1", "someone@example.com"));
    expect([...blobs.data.keys()].some((k) => k.includes("someone"))).toBe(false);
  });

  it("retries updates on conflicting writes instead of overwriting", async () => {
    const blobs = new FakeBlobs();
    const store = new BlobOrderStore(blobs);
    await store.create(order("o1"));
    blobs.interleave = 2;
    const updated = await store.update("o1", (o) => ({ ...o, fulfilment: { downloads: (o.fulfilment?.downloads ?? 0) + 1 } }));
    expect(updated.fulfilment?.downloads).toBe(1);
    expect((await store.get("o1"))?.fulfilment?.downloads).toBe(1);
  });
});
