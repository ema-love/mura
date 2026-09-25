import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Preview } from "@/components/previews/previews";
import { getProduct } from "@/lib/catalog";

/** Introduces the free Student Reset — useful on its own, no strings. */
export function FreeFeature() {
  const reset = getProduct("student-reset")!;
  return (
    <section id="start-free" aria-labelledby="free-title" className="relative py-section">
      <div className="page">
        <div className="relative overflow-hidden rounded-[40px] bg-card p-8 hairline shadow-soft sm:p-12 md:p-16">
          <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--accent),transparent)] opacity-90" />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow">Start free</p>
              <h2 id="free-title" className="headline mt-5 text-4xl sm:text-5xl md:text-6xl">
                A calm reset for the week ahead.
              </h2>
              <p className="lede mt-6 max-w-xl">
                {reset.name} is a free weekly kit: see every deadline, choose this week&rsquo;s priorities and plan your study
                time — in about twenty minutes every Sunday. It&rsquo;s complete on its own.
              </p>
              <ul className="mt-8 grid gap-x-6 gap-y-2.5 text-[15px] sm:grid-cols-2">
                {reset.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="mt-1 size-4 shrink-0 text-accent-ink" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button asChild size="lg">
                  <Link href={`/products/${reset.slug}`}>
                    Get it free <ArrowRight />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">Printable PDF · Just your email, no payment</p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="relative">
              <div className="grid gap-4 sm:grid-cols-2">
                <Preview id="weekly-reset" className="sm:row-span-2" />
                <Preview id="assignment-tracker" className="hidden sm:flex" />
                <Preview id="study-planner" className="hidden sm:flex" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
