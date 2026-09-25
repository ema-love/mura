import type { Product } from "@/lib/catalog/types";
import { resolvePrice } from "@/lib/commerce/pricing";
import { formatMoney } from "@/lib/commerce/money";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "text-[15px]",
  md: "text-xl",
  lg: "text-4xl tracking-[-0.04em]",
};

/** Every price in the store renders through here: free, pending, discounted or full. */
export function PriceDisplay({ product, size = "sm", className }: { product: Product; size?: Size; className?: string }) {
  const price = resolvePrice(product);

  if (price.model === "free") {
    return <span className={cn("font-semibold", sizes[size], className)}>Free</span>;
  }
  if (price.model === "pending") {
    return <span className={cn("font-medium text-muted-foreground", size === "lg" ? "text-xl" : "text-[14px]", className)}>Price coming soon</span>;
  }
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold tabular-nums", sizes[size])}>{formatMoney(price.final)}</span>
      {price.discount && (
        <>
          <s className="text-sm text-muted-foreground tabular-nums">
            <span className="sr-only">was </span>
            {formatMoney(price.base)}
          </s>
          <span className="text-xs font-medium text-accent-ink">{price.discount.campaign.label} · {price.discount.campaign.percentOff}% off</span>
        </>
      )}
      <span className="sr-only">US dollars</span>
    </span>
  );
}
