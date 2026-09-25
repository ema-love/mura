import type { ImageAsset } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/**
 * A clearly marked slot for art-directed photography that hasn't been supplied yet.
 * Replace by adding `src` to the product's `image` in the catalogue — nothing else changes.
 */
export function ImagePlaceholder({ image, className }: { image: ImageAsset; className?: string }) {
  return (
    <figure
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-[28px] border border-dashed border-border-strong bg-muted/60 p-8 text-center",
        className,
      )}
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      <div className="max-w-xs">
        <p className="eyebrow !text-[10px]">Image placeholder · {image.width} × {image.height}</p>
        <p className="mt-3 text-sm text-muted-foreground text-pretty">{image.direction}</p>
      </div>
      <figcaption className="sr-only">{image.alt} (image not yet available)</figcaption>
    </figure>
  );
}
