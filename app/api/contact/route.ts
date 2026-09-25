import { NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/server/email";
import { contactNotification } from "@/lib/server/email-templates";
import { serverEnv } from "@/lib/server/env";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(5000),
  /** Honeypot: people never fill this in; bots usually do. */
  company: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (body && typeof body.company === "string" && body.company.length > 0) return NextResponse.json({ ok: true });

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  if (!rateLimit(`contact:${clientIp(request)}`, 5, 30 * 60_000)) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  const to = serverEnv.inboxEmail ?? (serverEnv.isProd ? undefined : "inbox-not-configured@localhost");
  if (!to) return NextResponse.json({ error: "Messages can't be sent right now. Please try again later." }, { status: 503 });

  const { name, email, message } = parsed.data;
  const sent = await sendEmail({ to, replyTo: email, ...contactNotification({ name, email, message }) });
  if (!sent.ok) return NextResponse.json({ error: "Your message couldn't be sent. Please try again." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
