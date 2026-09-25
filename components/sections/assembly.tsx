"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Check } from "lucide-react";
import { DeskScene } from "@/components/scene/desk-scene";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn, ease } from "@/lib/utils";

const beats = [
  { at: 0, title: "It starts with a timetable.", body: "And a few sticky notes. And a lot to remember." },
  { at: 0.1, title: "Notes find a home.", body: "One place for every course, so nothing gets lost between lectures." },
  { at: 0.28, title: "The semester comes into view.", body: "Weeks, courses and deadlines — visible at a glance." },
  { at: 0.48, title: "Every assignment has a status.", body: "Done, in progress, not started. No more surprises on Friday." },
  { at: 0.56, title: "The week gets a plan.", body: "Priorities first. Study time protected. Room left for rest." },
  { at: 0.76, title: "Grades and money, accounted for.", body: "Know where your GPA stands and where your budget goes." },
  { at: 0.95, title: "You have a system.", body: "This is what prepared feels like." },
];

const checklist = [
  { at: 0, label: "Timetable" },
  { at: 0.14, label: "Course notes" },
  { at: 0.22, label: "Exam countdown" },
  { at: 0.44, label: "Semester overview" },
  { at: 0.54, label: "Assignment tracker" },
  { at: 0.7, label: "Weekly plan" },
  { at: 0.8, label: "Study sessions" },
  { at: 0.88, label: "Grade tracker" },
  { at: 0.95, label: "Student budget" },
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
            <p className="eyebrow">From chaos to a system</p>
            <h2 id="assembly-title" className="sr-only">
              Watch a scattered desk become an organised system
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
                  <p className="eyebrow !text-[10px]">Your system</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {checklist.filter((c) => p >= c.at).length} of {checklist.length} pieces in place
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
              <p className="text-sm text-muted-foreground">Your system</p>
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
