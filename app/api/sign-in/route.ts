import { NextResponse } from "next/server";
import { signInSchema } from "@/lib/auth-schema";

/**
 * Magic-link sign-in endpoint.
 * Validation is real; delivery is a stub until an email provider is connected.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, email: parsed.data.email });
}
