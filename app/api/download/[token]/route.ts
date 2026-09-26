import { NextResponse } from "next/server";
import { checkDownload, recordDownload } from "@/lib/server/downloads";
import { openProductFile } from "@/lib/server/files";

const noStore = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };

/** `?f=<n>` picks which of the product's files to download (default: the first). */
export async function GET(_request: Request, ctx: RouteContext<"/api/download/[token]">) {
  const { token } = await ctx.params;
  const check = await checkDownload(token);
  if (!check.ok) {
    // Send people back to the explanatory page rather than a bare error.
    return NextResponse.redirect(new URL(`/downloads/${encodeURIComponent(token)}`, _request.url), { status: 303, headers: noStore });
  }

  const files = check.items.filter((i) => i.kind === "file");
  const index = Number(new URL(_request.url).searchParams.get("f") ?? 0);
  const chosen = Number.isInteger(index) ? files[index] : undefined;
  const file = chosen ? await openProductFile(chosen.key) : null;
  if (!file) return NextResponse.redirect(new URL(`/downloads/${encodeURIComponent(token)}`, _request.url), { status: 303, headers: noStore });

  await recordDownload(check.order.id);
  return new Response(file.stream, {
    headers: {
      ...noStore,
      "Content-Type": file.contentType,
      ...(file.size ? { "Content-Length": String(file.size) } : {}),
      "Content-Disposition": `attachment; filename="${file.fileName.replace(/"/g, "")}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
