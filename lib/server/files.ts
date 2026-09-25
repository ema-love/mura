import "server-only";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { serverEnv } from "./env";

const types: Record<string, string> = {
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".zip": "application/zip",
};

/**
 * Resolves a catalogue fileKey inside the private files directory.
 * Rejects anything that would escape it (../, absolute paths, null bytes).
 */
export function resolveFileKey(fileKey: string, baseDir = serverEnv.productFilesDir) {
  if (!fileKey || fileKey.includes("\0") || path.isAbsolute(fileKey)) return null;
  const base = path.resolve(baseDir);
  const full = path.resolve(base, fileKey);
  if (!full.startsWith(base + path.sep)) return null;
  return full;
}

export async function productFileExists(fileKey: string, baseDir?: string) {
  const full = resolveFileKey(fileKey, baseDir);
  if (!full) return false;
  try {
    return (await fs.stat(full)).isFile();
  } catch {
    return false;
  }
}

export async function openProductFile(fileKey: string, baseDir?: string) {
  const full = resolveFileKey(fileKey, baseDir);
  if (!full) return null;
  const stat = await fs.stat(full).catch(() => null);
  if (!stat?.isFile()) return null;
  return {
    stream: Readable.toWeb(createReadStream(full)) as ReadableStream<Uint8Array>,
    size: stat.size,
    contentType: types[path.extname(full).toLowerCase()] ?? "application/octet-stream",
    fileName: path.basename(full),
  };
}
