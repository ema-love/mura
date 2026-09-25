"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.4 9.3-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.6 1.3 1.4 0 .9-.5 2.2-.8 3.4-.2 1 .5 1.9 1.5 1.9 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.8-4.2-4.3-4.2-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.2c0 .2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8.9.3 2 .5 3 .5 5.5 0 10-4.5 10-10S17.5 2 12 2z"
      />
    </svg>
  );
}

/** Save to Pinterest (with the tall 2:3 image) or copy the link. No tracking scripts. */
export function ShareRow({ url, pinUrl, label = "Share" }: { url: string; pinUrl: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the link stays visible in the address bar */
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-muted-foreground">{label}</span>
      <a
        href={pinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 items-center gap-2 rounded-full bg-card px-4 text-[13px] font-medium hairline transition-colors hover:bg-accent-soft"
      >
        <PinterestIcon className="size-4" /> Save to Pinterest
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 items-center gap-2 rounded-full bg-card px-4 text-[13px] font-medium hairline transition-colors hover:bg-accent-soft"
      >
        {copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
