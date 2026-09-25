import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { Product } from "@/lib/catalog/types";
import { bundleItems } from "@/lib/catalog";
import { bundleValue } from "@/lib/commerce/pricing";
import { formatMoney } from "@/lib/commerce/money";
import { ProductArt } from "./product-art";
import { PriceDisplay } from "./price-display";
import { ProductBadges } from "./badges";
import { cn } from "@/lib/utils";

/** Premium bundle presentation: what's inside, the honest value, one action. */
export function BundleCard({ bundle, layout = "row", className }: { bundle: Product; layout?: "row" | "stack"; className?: string }) {
  const items = bundleItems(bundle);
  const value = bundleValue(bundle);
  return (
    <article
      className={cn(
        "group relative grid overflow-hidden rounded-[32px] bg-card hairline shadow-soft transition-shadow duration-700 hover:shadow-float",
        layout === "row" ? "md:grid-cols-[1fr_1.1fr]" : "",
        className,
      )}
    >
      <div className="relative">
        <ProductArt product={bundle} showPreview={false} className={cn("rounded-none !shadow-none", layout === "row" ? "aspect-[4/3] md:aspect-auto md:h-full" : "aspect-[4/3]")} />
        <ProductBadges product={bundle} className="absolute top-5 left-5" />
      </div>
      <div className="flex flex-col p-7 md:p-10">
        <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
          <Link href={`/products/${bundle.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {bundle.name}
          </Link>
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground text-pretty">{bundle.tagline}</p>

        <p className="eyebrow mt-8 !text-[10px]">Includes {items.length} systems</p>
        <ul className={cn("mt-4 grid gap-x-5 gap-y-2 text-[14px]", items.length > 6 ? "sm:grid-cols-2" : "")}>
          {items.slice(0, 10).map((p) => (
            <li key={p.id} className="flex items-start gap-2.5">
              <Check className="mt-1 size-3.5 shrink-0 text-accent-ink" aria-hidden />
              {p.name.replace(/^(Mura|MURA) /, "")}
            </li>
          ))}
          {items.length > 10 && <li className="text-muted-foreground">+ {items.length - 10} more</li>}
        </ul>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-10">
          <div>
            <PriceDisplay product={bundle} size="md" />
            {value?.savings ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {formatMoney(value.itemsTotal)} if bought separately · save {formatMoney(value.savings)}
              </p>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium">
            View bundle <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </div>
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[32px] ring-2 ring-transparent transition group-has-[:focus-visible]:ring-ring" />
    </article>
  );
}
