import "server-only";
import { randomBytes } from "node:crypto";

/** Short, unguessable, URL-safe ids. Prefixes make logs and support easier. */
export const newId = (prefix: string, bytes = 12) => `${prefix}_${randomBytes(bytes).toString("base64url")}`;
