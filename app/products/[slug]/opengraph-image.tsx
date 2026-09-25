import { renderShareImage, ogSize } from "@/lib/og";
import { getVisibleProductBySlug, visibleProducts } from "@/lib/catalog";
import { productCard } from "@/lib/share";

export const alt = "MÚRÀ product";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return visibleProducts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getVisibleProductBySlug(slug);
  if (!p) return new Response("Not found", { status: 404 });
  return renderShareImage(productCard(p), "og");
}
