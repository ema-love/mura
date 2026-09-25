import { renderShareImage, ogSize } from "@/lib/og";
import { articles, getArticle } from "@/lib/data/resources";
import { articleCard } from "@/lib/share";

export const alt = "MÚRÀ guide";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return new Response("Not found", { status: 404 });
  return renderShareImage(articleCard(a), "og");
}
