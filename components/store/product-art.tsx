import Image from "next/image";
import type { Product } from "@/lib/catalog/types";
import { getCategory } from "@/lib/catalog";
import { Preview } from "@/components/previews/previews";
import { cn } from "@/lib/utils";

/**
 * Product artwork. Uses supplied photography when it exists; otherwise composes an
 * honest mockup from the product's own name and interface preview — never a stock image.
 */
export function ProductArt({
  product,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
  showPreview = true,
}: {
  product: Product;
  className?: string;
  sizes?: string;
  priority?: boolean;
  showPreview?: boolean;
}) {
  const [from, to] = getCategory(product.category).tone;

  if (product.image?.src) {
    return (
      <div className={cn("relative overflow-hidden rounded-[28px]", className)}>
        <Image src={product.image.src} alt={product.image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const preview = showPreview ? product.previews[0] : undefined;
  const stacked = product.type === "bundle";

  return (
    <div
      className={cn("relative isolate overflow-hidden rounded-[28px] hairline dark:brightness-[0.92]", className)}
      style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}
      aria-hidden
    >
      <div className="grain absolute inset-0 opacity-[0.09] mix-blend-multiply" />
      <div className="absolute -top-1/3 -left-1/4 h-full w-3/4 -skew-x-12 bg-[linear-gradient(90deg,rgb(255_250_240/0.7),transparent)] blur-2xl" />

      {/* The printed cover: MÚRÀ mark, product name, formats. */}
      <div className={cn("absolute top-[11%] left-[10%] w-[52%]", preview ? "" : "left-1/2 w-[58%] -translate-x-1/2")}>
        {stacked && (
          <>
            <div className="absolute inset-0 translate-x-[9%] translate-y-[6%] rotate-[4deg] rounded-md bg-[#f6f4ee] shadow-[0_18px_30px_-18px_rgb(40_30_20/0.45)]" />
            <div className="absolute inset-0 translate-x-[4%] translate-y-[3%] rotate-[2deg] rounded-md bg-[#faf8f3] shadow-[0_18px_30px_-18px_rgb(40_30_20/0.45)]" />
          </>
        )}
        <div className="relative aspect-[3/4] rounded-md bg-[#fdfcf8] p-[9%] text-[#1f1f1f] shadow-[0_24px_40px_-20px_rgb(40_30_20/0.45),0_2px_4px_rgb(40_30_20/0.08)]">
          <p className="font-mono text-[clamp(6px,0.9vw,9px)] tracking-[0.24em] text-black/45">MÚRÀ</p>
          <p className="mt-[18%] text-[clamp(12px,1.7vw,19px)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance">
            {product.name.replace(/^(Mura|MURA) /, "")}
          </p>
          <div className="mt-[14%] space-y-[6%]">
            {[82, 64, 74, 52].map((w, i) => (
              <div key={i} className="h-[3px] rounded-full bg-black/[0.08]" style={{ width: `${w}%` }} />
            ))}
          </div>
          <p className="absolute right-[9%] bottom-[7%] left-[9%] font-mono text-[clamp(5px,0.75vw,8px)] tracking-[0.16em] text-black/40 uppercase">
            {product.formats.join(" · ")}
          </p>
        </div>
      </div>

      {preview && (
        <div className="pointer-events-none absolute right-[-6%] bottom-[-8%] w-[64%] min-w-[260px] origin-bottom-right scale-[0.82] select-none" inert>
          <Preview id={preview} />
        </div>
      )}
    </div>
  );
}
