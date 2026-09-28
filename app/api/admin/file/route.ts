import { NextResponse } from "next/server";
import { storedFile } from "@/lib/server/admin-upload";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

/** Owner-only: download the stored file to check it. A form POST, so the password never sits in a URL. */
export async function POST(request: Request) {
  if (!rateLimit(`admin:ip:${clientIp(request)}`, 30, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Wait 15 minutes and try again." }, { status: 429 });
  }
  const form = await request.formData().catch(() => null);
  const file = await storedFile(String(form?.get("password") ?? ""), String(form?.get("productId") ?? ""));
  if (!file) return new NextResponse("Not found, or the password isn't right.", { status: 404, headers: { "Cache-Control": "no-store" } });
  return new Response(file.stream, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": file.contentType,
      ...(file.size ? { "Content-Length": String(file.size) } : {}),
      "Content-Disposition": `attachment; filename="${file.fileName.replace(/"/g, "")}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
