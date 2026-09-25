import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { ProductArt } from "@/components/store/product-art";
import { checkDownload } from "@/lib/server/downloads";

export const metadata: Metadata = { title: "Your download", robots: { index: false, follow: false } };

const messages = {
  expired: { title: "This link has expired.", body: "Download links stay active for a few days. Request a fresh one — it only takes a moment." },
  invalid: { title: "This link isn't valid.", body: "It may have been copied incompletely. Request a fresh link with the email you used." },
  "not-paid": { title: "This order isn't complete.", body: "We couldn't confirm payment for this order. If you've been charged, contact us and we'll sort it out." },
  limit: { title: "Download limit reached.", body: "This link has been used many times. Request a fresh one, or contact us if you need help." },
  unavailable: { title: "This file is being prepared.", body: "It isn't available just yet. Please try again soon, or contact us if you need it urgently." },
} as const;

export default async function DownloadPage(props: PageProps<"/downloads/[token]">) {
  const { token } = await props.params;
  const check = await checkDownload(token);

  return (
    <>
      <Nav />
      <main id="main" className="page grid min-h-[80dvh] place-items-center pt-32 pb-24">
        {check.ok ? (
          <div className="grid w-full max-w-4xl items-center gap-10 md:grid-cols-[1fr_1.1fr]">
            <ProductArt product={check.product} showPreview={false} className="aspect-[4/5]" />
            <div>
              <p className="eyebrow">Your download</p>
              <h1 className="headline mt-5 text-4xl md:text-5xl">{check.product.name}</h1>
              <p className="mt-4 text-muted-foreground">Ready when you are. This link is private to you — please don&rsquo;t share it.</p>
              <Button asChild size="xl" className="mt-8">
                <a href={`/api/download/${encodeURIComponent(token)}`} download>
                  <ArrowDownToLine /> Download
                </a>
              </Button>
              <p className="mt-6 text-sm text-muted-foreground">
                Formats: {check.product.formats.join(", ")}. Need it again later?{" "}
                <Link href="/access" className="font-medium text-foreground underline-offset-4 hover:underline">
                  Get a fresh link
                </Link>
                .
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-xl text-center">
            <p className="eyebrow">Your download</p>
            <h1 className="headline mt-5 text-4xl md:text-5xl">{messages[check.reason].title}</h1>
            <p className="lede mt-5">{messages[check.reason].body}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/access">
                  Get a fresh link <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/about#contact">Contact us</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
