import { categories, getCategory } from "./categories";
import { products } from "./products";
import type { CategoryId, Product } from "./types";

export * from "./types";
export { categories, getCategory, getCategoryBySlug } from "./categories";

/** Products a visitor can see: published and upcoming. */
export const isVisible = (p: Product) => p.status === "published" || p.status === "upcoming";
export const isFree = (p: Product) => p.pricing.model === "free";
export const isBundle = (p: Product) => p.type === "bundle";
/** Purchasable (or claimable) right now: published and, when paid, priced. */
export const isAvailable = (p: Product) =>
  p.status === "published" && (p.pricing.model === "free" || p.pricing.amount !== null);

const byOrder = (a: Product, b: Product) => {
  // Published before upcoming, featured first, then catalogue order.
  const rank = (p: Product) => (p.status === "published" ? 0 : 2) + (p.featured ? 0 : 1);
  return rank(a) - rank(b) || products.indexOf(a) - products.indexOf(b);
};

export const visibleProducts = () => products.filter(isVisible).sort(byOrder);
export const featuredProducts = () => visibleProducts().filter((p) => p.featured && !isBundle(p));
export const freeProducts = () => visibleProducts().filter(isFree);
export const bundles = () => visibleProducts().filter(isBundle);
export const productsInCategory = (id: CategoryId) => visibleProducts().filter((p) => p.category === id);

/** Resolves any product that exists — including archived ones referenced by past orders. */
export const getProduct = (idOrSlug: string) => products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
export const getVisibleProductBySlug = (slug: string) => products.find((p) => p.slug === slug && isVisible(p));

export const bundleItems = (bundle: Product) =>
  (bundle.bundleItems ?? []).map((id) => getProduct(id)).filter((p): p is Product => !!p);

/** Bundles that contain this product. */
export const bundlesContaining = (product: Product) =>
  bundles().filter((b) => b.bundleItems?.includes(product.id));

export function relatedProducts(product: Product, limit = 3) {
  const pool = visibleProducts().filter((p) => p.id !== product.id && !isBundle(p) && p.type !== "mini");
  const same = pool.filter((p) => p.category === product.category);
  const shareFormat = pool.filter((p) => p.category !== product.category && p.formats.some((f) => product.formats.includes(f)));
  return [...same, ...shareFormat].slice(0, limit);
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return visibleProducts();
  return visibleProducts().filter((p) =>
    [p.name, p.summary, p.tagline, getCategory(p.category).name, ...p.includes, ...p.formats]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export const categoriesWithProducts = () =>
  [...categories].sort((a, b) => a.order - b.order).filter((c) => productsInCategory(c.id).length > 0);

export { products };
