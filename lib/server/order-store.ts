import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Order } from "@/lib/commerce/orders";
import { getStore } from "@netlify/blobs";
import { serverEnv } from "./env";
import { BlobOrderStore, type BlobStoreLike } from "./blob-order-store";

/**
 * Order storage behind a small interface so the backing store can change
 * (file → database) without touching checkout or delivery code.
 */
export interface OrderStore {
  create(order: Order): Promise<Order>;
  get(id: string): Promise<Order | undefined>;
  getByReference(reference: string): Promise<Order | undefined>;
  listByEmail(email: string): Promise<Order[]>;
  update(id: string, patch: (order: Order) => Order): Promise<Order>;
}

/**
 * File-backed store for a single Node server. Writes are serialised and atomic
 * (temp file + rename). Replace with a database-backed store before running more
 * than one server instance or on a platform without a persistent disk.
 */
export class FileOrderStore implements OrderStore {
  private queue: Promise<unknown> = Promise.resolve();
  constructor(private readonly file: string) {}

  private async readAll(): Promise<Order[]> {
    try {
      return JSON.parse(await fs.readFile(this.file, "utf8")) as Order[];
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw e;
    }
  }

  private async writeAll(orders: Order[]) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(orders, null, 2), { mode: 0o600 });
    await fs.rename(tmp, this.file);
  }

  /** Runs mutations one at a time so concurrent requests can't overwrite each other. */
  private serial<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.queue.then(fn, fn);
    this.queue = run.catch(() => undefined);
    return run;
  }

  create(order: Order) {
    return this.serial(async () => {
      const all = await this.readAll();
      if (all.some((o) => o.id === order.id || o.reference === order.reference)) throw new Error("Duplicate order");
      all.push(order);
      await this.writeAll(all);
      return order;
    });
  }

  async get(id: string) {
    return (await this.readAll()).find((o) => o.id === id);
  }

  async getByReference(reference: string) {
    return (await this.readAll()).find((o) => o.reference === reference);
  }

  async listByEmail(email: string) {
    const e = email.trim().toLowerCase();
    return (await this.readAll()).filter((o) => o.email === e);
  }

  update(id: string, patch: (order: Order) => Order) {
    return this.serial(async () => {
      const all = await this.readAll();
      const i = all.findIndex((o) => o.id === id);
      if (i === -1) throw new Error("Order not found");
      all[i] = patch(all[i]);
      await this.writeAll(all);
      return all[i];
    });
  }
}

let store: OrderStore | undefined;
export const orderStore = (): OrderStore =>
  (store ??=
    serverEnv.storage === "netlify-blobs"
      ? new BlobOrderStore(getStore({ name: "orders", consistency: "strong" }) as unknown as BlobStoreLike)
      : new FileOrderStore(path.join(serverEnv.dataDir, "orders.json")));

/** Test hook. */
export const setOrderStore = (s: OrderStore) => {
  store = s;
};
