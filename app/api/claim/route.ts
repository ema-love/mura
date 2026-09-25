import { NextResponse } from "next/server";
import { z } from "zod";
import { claimFreeProduct } from "@/lib/server/claim";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

const schema = z.object({ email: z.email().max(254), productId: z.string().min(1).max(100) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  const { email, productId } = parsed.data;
  if (!rateLimit(`claim:ip:${clientIp(request)}`, 10, 10 * 60_000) || !rateLimit(`claim:email:${email.toLowerCase()}`, 3, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes and try again." }, { status: 429 });
  }

  const result = await claimFreeProduct(email, productId);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true, email: result.order.email });
}
