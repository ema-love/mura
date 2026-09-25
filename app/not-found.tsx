import Link from "next/link";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="grid min-h-[80dvh] place-items-center px-5 pt-24 text-center">
        <div className="max-w-md">
          <p className="eyebrow">404</p>
          <h1 className="headline mt-6 text-5xl">Not here.</h1>
          <p className="lede mt-4">This page doesn&rsquo;t exist — or it has moved. Everything MÚRÀ makes is in the store.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/systems">Browse systems</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
