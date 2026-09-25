import Link from "next/link";
import type { Product } from "@/lib/catalog/types";
import { PriceDisplay } from "@/components/store/price-display";
import { isAvailable, isFree } from "@/lib/catalog";

/** A quiet bar on small screens so the price and action stay within reach. */
export function MobileBuyBar({ product }: { product: Product }) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-30 lg:hidden">
      <div className="glass flex items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium">{product.name}</p>
          <PriceDisplay product={product} className="!text-[13px]" />
        </div>
        <Link href="#get" className="shrink-0 rounded-full bg-foreground px-4 py-2.5 text-[13px] font-medium text-background">
          {isFree(product) ? "Get it free" : isAvailable(product) ? "Buy" : "Details"}
        </Link>
      </div>
    </div>
  );
}
