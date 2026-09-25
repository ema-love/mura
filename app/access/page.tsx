import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/ui/reveal";
import { Ambient } from "@/components/sections/ambient";
import { AccessForm } from "@/components/site/access-form";

export const metadata: Metadata = {
  title: "Your purchases",
  description: "Get fresh download links for everything you've received from MÚRÀ. No account or password needed.",
  alternates: { canonical: "/access" },
};

/** "Sign in" without accounts: your email is the key to your downloads. */
export default function AccessPage() {
  return (
    <>
      <Nav />
      <main id="main" className="relative overflow-hidden">
        <Ambient />
        <section aria-labelledby="access-title" className="page relative grid min-h-[80dvh] items-center pt-36 pb-24">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Your purchases</p>
            <h1 id="access-title" className="display mt-6 text-[clamp(2.75rem,7vw,6rem)]">
              Welcome back.
            </h1>
            <p className="lede mt-6">
              MÚRÀ doesn&rsquo;t need an account or a password. Enter the email you used and we&rsquo;ll send fresh download links for
              everything you&rsquo;ve received.
            </p>
            <div className="mt-10 max-w-xl">
              <AccessForm />
            </div>
            <p className="mt-10 text-sm text-muted-foreground">
              Can&rsquo;t find something?{" "}
              <Link href="/about#contact" className="font-medium text-foreground underline-offset-4 hover:underline">
                Contact us
              </Link>{" "}
              and we&rsquo;ll help.
            </p>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
