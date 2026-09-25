import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/ui/reveal";
import { Ambient } from "@/components/sections/ambient";
import { ProductArt } from "@/components/store/product-art";
import { ProductBadges } from "@/components/store/badges";
import { ProductGrid } from "@/components/store/product-card";
import { BundleCard } from "@/components/store/bundle-card";
import { ImagePlaceholder } from "@/components/store/image-placeholder";
import { Preview } from "@/components/previews/previews";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { Faq } from "@/components/product/faq";
import { MobileBuyBar } from "@/components/product/mobile-buy-bar";
import {
  bundleItems,
  bundlesContaining,
  getCategory,
  getVisibleProductBySlug,
  isBundle,
  relatedProducts,
  visibleProducts,
} from "@/lib/catalog";
import { resolvePrice } from "@/lib/commerce/pricing";
import { brand, absoluteUrl } from "@/lib/brand";

export function generateStaticParams() {
  return visibleProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = getVisibleProductBySlug(slug);
  if (!p) return {};
  const category = getCategory(p.category).name;
  return {
    title: `${p.name} — ${p.pricing.model === "free" ? "free " : ""}${category.toLowerCase()} for students`,
    description: p.summary,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description: p.summary, type: "website", url: `/products/${p.slug}` },
    twitter: { card: "summary_large_image", title: p.name, description: p.summary },
  };
}

