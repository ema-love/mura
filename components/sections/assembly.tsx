"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { DeskScene } from "@/components/scene/desk-scene";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn, ease } from "@/lib/utils";

const beats = [
  { at: 0, title: "It begins with a letter.", body: "Your place is confirmed. Everything from here is preparation." },
  { at: 0.1, title: "Notebook appears.", body: "One for each course. Somewhere for every idea to land." },
  { at: 0.28, title: "Laptop opens.", body: "Portals, assignments, research — ready before registration." },
  { at: 0.48, title: "Backpack slides into place.", body: "Everything you carry, organised by what you'll need first." },
  { at: 0.56, title: "Planner unfolds.", body: "Every deadline, every lecture, every quiet hour — visible." },
  { at: 0.72, title: "Student ID arrives.", body: "You're not preparing to belong. You already do." },
  { at: 0.8, title: "Checklist fills.", body: "The last pieces settle. Nothing forgotten." },
  { at: 0.95, title: "Prepared.", body: "The room is quiet. The morning is yours." },
];

const checklist = [
  { at: 0, label: "Admission letter" },
  { at: 0.14, label: "Notebooks" },
  { at: 0.24, label: "Stationery & USB drive" },
  { at: 0.44, label: "Laptop" },
  { at: 0.54, label: "Backpack" },
  { at: 0.7, label: "Semester planner" },
  { at: 0.78, label: "Student ID" },
  { at: 0.86, label: "Headphones & calculator" },
  { at: 0.92, label: "Water bottle" },
  { at: 0.97, label: "A warm layer" },
];

export function Assembly() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const score = useTransform(scrollYProgress, (v) => {
    // 20% → 45% (laptop) → 73% (planner) → 100% (everything).
    const stops: [number, number][] = [[0.02, 20], [0.46, 45], [0.7, 73], [0.97, 100]];
    if (v <= stops[0][0]) return 20;
    for (let i = 1; i < stops.length; i++) {
      const [x0, y0] = stops[i - 1];
      const [x1, y1] = stops[i];
      if (v <= x1) return y0 + ((v - x0) / (x1 - x0)) * (y1 - y0);
    }
    return 100;
  });
  const [p, setP] = useState(0);

  // Quantise to avoid re-rendering on every scroll frame.
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(Math.round(v * 100) / 100));

  const beatIndex = beats.reduce((acc, b, i) => (p >= b.at ? i : acc), 0);
  const beat = beats[beatIndex];
  const bar = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  return (
    <section ref={ref} aria-labelledby="assembly-title" className="relative h-[520vh]">
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1320px] items-center gap-8 px-5 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          <div className="order-2 lg:order-1">
            <DeskScene mode="assembly" progress={scrollYProgress} />
          </div>

          <div className="order-1 lg:order-2">
            <p className="eyebrow">Living preparation</p>
            <h2 id="assembly-title" className="sr-only">
              Watch your workspace assemble as you prepare
            </h2>
            <div className="relative mt-5 min-h-[7.5rem] sm:min-h-[9rem]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={beat.title}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.6, ease }}
                >
                  <p className="headline text-3xl sm:text-5xl">{beat.title}</p>
                  <p className="mt-3 max-w-sm text-muted-foreground sm:text-lg">{beat.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="glass mt-6 hidden rounded-3xl p-5 sm:block lg:mt-10">
              <div className="flex items-center gap-5">
                <ProgressRing value={score} size={92} stroke={6} />
                <div>
                  <p className="eyebrow !text-[10px]">Preparation score</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {checklist.filter((c) => p >= c.at).length} of {checklist.length} essentials ready
                  </p>
                </div>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-x-4 gap-y-2 text-[13px] xl:grid-cols-2">
                {checklist.map((c) => {
                  const done = p >= c.at;
                  return (
                    <li key={c.label} className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "grid size-4 shrink-0 place-items-center rounded-full transition-all duration-500 ease-calm",
                          done ? "scale-100 bg-foreground text-background" : "scale-90 border border-border-strong",
                        )}
                        aria-hidden
                      >
                        <Check className={cn("size-2.5 transition-opacity", done ? "opacity-100" : "opacity-0")} strokeWidth={3.5} />
                      </span>
                      <span className={cn("truncate transition-colors duration-500", done ? "text-foreground" : "text-subtle-foreground")}>
                        {c.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-6 flex items-center gap-3 sm:hidden">
              <ProgressRing value={score} size={56} stroke={4} />
              <p className="text-sm text-muted-foreground">Preparation score</p>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-border" aria-hidden>
          <motion.div className="h-full bg-accent-ink/60" style={{ width: bar }} />
        </div>
      </div>
    </section>
  );
}
