import { NextResponse } from "next/server";
import { builderSchema, buildRecommendations } from "@/lib/builder";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = builderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid answers", issues: parsed.error.issues }, { status: 400 });
  }
  return NextResponse.json(buildRecommendations(parsed.data));
}
