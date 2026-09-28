import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { getProduct, visibleProducts } from "@/lib/catalog";
import { serverEnv } from "./env";
import { openProductFile, productFileInfo, saveProductFile } from "./files";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export type UploadResult = { ok: true; productName: string; size: number } | { ok: false; status: number; error: string };

/** Constant-time password check. The page is off unless a long password is configured. */
export function checkAdminPassword(given: string) {
  const expected = serverEnv.adminPassword;
  if (!expected || expected.length < 12 || !given) return false;
  const digest = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(given), digest(expected));
}

/** Replaces a product's Excel file. Only .xlsx, only known products, only with the owner's password. */
export async function uploadProductFile({
  password,
  productId,
  fileName,
  data,
}: {
  password: string;
  productId: string;
  fileName: string;
  data: Uint8Array;
}): Promise<UploadResult> {
  if (!serverEnv.adminPassword || serverEnv.adminPassword.length < 12) {
    return { ok: false, status: 503, error: "Uploads are switched off. Set MURA_ADMIN_PASSWORD (12+ characters) in Netlify and redeploy." };
  }
  if (!checkAdminPassword(password)) return { ok: false, status: 401, error: "That password isn't right." };

  const product = getProduct(productId);
  if (!product?.fileKey) return { ok: false, status: 404, error: "Choose a template from the list." };
  if (!fileName.toLowerCase().endsWith(".xlsx")) return { ok: false, status: 400, error: "Choose an Excel file (.xlsx)." };
  if (!data.byteLength) return { ok: false, status: 400, error: "That file is empty." };
  if (data.byteLength > MAX_UPLOAD_BYTES) return { ok: false, status: 413, error: "That file is over 5 MB." };
  // .xlsx files are zip archives: they always start with "PK".
  if (data[0] !== 0x50 || data[1] !== 0x4b) return { ok: false, status: 400, error: "That doesn't look like a real Excel file." };

  await saveProductFile(product.fileKey, data, XLSX);
  return { ok: true, productName: product.name, size: data.byteLength };
}

/** Templates the owner manages: everything published that has its own file (bundles deliver their items). */
export const managedProducts = () => visibleProducts().filter((p) => p.type !== "bundle" && p.fileKey);

export type UploadStatus = { id: string; name: string; uploaded: boolean; size?: number; uploadedAt?: string };

export async function uploadStatus(password: string): Promise<{ ok: true; items: UploadStatus[] } | { ok: false; status: number; error: string }> {
  if (!checkAdminPassword(password)) return { ok: false, status: 401, error: "That password isn't right." };
  const items = await Promise.all(
    managedProducts().map(async (p) => {
      const info = await productFileInfo(p.fileKey!);
      return { id: p.id, name: p.name, uploaded: !!info, ...info };
    }),
  );
  return { ok: true, items };
}

/** The stored file exactly as customers receive it — for the owner to check. */
export async function storedFile(password: string, productId: string) {
  if (!checkAdminPassword(password)) return null;
  const product = getProduct(productId);
  return product?.fileKey ? openProductFile(product.fileKey) : null;
}
