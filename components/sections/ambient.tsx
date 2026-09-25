import { cn } from "@/lib/utils";

/** Slow-moving morning light. Purely atmospheric; hidden from assistive tech. */
export function Ambient({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -top-[30%] left-[10%] h-[80vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,var(--accent),transparent)] opacity-80 blur-3xl motion-safe:animate-drift dark:opacity-60" />
      <div className="absolute top-[10%] -right-[20%] h-[60vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgb(255_236_210/0.7),transparent)] blur-3xl motion-safe:animate-[drift_34s_ease-in-out_infinite_alternate-reverse] dark:bg-[radial-gradient(closest-side,rgb(109_149_191/0.18),transparent)]" />
      <div className="grain absolute inset-0 opacity-[0.035] dark:opacity-[0.06]" />
    </div>
  );
}
