import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readdirSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const root = mkdtempSync(path.join(tmpdir(), "mura-"));
const dataDir = path.join(root, "data");
const filesDir = path.join(root, "files");

type Mods = {
  tokens: typeof import("@/lib/server/tokens");
  files: typeof import("@/lib/server/files");
  store: typeof import("@/lib/server/order-store");
  claim: typeof import("@/lib/server/claim");
  downloads: typeof import("@/lib/server/downloads");
  delivery: typeof import("@/lib/server/delivery");
};
let m: Mods;

beforeAll(async () => {
  process.env.MURA_DATA_DIR = dataDir;
  process.env.PRODUCT_FILES_DIR = filesDir;
  process.env.DOWNLOAD_TOKEN_SECRET = "test-secret";
  process.env.MAX_DOWNLOADS_PER_ITEM = "3";
  delete process.env.SMTP_HOST;
  mkdirSync(path.join(filesDir, "student-reset"), { recursive: true });
  writeFileSync(path.join(filesDir, "student-reset/mura-student-reset.pdf"), "%PDF-1.4 test");
  vi.resetModules();
  m = {
    tokens: await import("@/lib/server/tokens"),
    files: await import("@/lib/server/files"),
    store: await import("@/lib/server/order-store"),
    claim: await import("@/lib/server/claim"),
    downloads: await import("@/lib/server/downloads"),
    delivery: await import("@/lib/server/delivery"),
  };
});

afterAll(() => rmSync(root, { recursive: true, force: true }));

beforeEach(() => {
  rmSync(dataDir, { recursive: true, force: true });
});

/** Customer-facing emails only (company-inbox notifications are sent too, best effort). */
const outbox = () => {
  try {
    return readdirSync(path.join(dataDir, "outbox"))
      .filter((f) => f.endsWith(".json"))
      .filter((f) => !f.includes("mura.creates@gmail.com"));
  } catch {
    return [];
  }
};

describe("download tokens", () => {
  it("round-trips a valid token", () => {
    const t = m.tokens.createDownloadToken("ord_1", "student-reset");
    const r = m.tokens.verifyDownloadToken(t);
    expect(r.ok && r.claim).toMatchObject({ orderId: "ord_1", productId: "student-reset" });
  });

  it("rejects a tampered payload or signature", () => {
    const [payload, sig] = m.tokens.createDownloadToken("ord_1", "student-reset").split(".");
    const forged = Buffer.from(JSON.stringify(["ord_1", "semester-system", Date.now() + 1e9])).toString("base64url");
    expect(m.tokens.verifyDownloadToken(`${forged}.${sig}`)).toEqual({ ok: false, reason: "invalid" });
    expect(m.tokens.verifyDownloadToken(`${payload}.${sig.slice(0, -2)}xx`)).toEqual({ ok: false, reason: "invalid" });
  });

  it("rejects expired and malformed tokens", () => {
    const old = m.tokens.createDownloadToken("ord_1", "p", Date.now() - 30 * 86_400_000);
    expect(m.tokens.verifyDownloadToken(old)).toEqual({ ok: false, reason: "expired" });
    expect(m.tokens.verifyDownloadToken("nonsense")).toEqual({ ok: false, reason: "malformed" });
  });

  it("rejects tokens signed with another secret", () => {
    const t = m.tokens.createDownloadToken("ord_1", "p", Date.now(), "other-secret");
    expect(m.tokens.verifyDownloadToken(t)).toEqual({ ok: false, reason: "invalid" });
  });
});

describe("private files", () => {
  it("never resolves outside the files directory", () => {
    expect(m.files.resolveFileKey("../secrets.txt")).toBeNull();
    expect(m.files.resolveFileKey("student-reset/../../etc/passwd")).toBeNull();
    expect(m.files.resolveFileKey("/etc/passwd")).toBeNull();
    expect(m.files.resolveFileKey("a\0b")).toBeNull();
    expect(m.files.resolveFileKey("student-reset/mura-student-reset.pdf")).toBe(path.join(filesDir, "student-reset/mura-student-reset.pdf"));
  });
});

describe("free claim and delivery", () => {
  it("creates one free order and emails a working link", async () => {
    const r = await m.claim.claimFreeProduct("Student@Example.com ", "student-reset");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.order).toMatchObject({ email: "student@example.com", status: "free", total: 0, provider: "none" });
    expect(r.order.fulfilment?.emailedAt).toBeTruthy();

    const mails = outbox();
    expect(mails).toHaveLength(1);
    const mail = JSON.parse(readFileSync(path.join(dataDir, "outbox", mails[0]), "utf8"));
    expect(mail.to).toBe("student@example.com");
    const token = mail.text.match(/\/downloads\/([A-Za-z0-9_.-]+)/)[1];
    const check = await m.downloads.checkDownload(token);
    expect(check.ok).toBe(true);
  });

  it("resends instead of duplicating on a second claim", async () => {
    await m.claim.claimFreeProduct("a@b.co", "student-reset");
    const again = await m.claim.claimFreeProduct("a@b.co", "student-reset");
    expect(again.ok && again.resent).toBe(true);
    expect(await m.store.orderStore().listByEmail("a@b.co")).toHaveLength(1);
    expect(outbox()).toHaveLength(2);
  });

  it("refuses to give away paid or unknown products", async () => {
    expect(await m.claim.claimFreeProduct("a@b.co", "semester-system")).toMatchObject({ ok: false, status: 404 });
    expect(await m.claim.claimFreeProduct("a@b.co", "does-not-exist")).toMatchObject({ ok: false, status: 404 });
    expect(outbox()).toHaveLength(0);
  });
});

