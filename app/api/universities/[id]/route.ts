import { NextResponse } from "next/server";
import { getUniversity } from "@/lib/data/universities";

export async function GET(_request: Request, ctx: RouteContext<"/api/universities/[id]">) {
  const { id } = await ctx.params;
  const university = getUniversity(id);
  if (!university) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(university, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=86400" },
  });
}
