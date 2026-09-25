import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Cover } from "@/components/site/cover";
import { Reveal } from "@/components/ui/reveal";
import { ProductCard } from "@/components/store/product-card";
import { ShareRow } from "@/components/resources/share-row";
import { articles, getArticle } from "@/lib/data/resources";
import { getProduct, isVisible } from "@/lib/catalog";
import { absoluteUrl, brand } from "@/lib/brand";
import { pinImageUrl, pinterestSaveUrl } from "@/lib/share";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.dek,
    alternates: { canonical: `/resources/${a.slug}` },
    openGraph: { title: a.title, description: a.dek, type: "article", publishedTime: a.publishedAt, url: `/resources/${a.slug}` },
    twitter: { card: "summary_large_image", title: a.title, description: a.dek },
  };
}

const formatDate = (iso: string) => new Intl.DateTimeFormat(brand.locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

export default async function ArticlePage(props: PageProps<"/resources/[slug]">) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  const index = articles.findIndex((a) => a.slug === slug);
  const next = articles[(index + 1) % articles.length];
  const related = article.related.map((id) => getProduct(id)).filter((p) => p && isVisible(p)).slice(0, 2) as NonNullable<ReturnType<typeof getProduct>>[];
  const url = absoluteUrl(`/resources/${article.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: brand.name },
    publisher: { "@type": "Organization", name: brand.name },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Nav />
      <main id="main" className="pt-32 md:pt-40">
        <article>
          <header className="mx-auto max-w-[760px] px-5">
            <Reveal>
              <Link href="/resources" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="size-4" aria-hidden /> All guides
              </Link>
              <p className="eyebrow mt-12">
                {article.topic} · {article.minutes} min read · <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
              </p>
              <h1 className="display mt-6 text-5xl md:text-7xl">{article.title}</h1>
              <p className="lede mt-6">{article.dek}</p>
              <div className="mt-8">
                <ShareRow url={url} pinUrl={pinterestSaveUrl({ url, media: pinImageUrl("resources", article.slug), description: `${article.title} — ${article.dek}` })} />
              </div>
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
                {s.list && (
                  <ul className="mt-5 space-y-2.5 text-lg leading-relaxed text-foreground/85">
                    {s.list.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-3 size-1.5 shrink-0 rounded-full bg-accent-ink" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {s.table && (
                  <div className="mt-6 overflow-x-auto rounded-2xl bg-card hairline">
                    <table className="w-full min-w-[440px] text-left text-[15px]">
                      <caption className="sr-only">{s.table.caption}</caption>
                      <thead>
                        <tr className="text-[11px] tracking-wider text-muted-foreground uppercase">
                          {s.table.head.map((h, k) => (
                            <th key={h} scope="col" className={`px-5 pt-4 pb-3 font-medium ${k > 0 ? "text-right" : ""}`}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {s.table.rows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, k) => (
                              <td key={k} className={`px-5 py-3 ${k > 0 ? "text-right tabular-nums" : ""}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                      {s.table.foot && (
                        <tfoot>
                          <tr className="border-t font-semibold">
                            {s.table.foot.map((cell, k) => (
                              <td key={k} className={`px-5 py-3 ${k > 0 ? "text-right tabular-nums" : ""}`}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <aside aria-labelledby="related-title" className="mx-auto mt-24 max-w-[1080px] px-5">
            <div className={`grid gap-10 rounded-[32px] bg-accent-soft p-8 hairline md:p-12 dark:bg-accent ${related.length === 1 ? "md:grid-cols-2 md:items-center" : ""}`}>
              <div>
                <p className="eyebrow !text-accent-ink">If you&rsquo;d like a system for this</p>
                <h2 id="related-title" className="mt-3 max-w-xl text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                  Everything in this guide works on paper. {related.length === 1 ? "This makes" : "These make"} it easier to keep going.
                </h2>
              </div>
              <ul className={`grid gap-8 ${related.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {related.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        <nav aria-label="Next guide" className="mx-auto mt-24 max-w-[1080px] border-t px-5 py-16">
          <Link href={`/resources/${next.slug}`} className="group flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Next guide</p>
              <p className="headline mt-4 text-3xl md:text-5xl">{next.title}</p>
            </div>
            <ArrowRight className="mb-2 size-6 shrink-0 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
