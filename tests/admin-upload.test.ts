import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const root = mkdtempSync(path.join(tmpdir(), "mura-admin-"));
let mod: typeof import("@/lib/server/admin-upload");
const xlsx = new Uint8Array([0x50, 0x4b, 3, 4, 1, 2, 3]);
const base = { password: "a-long-owner-password", productId: "student-reset", fileName: "Student Reset.xlsx", data: xlsx };

beforeAll(async () => {
  process.env.PRODUCT_FILES_DIR = root;
  process.env.MURA_STORAGE = "file";
  process.env.MURA_ADMIN_PASSWORD = "a-long-owner-password";
  vi.resetModules();
  mod = await import("@/lib/server/admin-upload");
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe("owner upload", () => {
  it("stores the file at the product's key", async () => {
    expect(await mod.uploadProductFile(base)).toMatchObject({ ok: true, size: xlsx.byteLength });
    expect(new Uint8Array(readFileSync(path.join(root, "student-reset/mura-student-reset.xlsx")))).toEqual(xlsx);
  });

  it("gives every product a file key, including drafts", async () => {
    expect(await mod.uploadProductFile({ ...base, productId: "cv-kit" })).toMatchObject({ ok: true });
  });

  it("rejects a wrong password, unknown products and non-Excel files", async () => {
    expect(await mod.uploadProductFile({ ...base, password: "nope" })).toMatchObject({ ok: false, status: 401 });
    expect(await mod.uploadProductFile({ ...base, password: "" })).toMatchObject({ ok: false, status: 401 });
    expect(await mod.uploadProductFile({ ...base, productId: "../etc" })).toMatchObject({ ok: false, status: 404 });
    expect(await mod.uploadProductFile({ ...base, fileName: "x.pdf" })).toMatchObject({ ok: false, status: 400 });
    expect(await mod.uploadProductFile({ ...base, data: new Uint8Array([1, 2, 3]) })).toMatchObject({ ok: false, status: 400 });
    expect(await mod.uploadProductFile({ ...base, data: new Uint8Array(6 * 1024 * 1024).fill(0x50) })).toMatchObject({ ok: false, status: 413 });
  });

  it("is switched off without a long enough password", async () => {
    process.env.MURA_ADMIN_PASSWORD = "short";
    vi.resetModules();
    const off = await import("@/lib/server/admin-upload");
    expect(await off.uploadProductFile({ ...base, password: "short" })).toMatchObject({ ok: false, status: 503 });
    process.env.MURA_ADMIN_PASSWORD = "a-long-owner-password";
  });
});
