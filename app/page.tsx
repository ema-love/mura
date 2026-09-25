import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/sections/hero";
import { Assembly } from "@/components/sections/assembly";
import { Why } from "@/components/sections/why";
import { Timeline } from "@/components/sections/timeline";
import { Builder } from "@/components/sections/builder";
import { Universities } from "@/components/sections/universities";
import { Collections } from "@/components/sections/collections";
import { Tools } from "@/components/sections/tools";
import { DashboardPreview } from "@/components/sections/dashboard";
import { Resources } from "@/components/sections/resources";
import { Closing } from "@/components/sections/closing";

/**
 * The homepage is a story, not a storefront:
 * Arrival → Understanding → Planning → Preparation → Confidence → University.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        {/* Arrival */}
        <Hero />
        <Assembly />
        {/* Understanding */}
        <Why />
        <Timeline />
        {/* Planning */}
        <Builder />
        <Universities />
        {/* Preparation */}
        <Collections />
        <Tools />
        {/* Confidence */}
        <DashboardPreview />
        <Resources />
        {/* University */}
        <Closing />
      </main>
      <Footer />
    </>
  );
}
