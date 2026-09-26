import { NextResponse } from "next/server";
import { uploadProductFile } from "@/lib/server/admin-upload";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

const noStore = { "Cache-Control": "no-store" };

/** Owner-only: replace a template's Excel file. Password-protected and rate-limited. */
export async function POST(request: Request) {
  if (!rateLimit(`admin:ip:${clientIp(request)}`, 10, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Wait 15 minutes and try again." }, { status: 429, headers: noStore });
  }
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!form || !(file instanceof File)) return NextResponse.json({ error: "Choose a file to upload." }, { status: 400, headers: noStore });

  try {
    const result = await uploadProductFile({
      password: String(form.get("password") ?? ""),
      productId: String(form.get("productId") ?? ""),
      fileName: file.name,
      data: new Uint8Array(await file.arrayBuffer()),
    });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status, headers: noStore });
    return NextResponse.json({ ok: true, productName: result.productName, size: result.size }, { headers: noStore });
  } catch (e) {
    console.error("[admin/upload]", e);
    return NextResponse.json({ error: "The upload failed. Please try again." }, { status: 500, headers: noStore });
  }
}
