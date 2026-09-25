import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "accent" | "solid"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.12em] uppercase",
        tone === "accent" && "bg-accent text-accent-ink",
        tone === "solid" && "bg-foreground text-background",
        tone === "neutral" && "bg-card/80 text-muted-foreground hairline",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Status badges only state facts: free, featured, bundle. */
export function ProductBadges({ product, className }: { product: Product; className?: string }) {
  const free = product.pricing.model === "free";
  return (
    <span className={cn("flex flex-wrap gap-1.5", className)}>
      {free && <Badge tone="accent">Free</Badge>}
      {product.type === "bundle" && <Badge>Bundle</Badge>}
      {product.featured && product.status === "published" && !free && <Badge>Featured</Badge>}
    </span>
  );
}

export { Badge };