describe("download checks", () => {
  const pendingOrder = (id: string) => ({
    id,
    email: "p@b.co",
    items: [{ productId: "student-reset", productName: "Mura Student Reset", unitAmount: 1200, quantity: 1 }],
    currency: "USD",
    subtotal: 1200,
    providerFee: null,
    total: 1200,
    status: "pending" as const,
    provider: "flutterwave" as const,
    reference: `ref_${id}`,
    createdAt: new Date().toISOString(),
  });

  it("blocks unpaid orders, foreign products and unknown orders", async () => {
    await m.store.orderStore().create(pendingOrder("ord_pending"));
    expect(await m.downloads.checkDownload(m.tokens.createDownloadToken("ord_pending", "student-reset"))).toEqual({ ok: false, reason: "not-paid" });
    expect(await m.downloads.checkDownload(m.tokens.createDownloadToken("ord_missing", "student-reset"))).toEqual({ ok: false, reason: "invalid" });

    const r = await m.claim.claimFreeProduct("x@y.co", "student-reset");
    if (!r.ok) throw new Error("claim failed");
    expect(await m.downloads.checkDownload(m.tokens.createDownloadToken(r.order.id, "semester-system"))).toEqual({ ok: false, reason: "invalid" });
  });

  it("enforces the download allowance", async () => {
    const r = await m.claim.claimFreeProduct("lim@y.co", "student-reset");
    if (!r.ok) throw new Error("claim failed");
    const token = m.tokens.createDownloadToken(r.order.id, "student-reset");
    for (let i = 0; i < 3; i++) {
      expect((await m.downloads.checkDownload(token)).ok).toBe(true);
      await m.downloads.recordDownload(r.order.id);
    }
    expect(await m.downloads.checkDownload(token)).toEqual({ ok: false, reason: "limit" });
  });
});

describe("format choices", () => {
  const manifestPath = () => path.join(filesDir, "student-reset/delivery.json");
  afterAll(() => rmSync(manifestPath(), { force: true }));

  it("validates delivery lists and drops anything unsafe", () => {
    const items = m.delivery.parseManifest("student-reset", {
      items: [
        { kind: "link", label: "Google Docs", url: "https://docs.google.com/document/d/abc/copy" },
        { kind: "link", label: "Evil", url: "https://evil.example.com/copy" },
        { kind: "link", label: "Plain", url: "http://docs.google.com/document/d/abc/copy" },
        { kind: "file", label: "PDF", key: "student-reset/mura-student-reset.pdf" },
        { kind: "file", label: "Other", key: "semester-system/mura-semester-system.zip" },
        { kind: "file", label: "Escape", key: "student-reset/../../x" },
        { kind: "file", label: "Manifest", key: "student-reset/delivery.json" },
        { kind: "file", key: "student-reset/no-label.pdf" },
      ],
    });
    expect(items.map((i) => i.label)).toEqual(["Google Docs", "PDF"]);
    expect(m.delivery.parseManifest("student-reset", null)).toEqual([]);
  });

  it("offers every format and serves the file chosen", async () => {
    writeFileSync(path.join(filesDir, "student-reset/mura-student-reset.xlsx"), "PK xlsx");
    writeFileSync(
      manifestPath(),
      JSON.stringify({
        items: [
          { kind: "link", label: "Google Docs", url: "https://docs.google.com/document/d/abc/copy" },
          { kind: "file", label: "PDF", key: "student-reset/mura-student-reset.pdf" },
          { kind: "file", label: "Excel", key: "student-reset/mura-student-reset.xlsx" },
        ],
      }),
    );
    const r = await m.claim.claimFreeProduct("fmt@y.co", "student-reset");
    if (!r.ok) throw new Error("claim failed");
    const check = await m.downloads.checkDownload(m.tokens.createDownloadToken(r.order.id, "student-reset"));
    expect(check.ok && check.items.map((i) => `${i.kind}:${i.label}`)).toEqual(["link:Google Docs", "file:PDF", "file:Excel"]);

    const { GET } = await import("@/app/api/download/[token]/route");
    const token = m.tokens.createDownloadToken(r.order.id, "student-reset");
    const ctx = { params: Promise.resolve({ token }) } as never;
    const excel = await GET(new Request(`http://x/api/download/${token}?f=1`), ctx);
    expect(excel.headers.get("content-disposition")).toContain("mura-student-reset.xlsx");
    expect(await excel.text()).toBe("PK xlsx");
    const bad = await GET(new Request(`http://x/api/download/${token}?f=7`), ctx);
    expect(bad.status).toBe(303);
  });

  it("isn't ready while a listed file is missing", async () => {
    writeFileSync(manifestPath(), JSON.stringify({ items: [{ kind: "file", label: "Word", key: "student-reset/mura-student-reset.docx" }] }));
    expect(await m.claim.claimFreeProduct("miss@y.co", "student-reset")).toMatchObject({ ok: false, status: 503 });
  });
});
