import { renderShareImage } from "@/lib/og";
import { getVisibleProductBySlug } from "@/lib/catalog";
import { getArticle } from "@/lib/data/resources";
import { articleCard, productCard } from "@/lib/share";

/** Tall 2:3 share images for Pinterest: /pin/products/<slug> and /pin/resources/<slug>. */
export async function GET(_request: Request, ctx: RouteContext<"/pin/[kind]/[slug]">) {
  const { kind, slug } = await ctx.params;
  const card =
    kind === "products"
      ? (() => {
          const p = getVisibleProductBySlug(slug);
          return p && productCard(p);
        })()
      : kind === "resources"
        ? (() => {
            const a = getArticle(slug);
            return a && articleCard(a);
          })()
        : undefined;
  if (!card) return new Response("Not found", { status: 404 });

  const image = await renderShareImage(card, "pin");
  image.headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
  return image;
}
