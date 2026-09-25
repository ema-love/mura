import type { Product } from "@/lib/catalog/types";
import type { Article } from "@/lib/data/resources";
import { getCategory } from "@/lib/catalog";
import { absoluteUrl, brand } from "@/lib/brand";
import type { ShareCard } from "@/lib/og";

export function productCard(p: Product): ShareCard {
  return {
    eyebrow: getCategory(p.category).name,
    title: p.name,
    subtitle: p.tagline,
    meta: p.formats.join(" · "),
    tone: getCategory(p.category).tone,
    badge: p.pricing.model === "free" ? "FREE" : p.status === "upcoming" ? "COMING SOON" : undefined,
  };
}

export function articleCard(a: Article): ShareCard {
  return {
    eyebrow: `${brand.name} Guide · ${a.topic}`,
    title: a.title,
    subtitle: a.dek,
    meta: `${a.minutes} minute read`,
    tone: ["#f6f1e8", "#e2ebe2"],
  };
}

/** Tall 2:3 image for Pinterest. */
export const pinImageUrl = (kind: "products" | "resources", slug: string) => absoluteUrl(`/pin/${kind}/${slug}`);

/** Pinterest's documented "save" link: opens the Pin creator with our image and text. */
export const pinterestSaveUrl = ({ url, media, description }: { url: string; media: string; description: string }) =>
  `https://www.pinterest.com/pin/create/button/?${new URLSearchParams({ url, media, description }).toString()}`;
