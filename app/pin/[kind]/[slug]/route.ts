import { renderShareImage } from "@/lib/og";
import { getVisibleProductBySlug } from "@/lib/catalog";
import { getArticle } from "@/lib/data/resources";
import { articleCard, productCard } from "@/lib/share";
import { visibleProducts } from "@/lib/catalog";
import { articles } from "@/lib/data/resources";

/** Pre-rendered at build time: fast, cacheable and no fonts needed at runtime. */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    ...visibleProducts().map((p) => ({ kind: "products", slug: p.slug })),
    ...articles.map((a) => ({ kind: "resources", slug: a.slug })),
  ];
}

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
