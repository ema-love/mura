import { cn } from "@/lib/utils";
import type { Article } from "@/lib/data/resources";

/** Material covers: paper, linen, stone, walnut, glass, morning light — tactile, never stock. */
const surfaces: Record<Article["cover"], string> = {
  paper: "bg-[linear-gradient(160deg,#fbfaf6,#ebe7dd)]",
  linen: "bg-[linear-gradient(160deg,#e9e4d8,#d6cfbf)]",
  stone: "bg-[linear-gradient(160deg,#e3e3df,#c7c6c0)]",
  walnut: "bg-[linear-gradient(120deg,#5b3b27,#7a5236_60%,#5a3a26)]",
  glass: "bg-[linear-gradient(160deg,#eef5fc,#cfe0f1)]",
  morning: "bg-[linear-gradient(160deg,#fdf4e7,#e2ebe2)]",
};

export function Cover({ kind, title, className }: { kind: Article["cover"]; title?: string; className?: string }) {
  const dark = kind === "walnut";
  return (
    <div className={cn("relative overflow-hidden rounded-[28px] hairline", surfaces[kind], className)} aria-hidden>
      <div className={cn("grain absolute inset-0", kind === "linen" ? "opacity-25 mix-blend-multiply" : "opacity-15 mix-blend-multiply", dark && "opacity-30 mix-blend-overlay")} />
      {kind === "linen" && <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(0_0_0/0.025)_0_1px,transparent_1px_3px),repeating-linear-gradient(90deg,rgb(0_0_0/0.02)_0_1px,transparent_1px_3px)]" />}
      {kind === "glass" && <div className="absolute top-[18%] left-[14%] h-[64%] w-[46%] rounded-3xl bg-white/50 shadow-[inset_0_1px_0_white,0_30px_60px_-20px_rgb(61_92_71/0.4)] backdrop-blur" />}
      {kind === "morning" && <div className="absolute -top-1/4 -left-1/4 h-full w-3/4 -skew-x-12 bg-[linear-gradient(90deg,rgb(255_244_222/0.9),transparent)] blur-2xl" />}
      {kind === "stone" && <div className="absolute right-[12%] bottom-[14%] size-[38%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#f4f3f0,#b6b4ad)] shadow-[20px_24px_40px_-12px_rgb(0_0_0/0.25)]" />}
      {kind === "paper" && (
        <div className="absolute top-[16%] left-[12%] h-[70%] w-[44%] rotate-[-4deg] rounded bg-white shadow-[16px_20px_40px_-16px_rgb(0_0_0/0.25)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="mx-[12%] mt-[9%] h-[3px] rounded-full bg-black/10" />
          ))}
        </div>
      )}
      {title && (
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <p className={cn("text-3xl font-semibold tracking-[-0.035em]", dark ? "text-white/90" : "text-[#1f1f1f]/80")}>{title}</p>
        </div>
      )}
      <span className={cn("absolute top-5 right-6 font-mono text-[10px] tracking-[0.2em]", dark ? "text-white/50" : "text-black/40")}>MÚRÀ GUIDE</span>
    </div>
  );
}
