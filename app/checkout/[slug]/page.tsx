import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Ambient } from "@/components/sections/ambient";
import { ProductArt } from "@/components/store/product-art";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getVisibleProductBySlug, isAvailable } from "@/lib/catalog";
import { resolvePrice } from "@/lib/commerce/pricing";
import { formatMoney } from "@/lib/commerce/money";
import { checkoutOpen } from "@/lib/server/checkout";
import { flutterwaveConfig } from "@/lib/server/flutterwave";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default async function CheckoutPage(props: PageProps<"/checkout/[slug]">) {
  await connection();
  const { slug } = await props.params;
  const product = getVisibleProductBySlug(slug);
  if (!product) notFound();

  const price = resolvePrice(product);
  // Only priced, published products can be bought — and only while checkout is open.
  if (!isAvailable(product) || price.model !== "paid" || !checkoutOpen()) redirect(`/products/${product.slug}`);

  const testMode = flutterwaveConfig().mode === "test";

  return (
    <>
      <Nav />
      <main id="main" className="relative overflow-hidden">
        <Ambient />
        <section aria-labelledby="checkout-title" className="page relative pt-32 pb-24 md:pt-40">
          <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden /> {product.name}
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <p className="eyebrow">Checkout</p>
              <h1 id="checkout-title" className="headline mt-5 text-[clamp(2.25rem,4.5vw,3.75rem)]">
                One step to your files.
              </h1>
              <p className="lede mt-5 max-w-lg">Pay once, then your download link arrives by email. No account, no subscription.</p>

              {testMode && (
                <p className="mt-6 inline-flex rounded-full bg-accent-soft px-3 py-1.5 text-xs font-medium hairline dark:bg-accent">
                  Test mode — no real money is charged
                </p>
              )}

              <div className="mt-10 max-w-lg">
                <CheckoutForm productId={product.id} productName={product.name} />
              </div>
            </div>

            <aside aria-label="Order summary" className="h-fit rounded-[28px] bg-card p-6 hairline md:p-8">
              <ProductArt product={product} showPreview={false} className="aspect-[16/10] rounded-2xl" sizes="(min-width: 1024px) 40vw, 100vw" />
              <p className="mt-6 font-medium tracking-[-0.01em]">{product.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{product.formats.join(" · ")} · Digital download</p>

              <dl className="mt-8 space-y-3 border-t pt-6 text-[15px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Price</dt>
                  <dd className="tabular-nums">{formatMoney(price.base)}</dd>
                </div>
                {price.discount && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{price.discount.campaign.label}</dt>
                    <dd className="tabular-nums text-accent-ink">−{formatMoney(price.discount.amount)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Payment charge</dt>
                  <dd className="text-right text-sm text-muted-foreground">Set by Flutterwave</dd>
                </div>
                <div className="flex justify-between gap-4 border-t pt-4 font-semibold">
                  <dt>Product total</dt>
                  <dd className="tabular-nums">
                    {formatMoney(price.final)} <span className="text-xs font-normal text-muted-foreground">USD</span>
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Flutterwave may add a payment charge depending on how you pay. It&rsquo;s shown on the secure payment page before you confirm,
                and your receipt shows the final amount.
              </p>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
