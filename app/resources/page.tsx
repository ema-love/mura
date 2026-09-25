import type { Metadata } from "next";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/ui/reveal";
import { Ambient } from "@/components/sections/ambient";
import { ResourceCard } from "@/components/resources/resource-card";
import { ResourceBrowser } from "@/components/resources/resource-browser";
import { articles, topics } from "@/lib/data/resources";

export const metadata: Metadata = {
  title: "Resources — guides for student life",
  description:
    "Practical guides on planning your semester, organising assignments, preparing for exams, calculating your TGPA, budgeting, scholarships, internships, CVs and portfolios.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  const [feature, ...rest] = articles;
  return (
    <>
      <Nav />
      <main id="main">
        <section aria-labelledby="resources-title" className="relative overflow-hidden pt-36 pb-16 md:pt-44">
          <Ambient />
          <div className="page relative">
            <Reveal>
              <p className="eyebrow">Resources</p>
              <h1 id="resources-title" className="display mt-6 text-[clamp(3rem,9vw,8rem)]">
                Read slowly.
                <span className="block text-muted-foreground">Arrive ready.</span>
              </h1>
              <p className="lede mt-6 max-w-2xl">Short, practical guides for the parts of student life that deserve a little thought.</p>
            </Reveal>
          </div>
        </section>

        <div className="page pb-section">
          <Reveal>
            <ResourceCard article={feature} featured />
          </Reveal>
          <div className="mt-24 border-t pt-12">
            <ResourceBrowser articles={rest} topics={topics} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
