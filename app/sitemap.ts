import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/brand";
import { categoriesWithProducts, visibleProducts } from "@/lib/catalog";
import { articles } from "@/lib/data/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["/", "/systems", "/collections", "/resources", "/about"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
  return [
    ...staticPages,
    ...categoriesWithProducts().map((c) => ({ url: absoluteUrl(`/collections/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...visibleProducts().map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: p.status === "published" ? 0.9 : 0.5,
    })),
    ...articles.map((a) => ({ url: absoluteUrl(`/resources/${a.slug}`), lastModified: a.publishedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
