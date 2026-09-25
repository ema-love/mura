import type { Season } from "@/lib/season/seasons";
import { cn } from "@/lib/utils";

/** A single, quiet seasonal mark. Decorative only. */
export function SeasonalMark({ mark, className }: { mark: Season["mark"]; className?: string }) {
  if (!mark) return null;
  const paths: Record<NonNullable<Season["mark"]>, React.ReactNode> = {
    heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
    leaf: <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zm0 0 7-7" />,
    star: <path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18" />,
    pencil: <path d="M4 20l1-4L16 5l3 3L8 19l-4 1zM14 7l3 3" />,
  };
  return (
    <svg viewBox="0 0 24 24" className={cn("size-3.5 fill-none stroke-current stroke-[1.6]", className)} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[mark]}
    </svg>
  );
}
