import { NextResponse } from "next/server";
import { uploadStatus } from "@/lib/server/admin-upload";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

const noStore = { "Cache-Control": "no-store" };

/** Owner-only: which templates have a file uploaded. */
export async function POST(request: Request) {
  if (!rateLimit(`admin:ip:${clientIp(request)}`, 30, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Wait 15 minutes and try again." }, { status: 429, headers: noStore });
  }
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const result = await uploadStatus(typeof body?.password === "string" ? body.password : "");
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status, headers: noStore });
  return NextResponse.json({ items: result.items }, { headers: noStore });
}
