import { cn } from "@/lib/utils";

/** The MÚRÀ mark: a preparation ring, three-quarters complete, with the sun about to arrive. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-5", className)} aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2.4" />
      <path d="M12 3 A9 9 0 1 1 3 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="5.6" cy="5.6" r="1.7" fill="var(--accent-ink)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-[0.14em]">MÚRÀ</span>
    </span>
  );
}
