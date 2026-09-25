import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/catalog/types";
import { getCategory } from "@/lib/catalog";
import { ProductArt } from "./product-art";
import { PriceDisplay } from "./price-display";
import { ProductBadges } from "./badges";
import { cn } from "@/lib/utils";

export function actionLabel(product: Product) {
  if (product.status === "upcoming") return "Preview";
  if (product.pricing.model === "free") return "Get it free";
  return product.type === "bundle" ? "View bundle" : "View system";
}

/** The one product card used across the store. Restrained: name, purpose, price, one action. */
export function ProductCard({ product, className, priority }: { product: Product; className?: string; priority?: boolean }) {
  const category = getCategory(product.category);
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative">
        <ProductArt
          product={product}
          priority={priority}
          className="aspect-[4/5] transition-all duration-700 ease-calm group-hover:-translate-y-1 group-hover:shadow-float"
        />
        <ProductBadges product={product} className="absolute top-4 left-4" />
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <p className="eyebrow !text-[10px]">{category.name}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-balance">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">{product.summary}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-5">
          <PriceDisplay product={product} />
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            {actionLabel(product)}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </div>
      {/* Visible focus for the whole card, driven by the link inside. */}
      <span aria-hidden className="pointer-events-none absolute -inset-2 rounded-[32px] ring-2 ring-transparent ring-offset-0 transition group-has-[:focus-visible]:ring-ring" />
    </article>
  );
}

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <ul className={cn("grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < 3} />
        </li>
      ))}
    </ul>
  );
}
