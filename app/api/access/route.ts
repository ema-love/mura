import { NextResponse } from "next/server";
import { z } from "zod";
import { orderStore } from "@/lib/server/order-store";
import { downloadLines, isDeliverable } from "@/lib/server/fulfilment";
import { sendEmail } from "@/lib/server/email";
import { accessEmail } from "@/lib/server/email-templates";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

const schema = z.object({ email: z.email().max(254) });

/**
 * Emails fresh download links for every completed order on an address.
 * Always answers the same way, so it can't be used to discover who has bought what.
 */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  const email = parsed.data.email.trim().toLowerCase();
  if (!rateLimit(`access:ip:${clientIp(request)}`, 10, 15 * 60_000) || !rateLimit(`access:email:${email}`, 3, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes and try again." }, { status: 429 });
  }

  const orders = (await orderStore().listByEmail(email)).filter(isDeliverable);
  if (orders.length) {
    const seen = new Set<string>();
    const lines = orders.flatMap((o) => downloadLines(o)).filter((l) => (seen.has(l.productName) ? false : (seen.add(l.productName), true)));
    const sent = await sendEmail({ to: email, ...accessEmail({ lines }) });
    if (!sent.ok) console.error("[access] email failed for an existing customer");
  }
  return NextResponse.json({ ok: true });
}
