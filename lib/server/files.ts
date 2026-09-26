import "server-only";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { getStore } from "@netlify/blobs";
import { serverEnv } from "./env";

/**
 * Private product files. Stored either in a local private directory or in the
 * "product-files" Netlify Blobs store (serverless hosting). Never in /public,
 * never in git, and never addressed by a public URL.
 */

const types: Record<string, string> = {
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".zip": "application/zip",
  ".json": "application/json",
};
const contentTypeFor = (name: string) => types[path.extname(name).toLowerCase()] ?? "application/octet-stream";

export type ProductFile = { stream: ReadableStream<Uint8Array>; size?: number; contentType: string; fileName: string };

/** Keys are relative paths like "student-reset/mura-student-reset.pdf". Anything that could escape is rejected. */
export function isSafeFileKey(fileKey: string) {
  return !!fileKey && !fileKey.includes("\0") && !path.isAbsolute(fileKey) && !fileKey.split(/[\\/]/).some((part) => part === ".." || part === "");
}

/** Resolves a fileKey inside the local private directory, or null if it would escape it. */
export function resolveFileKey(fileKey: string, baseDir = serverEnv.productFilesDir) {
  if (!isSafeFileKey(fileKey)) return null;
  const base = path.resolve(baseDir);
  const full = path.resolve(base, fileKey);
  return full.startsWith(base + path.sep) ? full : null;
}

const blobFiles = () => getStore({ name: "product-files", consistency: "strong" });

export async function productFileExists(fileKey: string, baseDir?: string) {
  if (serverEnv.storage === "netlify-blobs" && !baseDir) {
    if (!isSafeFileKey(fileKey)) return false;
    return (await blobFiles().getMetadata(fileKey)) !== null;
  }
  const full = resolveFileKey(fileKey, baseDir);
  if (!full) return false;
  try {
    return (await fs.stat(/*turbopackIgnore: true*/ full)).isFile();
  } catch {
    return false;
  }
}

export async function openProductFile(fileKey: string, baseDir?: string): Promise<ProductFile | null> {
  if (serverEnv.storage === "netlify-blobs" && !baseDir) {
    if (!isSafeFileKey(fileKey)) return null;
    const blob = await blobFiles().getWithMetadata(fileKey, { type: "stream" });
    if (!blob) return null;
    const meta = blob.metadata as { size?: number; contentType?: string; fileName?: string };
    const fileName = meta.fileName ?? path.basename(fileKey);
    return { stream: blob.data as ReadableStream<Uint8Array>, size: meta.size, contentType: meta.contentType ?? contentTypeFor(fileName), fileName };
  }
  const full = resolveFileKey(fileKey, baseDir);
  if (!full) return null;
  const stat = await fs.stat(/*turbopackIgnore: true*/ full).catch(() => null);
  if (!stat?.isFile()) return null;
  return {
    stream: Readable.toWeb(createReadStream(/*turbopackIgnore: true*/ full)) as ReadableStream<Uint8Array>,
    size: stat.size,
    contentType: contentTypeFor(full),
    fileName: path.basename(full),
  };
}
