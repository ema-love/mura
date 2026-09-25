import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/logo";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <LogoMark className="mx-auto size-8" />
        <h1 className="headline mt-8 text-5xl">Not here — yet.</h1>
        <p className="lede mt-4">This page hasn&rsquo;t been prepared. Let&rsquo;s get you somewhere that has.</p>
        <Button asChild className="mt-10">
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </main>
  );
}