/** Structured data only states what's true: no offer is published until a price exists. */
function productJsonLd(slug: string) {
  const p = getVisibleProductBySlug(slug)!;
  const price = resolvePrice(p);
  const url = absoluteUrl(`/products/${p.slug}`);
  const offer =
    p.status !== "published"
      ? undefined
      : price.model === "free"
        ? { "@type": "Offer", price: "0", priceCurrency: brand.currency, availability: "https://schema.org/InStock", url }
        : price.model === "paid"
          ? { "@type": "Offer", price: (price.final / 100).toFixed(2), priceCurrency: brand.currency, availability: "https://schema.org/InStock", url }
          : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.summary,
    category: getCategory(p.category).name,
    brand: { "@type": "Brand", name: brand.name },
    url,
    ...(offer ? { offers: offer } : {}),
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const p = getVisibleProductBySlug(slug);
  if (!p) notFound();

  const category = getCategory(p.category);
  const bundle = isBundle(p);
  const items = bundle ? bundleItems(p) : [];
  const inBundles = bundle ? [] : bundlesContaining(p);
  const related = relatedProducts(p);
  const shortName = p.name.replace(/^(Mura|MURA) /, "");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(slug)).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main id="main">
        {/* Overview */}
        <section aria-labelledby="product-title" className="relative overflow-hidden pt-32 pb-20 md:pt-40">
          <Ambient />
          <div className="page relative">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/systems" className="hover:text-foreground">
                    Systems
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href={`/collections/${category.slug}`} className="hover:text-foreground">
                    {category.name}
                  </Link>
                </li>
              </ol>
            </nav>

            <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
              <Reveal className="lg:pt-6">
                <ProductBadges product={p} />
                <p className="eyebrow mt-6">{category.name}</p>
                <h1 id="product-title" className="headline mt-4 text-[clamp(2.5rem,5.5vw,4.75rem)]">
                  {p.name}
                </h1>
                <p className="lede mt-5 max-w-xl">{p.tagline}</p>
                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{p.summary}</p>
                <div className="mt-10">
                  <PurchasePanel product={p} />
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <ProductArt product={p} priority className="aspect-[4/5] shadow-float" sizes="(min-width: 1024px) 50vw, 100vw" />
                {p.image && !p.image.src && <ImagePlaceholder image={p.image} className="mt-4 hidden max-h-[420px] w-full sm:grid" />}
              </Reveal>
            </div>
          </div>
        </section>

        {/* The problem */}
        <section aria-labelledby="problem-title" className="py-section">
          <div className="page">
            <Reveal className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 id="problem-title" className="eyebrow">
                  The problem it solves
                </h2>
              </div>
              <p className="headline text-3xl text-pretty md:col-span-8 md:text-5xl">{p.problem}</p>
            </Reveal>
          </div>
        </section>

        {/* Details */}
        <section aria-label="Details" className="pb-section">
          <div className="page grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Reveal className="rounded-[28px] bg-card p-7 hairline md:col-span-2 lg:row-span-2">
              <h2 className="eyebrow">{bundle ? "What's included" : "What's inside"}</h2>
              <ul className="mt-6 space-y-3">
                {(bundle ? items.map((i) => i.name) : p.includes).map((item) => (
                  <li key={item} className="flex items-start gap-3 text-lg tracking-[-0.01em]">
                    <Check className="mt-1.5 size-4 shrink-0 text-accent-ink" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.05} className="rounded-[28px] bg-card p-7 hairline lg:col-span-2">
              <h2 className="eyebrow">Who it&rsquo;s for</h2>
              <ul className="mt-5 space-y-2 text-[15px]">
                {p.audience.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1} className="rounded-[28px] bg-card p-7 hairline">
              <h2 className="eyebrow">Format</h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {p.formats.map((f) => (
                  <li key={f} className="rounded-full bg-accent-soft px-3 py-1.5 text-sm hairline dark:bg-accent">
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">Digital download. Nothing is shipped.</p>
            </Reveal>
            <Reveal delay={0.15} className="rounded-[28px] bg-card p-7 hairline">
              <h2 className="eyebrow">How it works</h2>
              <ol className="mt-5 space-y-3 text-[14px]">
                {p.howItWorks.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="font-mono text-[11px] text-subtle-foreground">{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* Previews */}
        {p.previews.length > 0 && (
          <section aria-labelledby="inside-title" className="relative overflow-hidden py-section">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-2/3 max-w-5xl rounded-full bg-[radial-gradient(closest-side,var(--accent),transparent)] opacity-70 blur-2xl"
            />
            <div className="page relative">
              <Reveal>
                <p className="eyebrow">Preview</p>
                <h2 id="inside-title" className="headline mt-5 text-4xl md:text-6xl">
                  Inside the {shortName}.
                </h2>
                <p className="mt-4 text-muted-foreground">Shown with sample data.</p>
              </Reveal>
              <Reveal className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {p.previews.map((id, i) => (
                  <Preview key={id} id={id} className={i === 0 && p.previews.length !== 2 ? "sm:col-span-2" : ""} />
                ))}
              </Reveal>
            </div>
          </section>
        )}

        {/* Bundle contents */}
        {bundle && (
          <section aria-labelledby="bundle-items-title" className="py-section">
            <div className="page">
              <Reveal>
                <p className="eyebrow">In this bundle</p>
                <h2 id="bundle-items-title" className="headline mt-5 text-4xl md:text-6xl">
                  {items.length} systems, one design language.
                </h2>
              </Reveal>
              <ProductGrid products={items} className="mt-14" />
            </div>
          </section>
        )}

        {/* FAQ */}
        {p.faqs && p.faqs.length > 0 && (
          <section aria-labelledby="faq-title" className="py-section">
            <div className="page grid gap-10 md:grid-cols-12">
              <Reveal className="md:col-span-4">
                <p className="eyebrow">Questions</p>
                <h2 id="faq-title" className="headline mt-5 text-4xl">
                  Good to know.
                </h2>
              </Reveal>
              <Reveal delay={0.05} className="md:col-span-8">
                <Faq items={p.faqs} />
              </Reveal>
            </div>
          </section>
        )}

        {/* Bundles containing this product */}
        {inBundles.length > 0 && (
          <section aria-labelledby="in-bundles-title" className="py-section">
            <div className="page">
              <Reveal>
                <p className="eyebrow">Also in</p>
                <h2 id="in-bundles-title" className="headline mt-5 text-4xl md:text-5xl">
                  Get it as part of a bundle.
                </h2>
              </Reveal>
              <div className="mt-14 grid gap-6 lg:grid-cols-2">
                {inBundles.slice(0, 2).map((b) => (
                  <BundleCard key={b.id} bundle={b} layout="stack" className="h-full" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section aria-labelledby="related-title" className="border-t py-section">
            <div className="page">
              <Reveal>
                <p className="eyebrow">Works well with</p>
                <h2 id="related-title" className="headline mt-5 text-4xl md:text-5xl">
                  Related systems.
                </h2>
              </Reveal>
              <ProductGrid products={related} className="mt-14" />
            </div>
          </section>
        )}
      </main>
      <Footer />
      <MobileBuyBar product={p} />
      <div className="h-20 lg:hidden" aria-hidden />
    </>
  );
}
