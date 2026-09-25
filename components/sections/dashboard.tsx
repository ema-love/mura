"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Calendar, Home, LayoutGrid, ListChecks, Settings, Sparkles, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProgressRing } from "@/components/ui/progress-ring";
import { LogoMark } from "@/components/site/logo";
import { cn } from "@/lib/utils";

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const sidebar = [
  { icon: Home, label: "Today", active: true },
  { icon: ListChecks, label: "Checklist" },
  { icon: Calendar, label: "Planner" },
  { icon: Wallet, label: "Budget" },
  { icon: LayoutGrid, label: "Resources" },
];

const remaining = ["Student bank account", "Passport photographs (×8)", "Department clearance", "Mattress protector"];

const suggestions = [
  "Hostel allocation opens Friday. Set a reminder for 9:00.",
  "Your budget has room for a desk lamp — power cuts are common in Moremi Hall.",
  "Three freshers from your department joined this week.",
];

const tasks = [
  { t: "Upload passport photograph", d: "Today", done: true },
  { t: "Pay acceptance fee", d: "Tomorrow", done: false },
  { t: "Book travel to Lagos", d: "Thu", done: false },
  { t: "Medical screening", d: "Oct 6", done: false },
];

export function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 25%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0.4, 1]);
  const [hello, setHello] = useState("Good evening");
  useEffect(() => setHello(greeting(new Date().getHours())), []);

  return (
    <section id="dashboard" aria-labelledby="dashboard-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1240px] px-5">
        <SectionHeading
          id="dashboard-title"
          eyebrow="Your dashboard"
          title="Everything, in the order you need it."
          description="A single place that knows how prepared you are, what's left, and what to do next — and quietly keeps up as things change."
          align="center"
        />
      </div>

      <div ref={ref} className="mx-auto mt-16 max-w-[1240px] px-3 sm:px-5 md:mt-24" style={{ perspective: "1800px" }}>
        <motion.div
          style={{ rotateX, scale, opacity, transformOrigin: "50% 0%" }}
          className="overflow-hidden rounded-[28px] bg-card shadow-float hairline md:rounded-[36px]"
          role="img"
          aria-label="Preview of the MÚRÀ student dashboard showing 84% preparation, 18 days until semester, a recommendation, remaining checklist, AI suggestions and upcoming tasks."
        >
          <div className="flex">
            <aside className="hidden w-56 shrink-0 border-r bg-background/50 p-5 md:block" aria-hidden>
              <div className="flex items-center gap-2 px-2">
                <LogoMark />
                <span className="text-sm font-semibold tracking-[0.14em]">MÚRÀ</span>
              </div>
              <ul className="mt-8 space-y-1">
                {sidebar.map(({ icon: Icon, label, active }) => (
                  <li
                    key={label}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-[13px]",
                      active ? "bg-card font-medium shadow-soft hairline" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </li>
                ))}
              </ul>
              <div className="mt-40 flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] text-muted-foreground">
                <Settings className="size-4" /> Settings
              </div>
            </aside>

            <div className="min-w-0 flex-1 p-5 sm:p-8 md:p-10" aria-hidden>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Saturday, 26 September</p>
                  <p className="headline mt-1 text-3xl sm:text-4xl">{hello}, Mercy.</p>
                </div>
                <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-ink">University of Lagos · Engineering</span>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <div className="flex items-center gap-5 rounded-3xl bg-background p-5 hairline">
                  <ProgressRing value={84} size={92} stroke={6} />
                  <div>
                    <p className="eyebrow !text-[10px]">Preparation progress</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">22 of 26 essentials</p>
                  </div>
                </div>
                <div className="rounded-3xl bg-background p-5 hairline">
                  <p className="eyebrow !text-[10px]">Semester begins in</p>
                  <p className="mt-2 text-5xl font-semibold tracking-[-0.05em] tabular-nums">
                    18<span className="ml-1.5 text-lg font-medium tracking-normal text-muted-foreground">days</span>
                  </p>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < 6 ? "bg-foreground" : "bg-border")} />
                    ))}
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-3xl bg-foreground p-5 text-background">
                  <p className="font-mono text-[10px] tracking-[0.18em] text-background/60 uppercase">Today&rsquo;s recommendation</p>
                  <p className="mt-2 text-lg leading-snug font-medium">Complete hostel registration before allocation opens.</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-background/70">
                    Takes about 10 minutes <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl bg-background p-5 hairline">
                  <p className="eyebrow !text-[10px]">Remaining checklist</p>
                  <ul className="mt-4 space-y-2.5 text-[13px]">
                    {remaining.map((r) => (
                      <li key={r} className="flex items-center gap-3">
                        <span className="size-4 shrink-0 rounded-full border border-border-strong" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl bg-accent-soft p-5 hairline dark:bg-accent">
                  <p className="eyebrow flex items-center gap-1.5 !text-[10px] !text-accent-ink">
                    <Sparkles className="size-3" /> AI suggestions
                  </p>
                  <ul className="mt-4 space-y-3 text-[13px] leading-relaxed">
                    {suggestions.map((s) => (
                      <li key={s} className="text-pretty">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl bg-background p-5 hairline">
                  <p className="eyebrow !text-[10px]">Upcoming tasks</p>
                  <ul className="mt-4 space-y-2.5 text-[13px]">
                    {tasks.map((t) => (
                      <li key={t.t} className="flex items-center justify-between gap-3">
                        <span className={cn("truncate", t.done && "text-muted-foreground line-through")}>{t.t}</span>
                        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{t.d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
