import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/ui/reveal";
import { Ambient } from "@/components/sections/ambient";
import { ProductGrid } from "@/components/store/product-card";
import { BundleCard } from "@/components/store/bundle-card";
import { categoriesWithProducts, getCategoryBySlug, productsInCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return categoriesWithProducts().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const c = getCategoryBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.name} — student systems and templates`,
    description: `${c.summary} ${c.statement}`,
    alternates: { canonical: `/collections/${c.slug}` },
  };
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const c = getCategoryBySlug(slug);
  if (!c) notFound();
  const items = productsInCategory(c.id);
  if (!items.length) notFound();
  const others = categoriesWithProducts().filter((o) => o.id !== c.id);

  return (
    <>
      <Nav />
      <main id="main">
        <section aria-labelledby="collection-title" className="relative overflow-hidden pt-36 pb-16 md:pt-44">
          <Ambient />
          <div className="page relative">
            <Reveal>
              <Link href="/collections" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="size-4" aria-hidden /> All collections
              </Link>
              <p className="eyebrow mt-10">Collection {String(c.order).padStart(2, "0")}</p>
              <h1 id="collection-title" className="display mt-6 text-[clamp(2.75rem,8vw,7rem)]">
                {c.name}.
              </h1>
              <p className="lede mt-6 max-w-2xl">{c.statement}</p>
            </Reveal>
          </div>
        </section>

        <div className="page pb-section">
          <h2 className="sr-only">In this collection</h2>
          {c.id === "bundles" ? (
            <div className="grid gap-6">
              {items.map((b, i) => (
                <Reveal key={b.id} delay={i * 0.05}>
                  <BundleCard bundle={b} />
                </Reveal>
              ))}
            </div>
          ) : (
            <ProductGrid products={items} />
          )}

          <nav aria-label="Other collections" className="mt-28 border-t pt-12">
            <p className="eyebrow">Keep exploring</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {others.map((o) => (
                <li key={o.id}>
                  <Link href={`/collections/${o.slug}`} className="inline-flex rounded-full bg-card px-4 py-2 text-sm font-medium hairline transition-colors hover:bg-accent-soft">
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
