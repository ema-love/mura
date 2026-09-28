import { NextResponse } from "next/server";
import { checkAdminPassword } from "@/lib/server/admin-upload";
import { runHealthChecks, sendTestEmail } from "@/lib/server/health";
import { clientIp, rateLimit } from "@/lib/server/rate-limit";

const noStore = { "Cache-Control": "no-store" };

/** Owner-only: plain-language checks of email, payments and delivery settings. */
export async function POST(request: Request) {
  if (!rateLimit(`admin:ip:${clientIp(request)}`, 30, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts. Wait 15 minutes and try again." }, { status: 429, headers: noStore });
  }
  const body = (await request.json().catch(() => null)) as { password?: unknown; testEmail?: unknown } | null;
  if (!checkAdminPassword(typeof body?.password === "string" ? body.password : "")) {
    return NextResponse.json({ error: "That password isn't right." }, { status: 401, headers: noStore });
  }
  const checks = await runHealthChecks();
  if (body?.testEmail === true) checks.push(await sendTestEmail());
  return NextResponse.json({ checks }, { headers: noStore });
}
