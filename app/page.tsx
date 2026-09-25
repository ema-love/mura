import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/sections/hero";
import { Why } from "@/components/sections/why";
import { Assembly } from "@/components/sections/assembly";
import { FreeFeature } from "@/components/sections/free-feature";
import { FeaturedSystems } from "@/components/sections/featured-systems";
import { InsideSystems } from "@/components/sections/inside-systems";
import { Collections } from "@/components/sections/collections";
import { BundlesSection } from "@/components/sections/bundles-section";
import { Resources } from "@/components/sections/resources";
import { Closing } from "@/components/sections/closing";
import { categoriesWithProducts, productsInCategory } from "@/lib/catalog";

/**
 * The storefront homepage is still a story:
 * Arrival → Understanding → Discovery → Preparation → Product systems → Confidence → Purchase.
 */
export default function Home() {
  const collectionRows = categoriesWithProducts().map((category) => ({
    category,
    products: productsInCategory(category.id).map(({ id, name, status }) => ({ id, name, status })),
  }));

  return (
    <>
      <Nav />
      <main id="main">
        {/* Arrival */}
        <Hero />
        {/* Understanding */}
        <Why />
        {/* Discovery */}
        <Assembly />
        {/* Preparation — start free */}
        <FreeFeature />
        {/* Product systems */}
        <FeaturedSystems />
        <InsideSystems />
        <Collections rows={collectionRows} />
        <BundlesSection />
        {/* Confidence */}
        <Resources />
        {/* Purchase */}
        <Closing />
      </main>
      <Footer />
    </>
  );
}
