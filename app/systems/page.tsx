import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/ui/reveal";
import { StoreBrowser } from "@/components/store/store-browser";
import { ProductGrid } from "@/components/store/product-card";
import { Ambient } from "@/components/sections/ambient";
import { visibleProducts } from "@/lib/catalog";
import { CampaignBanner } from "@/components/site/campaign-banner";

export const metadata: Metadata = {
  title: "Systems — planners, trackers and templates for students",
  description:
    "Browse every MÚRÀ system: semester planners, assignment trackers, GPA and TGPA trackers, study systems, budgets and career kits. Start free.",
  alternates: { canonical: "/systems" },
};

export default function SystemsPage() {
  return (
    <>
      <Nav />
      <main id="main" className="relative">
        <section aria-labelledby="systems-title" className="relative overflow-hidden pt-36 pb-10 md:pt-44">
          <Ambient />
          <div className="page relative">
            <Reveal>
              <CampaignBanner className="mx-0 mb-8" />
              <p className="eyebrow">Shop MÚRÀ</p>
              <h1 id="systems-title" className="display mt-6 text-[clamp(3rem,9vw,8rem)]">
                Systems.
              </h1>
              <p className="lede mt-6 max-w-2xl">
                Planners, trackers and templates for every part of student life. Pay once, receive them by email, and use
                them in the format that suits you.
              </p>
            </Reveal>
          </div>
        </section>

        <div className="page pb-section">
          {/* useSearchParams needs a Suspense boundary; the fallback is the full, unfiltered catalogue. */}
          <Suspense fallback={<ProductGrid products={visibleProducts()} className="mt-24" />}>
            <StoreBrowser />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
