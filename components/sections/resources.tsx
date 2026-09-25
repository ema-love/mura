import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Cover } from "@/components/site/cover";
import { articles } from "@/lib/data/resources";

export function Resources() {
  const [feature, ...rest] = articles;
  return (
    <section id="resources" aria-labelledby="resources-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1240px] px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="resources-title"
            eyebrow="Editorial"
            title="Read slowly. Arrive ready."
            description="Guides written with care — short enough to finish, thoughtful enough to remember."
          />
        </div>

        <Reveal className="mt-16 md:mt-24">
          <Link href={`/resources/${feature.slug}`} className="group grid gap-8 rounded-[32px] md:grid-cols-2 md:items-center md:gap-14">
            <Cover kind={feature.cover} title={feature.title} className="aspect-[4/3] transition-transform duration-700 ease-calm group-hover:scale-[0.99]" />
            <div>
              <p className="eyebrow">
                {feature.category} · {feature.minutes} min read
              </p>
              <h3 className="headline mt-5 text-4xl md:text-6xl">{feature.title}</h3>
              <p className="lede mt-5">{feature.dek}</p>
              <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium">
                Read the guide <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        </Reveal>

        <div className="mt-20 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 0.08}>
              <Link href={`/resources/${a.slug}`} className="group block rounded-[28px]">
                <Cover kind={a.cover} className="aspect-[4/3] transition-all duration-700 ease-calm group-hover:-translate-y-1 group-hover:shadow-float" />
                <p className="eyebrow mt-6 !text-[10px]">
                  {a.category} · {a.minutes} min
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{a.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{a.dek}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
