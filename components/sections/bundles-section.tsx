import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { BundleCard } from "@/components/store/bundle-card";
import { bundles } from "@/lib/catalog";

export function BundlesSection() {
  const all = bundles();
  if (!all.length) return null;
  const [lead, ...rest] = [...all].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

  return (
    <section id="bundles" aria-labelledby="bundles-title" className="relative py-section">
      <div className="page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="bundles-title"
            eyebrow="Bundles"
            title="Complete sets, designed to work together."
            description="Every system in a bundle shares one design language, so moving between them feels natural."
          />
          <Reveal>
            <Link href="/collections/bundles" className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
              All bundles <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <Reveal className="mt-16 md:mt-24">
          <BundleCard bundle={lead} />
        </Reveal>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {rest.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.06}>
              <BundleCard bundle={b} layout="stack" className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
