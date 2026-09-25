"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { stages } from "@/lib/data/timeline";
import { cn, ease } from "@/lib/utils";

export function Timeline() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const stage = stages[active];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const next =
      e.key === "ArrowRight" ? Math.min(active + 1, stages.length - 1)
      : e.key === "ArrowLeft" ? Math.max(active - 1, 0)
      : e.key === "Home" ? 0
      : e.key === "End" ? stages.length - 1
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1240px] px-5">
        <SectionHeading
          id="timeline-title"
          eyebrow="Preparation timeline"
          title="Seven moments. One calm path through them."
          description="Choose where you are. MÚRÀ shows you what matters now, and nothing that doesn't."
        />

        <Reveal className="mt-16 md:mt-24">
          <div className="no-scrollbar -mx-5 overflow-x-auto px-5">
            <div role="tablist" aria-label="Preparation stages" onKeyDown={onKeyDown} className="relative flex min-w-[760px] justify-between pt-2">
              {/* track */}
              <div className="absolute top-[22px] right-[calc(100%/14)] left-[calc(100%/14)] h-px bg-border" aria-hidden>
                <motion.div
                  className="h-full origin-left bg-foreground"
                  animate={{ scaleX: active / (stages.length - 1) }}
                  transition={{ duration: 0.9, ease }}
                />
              </div>
              {stages.map((s, i) => {
                const selected = i === active;
                const passed = i < active;
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`stage-tab-${s.id}`}
                    aria-selected={selected}
                    aria-controls="stage-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    className="group relative flex flex-1 flex-col items-center gap-4 rounded-2xl pb-2 outline-offset-4"
                  >
                    <span
                      className={cn(
                        "relative z-10 grid size-10 place-items-center rounded-full text-[12px] font-medium tabular-nums transition-all duration-500 ease-calm",
                        selected
                          ? "scale-110 bg-foreground text-background shadow-float"
                          : passed
                            ? "bg-foreground text-background"
                            : "bg-background text-muted-foreground hairline group-hover:bg-accent-soft",
                      )}
                    >
                      {passed ? <Check className="size-4" strokeWidth={2.5} /> : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={cn("text-sm font-medium transition-colors", selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id="stage-panel"
            role="tabpanel"
            aria-labelledby={`stage-tab-${stage.id}`}
            className="relative mt-12 overflow-hidden rounded-[32px] bg-card p-8 hairline shadow-soft md:p-14"
          >
            <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full bg-[radial-gradient(closest-side,var(--accent),transparent)] opacity-70" />
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease }}
                className="relative grid gap-10 md:grid-cols-12"
              >
                <div className="md:col-span-7">
                  <p className="eyebrow">
                    {String(active + 1).padStart(2, "0")} · {stage.window}
                  </p>
                  <h3 className="headline mt-5 text-3xl md:text-5xl">{stage.headline}</h3>
                  <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{stage.guidance}</p>
                </div>
                <div className="md:col-span-4 md:col-start-9">
                  <p className="eyebrow">Do this now</p>
                  <ol className="mt-5 space-y-3">
                    {stage.actions.map((a, i) => (
                      <motion.li
                        key={a}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease, delay: 0.15 + i * 0.08 }}
                        className="flex items-start gap-3 rounded-2xl bg-background/70 p-4 text-[15px] hairline"
                      >
                        <span className="mt-0.5 font-mono text-[11px] text-subtle-foreground">{String(i + 1).padStart(2, "0")}</span>
                        {a}
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
