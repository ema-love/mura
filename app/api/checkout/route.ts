import { NextResponse } from "next/server";
import { z } from "zod";
import { startCheckout } from "@/lib/server/checkout";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

const schema = z.object({ email: z.email().max(254), productId: z.string().min(1).max(100) });

/** Starts a Flutterwave payment for one product and returns the hosted payment link. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  const { email, productId } = parsed.data;
  if (!rateLimit(`checkout:ip:${clientIp(request)}`, 10, 10 * 60_000) || !rateLimit(`checkout:email:${email.toLowerCase()}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  }

  try {
    const result = await startCheckout(email, productId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json({ link: result.link });
  } catch (e) {
    console.error("[api/checkout]", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
