import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ResourceCard } from "@/components/resources/resource-card";
import { articles } from "@/lib/data/resources";

export function Resources() {
  const [feature, ...rest] = articles;
  return (
    <section id="resources" aria-labelledby="resources-home-title" className="relative py-section">
      <div className="page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="resources-home-title"
            eyebrow="Resources"
            title="Read slowly. Arrive ready."
            description="Guides written with care — short enough to finish, thoughtful enough to remember."
          />
          <Reveal>
            <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
              All guides <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <Reveal className="mt-16 md:mt-24">
          <ResourceCard article={feature} featured />
        </Reveal>

        <ul className="mt-20 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(0, 3).map((a, i) => (
            <Reveal as="li" key={a.slug} delay={i * 0.08}>
              <ResourceCard article={a} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
