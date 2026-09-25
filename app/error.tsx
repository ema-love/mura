"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/logo";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="grid min-h-dvh place-items-center px-5 text-center">
      <div className="max-w-md">
        <LogoMark className="mx-auto size-8" />
        <h1 className="headline mt-8 text-4xl md:text-5xl">Something didn&rsquo;t load.</h1>
        <p className="lede mt-4">It&rsquo;s on our side, not yours. Try again, or head back to the store.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={() => retry()}>
            Try again
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/systems">Browse systems</Link>
          </Button>
        </div>
        {error.digest && <p className="mt-8 font-mono text-xs text-subtle-foreground">Reference: {error.digest}</p>}
      </div>
    </main>
  );
}
