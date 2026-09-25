import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Cover } from "@/components/site/cover";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { articles, getArticle } from "@/lib/data/resources";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  return article ? { title: article.title, description: article.dek } : {};
}

export default async function ArticlePage(props: PageProps<"/resources/[slug]">) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  const index = articles.findIndex((a) => a.slug === slug);
  const next = articles[(index + 1) % articles.length];

  return (
    <>
      <Nav />
      <main id="main" className="pt-32 md:pt-40">
        <article>
          <header className="mx-auto max-w-[760px] px-5">
            <Reveal>
              <Link href="/#resources" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="size-4" /> All guides
              </Link>
              <p className="eyebrow mt-12">
                {article.category} · {article.minutes} min read
              </p>
              <h1 className="display mt-6 text-5xl md:text-7xl">{article.title}</h1>
              <p className="lede mt-6">{article.dek}</p>
            </Reveal>
          </header>

          <Reveal delay={0.1} className="mx-auto mt-16 max-w-[1080px] px-5">
            <Cover kind={article.cover} className="aspect-[16/8]" />
          </Reveal>

          <div className="mx-auto mt-16 max-w-[680px] px-5 md:mt-24">
            {article.sections.map((s, i) => (
              <Reveal key={s.heading} className={i > 0 ? "mt-14" : undefined}>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{s.heading}</h2>
                {s.body.map((p, j) => (
                  <p
                    key={j}
                    className={
                      i === 0 && j === 0
                        ? "mt-5 text-xl leading-[1.75] text-pretty first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-semibold"
                        : "mt-5 text-lg leading-[1.8] text-pretty text-foreground/85"
                    }
                  >
                    {p}
                  </p>
                ))}
              </Reveal>
            ))}

            <div className="mt-20 rounded-[28px] bg-accent-soft p-8 hairline dark:bg-accent">
              <p className="eyebrow !text-accent-ink">Put it into practice</p>
              <p className="mt-3 text-xl font-medium tracking-[-0.02em]">Turn this guide into your personal plan in six questions.</p>
              <Button asChild className="mt-6">
                <Link href="/#builder">
                  Find Your Pack <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </article>

        <nav aria-label="Next guide" className="mx-auto mt-24 max-w-[1080px] border-t px-5 py-16">
          <Link href={`/resources/${next.slug}`} className="group flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Next guide</p>
              <p className="headline mt-4 text-3xl md:text-5xl">{next.title}</p>
            </div>
            <ArrowRight className="mb-2 size-6 shrink-0 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
