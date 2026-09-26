import { NextResponse } from "next/server";
import { handleWebhook } from "@/lib/server/checkout";
import { isValidWebhookSignature } from "@/lib/server/flutterwave";

/**
 * Flutterwave webhook. The `verif-hash` header must match FLW_SECRET_HASH, and even
 * then the body is only used to find the transaction — which is re-verified with
 * Flutterwave's API before anything is marked paid.
 */
export async function POST(request: Request) {
  if (!isValidWebhookSignature(request.headers.get("verif-hash"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  try {
    const outcome = await handleWebhook(body);
    // "unverified" means Flutterwave couldn't be reached: a 5xx asks it to retry later.
    if (outcome.state === "unverified") return NextResponse.json({ received: true, retry: true }, { status: 503 });
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[webhook/flutterwave]", e);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
