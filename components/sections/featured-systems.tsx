import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProductArt } from "@/components/store/product-art";
import { PriceDisplay } from "@/components/store/price-display";
import { featuredProducts, getCategory, isFree } from "@/lib/catalog";

/** The paid launch systems, presented editorially: one large, two alongside. */
export function FeaturedSystems() {
  const systems = featuredProducts().filter((p) => !isFree(p));
  if (!systems.length) return null;

  return (
    <section id="systems" aria-labelledby="systems-title" className="relative py-section">
      <div className="page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="systems-title"
            eyebrow="The systems"
            title="Built for the parts of a semester that get messy."
            description="Each system solves one real problem well — and works alongside the others."
          />
          <Reveal>
            <Link href="/systems" className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
              All systems <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2">
          {systems.map((p, i) => {
            const lead = i === 0;
            return (
              <Reveal key={p.id} delay={lead ? 0 : (i % 2) * 0.08} className={lead ? "md:col-span-2" : ""}>
                <li
                  className={cn(
                    "group relative grid h-full overflow-hidden rounded-[32px] bg-card hairline shadow-soft transition-shadow duration-700 hover:shadow-float",
                    lead ? "lg:grid-cols-[1.25fr_1fr]" : "grid-rows-[auto_1fr]",
                  )}
                >
                  <ProductArt product={p} className={cn("rounded-none", lead ? "aspect-[16/10] lg:aspect-auto lg:min-h-[480px]" : "aspect-[16/10]")} />
                  <div className={cn("flex flex-col justify-between gap-8 p-7 md:p-9", lead && "lg:p-12")}>
                    <div className="max-w-md">
                      <p className="eyebrow !text-[10px]">{getCategory(p.category).name}</p>
                      <h3 className={cn("mt-3 font-semibold tracking-[-0.03em]", lead ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl")}>
                        <Link href={`/products/${p.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                          {p.name}
                        </Link>
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{lead ? p.summary : p.tagline}</p>
                      {lead && (
                        <ul className="mt-6 space-y-2 text-[14px]">
                          {p.includes.map((item) => (
                            <li key={item} className="flex items-start gap-2.5">
                              <Check className="mt-1 size-3.5 shrink-0 text-accent-ink" aria-hidden />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-5">
                      <PriceDisplay product={p} />
                      <span className="grid size-10 place-items-center rounded-full bg-foreground text-background transition-transform duration-500 group-hover:-rotate-45" aria-hidden>
                        <ArrowUpRight className="size-4 rotate-45" />
                      </span>
                    </div>
                  </div>
                  <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[32px] ring-2 ring-transparent transition group-has-[:focus-visible]:ring-ring" />
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
