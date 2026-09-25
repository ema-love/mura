"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { PreviewId } from "@/lib/catalog/types";
import { cn, ease } from "@/lib/utils";

export function Window({ title, meta, className, children }: { title: string; meta?: string; className?: string; children: React.ReactNode }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease }}
      className={cn("glass group relative flex flex-col overflow-hidden rounded-[28px]", className)}
    >
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 motion-safe:group-hover:animate-shimmer dark:via-white/5" />
      <header className="flex items-center justify-between px-5 pt-4 pb-3">
        <p className="text-[13px] font-medium">{title}</p>
        {meta && <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{meta}</span>}
      </header>
      <div className="flex-1 px-5 pb-5">{children}</div>
    </motion.article>
  );
}

function SemesterPlanner() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const blocks = [
    { d: 0, s: 0, l: 2, t: "MTH 101", tone: "bg-accent" },
    { d: 0, s: 3, l: 1, t: "Library", tone: "bg-muted" },
    { d: 1, s: 1, l: 2, t: "CHM 101", tone: "bg-accent" },
    { d: 2, s: 0, l: 1, t: "GST 111", tone: "bg-muted" },
    { d: 2, s: 2, l: 2, t: "PHY 101", tone: "bg-accent" },
    { d: 3, s: 1, l: 1, t: "Lab", tone: "bg-[#e9f3ee] dark:bg-[#1b2a24]" },
    { d: 4, s: 0, l: 2, t: "MTH 101", tone: "bg-accent" },
    { d: 4, s: 3, l: 1, t: "Review", tone: "bg-muted" },
  ];
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {days.map((d, di) => (
        <div key={d}>
          <p className="mb-2 text-center text-[10px] text-muted-foreground">{d}</p>
          <div className="relative grid h-40 grid-rows-4 gap-1.5">
            {blocks
              .filter((b) => b.d === di)
              .map((b) => (
                <div
                  key={`${b.d}-${b.s}`}
                  className={cn("rounded-lg px-1.5 py-1 text-[10px] leading-tight font-medium", b.tone)}
                  style={{ gridRow: `${b.s + 1} / span ${b.l}` }}
                >
                  {b.t}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PackingChecklist() {
  const [items, setItems] = useState([
    { l: "Bedding set", d: true },
    { l: "Extension cord", d: true },
    { l: "Padlock", d: false },
    { l: "Laundry basket", d: false },
    { l: "Desk lamp", d: false },
  ]);
  const done = items.filter((i) => i.d).length;
  return (
    <div>
      <div className="mb-3 h-1 overflow-hidden rounded-full bg-border">
        <motion.div className="h-full rounded-full bg-foreground" animate={{ width: `${(done / items.length) * 100}%` }} transition={{ duration: 0.6, ease }} />
      </div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={it.l}>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-[13px] transition-colors hover:bg-background/60">
              <input
                type="checkbox"
                checked={it.d}
                onChange={() => setItems((prev) => prev.map((p, j) => (j === i ? { ...p, d: !p.d } : p)))}
                className="size-4 cursor-pointer appearance-none rounded-full border border-border-strong transition-colors checked:border-foreground checked:bg-foreground checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4.5 8.2l2.2 2.2 4.8-4.8%22 stroke=%22white%22 stroke-width=%222%22 fill=%22none%22 stroke-linecap=%22round%22/></svg>')] dark:checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4.5 8.2l2.2 2.2 4.8-4.8%22 stroke=%22black%22 stroke-width=%222%22 fill=%22none%22 stroke-linecap=%22round%22/></svg>')]"
              />
              <span className={cn("transition-colors", it.d && "text-muted-foreground line-through")}>{it.l}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BudgetPlanner() {
  const rows = [
    { l: "Rent", v: 42 },
    { l: "Food", v: 28 },
    { l: "Transport", v: 12 },
    { l: "Books & printing", v: 10 },
    { l: "Reserve", v: 8 },
  ];
  return (
    <div>
      <p className="text-3xl font-semibold tracking-[-0.04em] tabular-nums">$1,850</p>
      <p className="text-xs text-muted-foreground">First semester · planned</p>
      <div className="mt-4 flex h-2 overflow-hidden rounded-full">
        {rows.map((r, i) => (
          <motion.div
            key={r.l}
            initial={{ width: 0 }}
            whileInView={{ width: `${r.v}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease, delay: i * 0.08 }}
            className="h-full border-r-2 border-[var(--card)] last:border-0"
            style={{ background: `color-mix(in oklab, var(--accent-ink) ${90 - i * 16}%, transparent)` }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-1.5 text-[12px]">
        {rows.map((r) => (
          <li key={r.l} className="flex justify-between">
            <span className="text-muted-foreground">{r.l}</span>
            <span className="tabular-nums">{r.v}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AssignmentTracker() {
  const rows = [
    { t: "Calculus problem set 1", c: "MTH 101", due: "Mon", s: "Done" },
    { t: "Lab report: titration", c: "CHM 101", due: "Wed", s: "In progress" },
    { t: "Essay outline", c: "GST 111", due: "Fri", s: "Not started" },
  ];
  return (
    <ul className="divide-y divide-[var(--glass-edge)]">
      {rows.map((r) => (
        <li key={r.t} className="flex items-center justify-between gap-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium">{r.t}</p>
            <p className="text-[11px] text-muted-foreground">
              {r.c} · due {r.due}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
              r.s === "Done" ? "bg-foreground text-background" : r.s === "In progress" ? "bg-accent text-accent-ink" : "hairline text-muted-foreground",
            )}
          >
            {r.s}
          </span>
        </li>
      ))}
    </ul>
  );
}

function StudyPlanner() {
  const total = 45 * 60;
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);
  const r = 44;
  const c = 2 * Math.PI * r;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-5">
      <div className="relative grid size-28 place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="var(--accent-ink)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - left / total)}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <span className="font-mono text-xl tabular-nums" role="timer" aria-live="off">
          {mm}:{ss}
        </span>
      </div>
      <div>
        <p className="text-[13px] font-medium">Deep work</p>
        <p className="text-[11px] text-muted-foreground">Chemistry · Ch. 2</p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setRunning((v) => !v)}
            className="grid size-8 place-items-center rounded-full bg-foreground text-background transition-transform active:scale-95"
            aria-label={running ? "Pause focus timer" : "Start focus timer"}
          >
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setLeft(total);
            }}
            className="grid size-8 place-items-center rounded-full hairline transition-transform active:scale-95"
            aria-label="Reset focus timer"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Calendar() {
  // October 2026 starts on a Thursday.
  const offset = 3;
  const events = new Set([6, 9, 15, 21, 28]);
  const today = 14;
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px] tabular-nums">
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: 31 }).map((_, i) => {
          const d = i + 1;
          return (
            <span
              key={d}
              className={cn(
                "relative grid aspect-square place-items-center rounded-full",
                d === today ? "bg-foreground font-medium text-background" : "text-foreground/80",
              )}
            >
              {d}
              {events.has(d) && d !== today && <span className="absolute bottom-0.5 size-1 rounded-full bg-accent-ink" />}
            </span>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">Oct 14 · Midterm exams begin</p>
    </div>
  );
}

function GoalTracker() {
  const goals = [
    { l: "Read 20 pages daily", v: 70 },
    { l: "First-class GPA", v: 45 },
    { l: "Join two societies", v: 50 },
  ];
  return (
    <ul className="space-y-4">
      {goals.map((g, i) => (
        <li key={g.l}>
          <div className="flex justify-between text-[12px]">
            <span>{g.l}</span>
            <span className="text-muted-foreground tabular-nums">{g.v}%</span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-foreground"
              initial={{ width: 0 }}
              whileInView={{ width: `${g.v}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease, delay: i * 0.1 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function ExpenseTracker() {
  const points = [30, 42, 28, 50, 36, 24, 40, 22, 30, 18, 26, 20];
  const max = 60;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * 200} ${60 - (p / max) * 60}`).join(" ");
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-semibold tracking-[-0.04em] tabular-nums">$64.20</p>
        <span className="text-[11px] text-success">−12% vs last week</span>
      </div>
      <svg viewBox="0 0 200 60" className="mt-3 h-16 w-full overflow-visible" aria-hidden>
        <motion.path
          d={path}
          fill="none"
          stroke="var(--accent-ink)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease }}
        />
        <path d={`${path} L200 60 L0 60 Z`} fill="var(--accent)" opacity="0.5" />
      </svg>
      <ul className="mt-3 space-y-1.5 text-[12px]">
        <li className="flex justify-between">
          <span className="text-muted-foreground">Printing</span>
          <span className="tabular-nums">$3.50</span>
        </li>
        <li className="flex justify-between">
          <span className="text-muted-foreground">Lunch</span>
          <span className="tabular-nums">$8.00</span>
        </li>
      </ul>
    </div>
  );
}

function WeeklyReset() {
  const priorities = [
    { t: "Finish lab report draft", d: true },
    { t: "Read chapter 4 before Thursday", d: true },
    { t: "Email tutor about project", d: false },
  ];
  const deadlines = [
    { t: "Essay outline", when: "Wed" },
    { t: "Problem set 3", when: "Fri" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between rounded-2xl bg-background/70 p-3 hairline">
        <div>
          <p className="text-[10px] tracking-wider text-muted-foreground uppercase">Exam countdown</p>
          <p className="text-[13px] font-medium">Statistics midterm</p>
        </div>
        <p className="text-2xl font-semibold tracking-[-0.04em] tabular-nums">
          12<span className="ml-1 text-xs font-medium tracking-normal text-muted-foreground">days</span>
        </p>
      </div>
      <div>
        <p className="mb-2 text-[10px] tracking-wider text-muted-foreground uppercase">This week&rsquo;s priorities</p>
        <ul className="space-y-1.5 text-[13px]">
          {priorities.map((p) => (
            <li key={p.t} className="flex items-center gap-2.5">
              <span className={cn("grid size-4 shrink-0 place-items-center rounded-full", p.d ? "bg-foreground" : "border border-border-strong")} aria-hidden>
                {p.d && (
                  <svg viewBox="0 0 16 16" className="size-2.5">
                    <path d="M4.5 8.2l2.2 2.2 4.8-4.8" stroke="var(--background)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </span>
              <span className={cn(p.d && "text-muted-foreground line-through")}>{p.t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 text-[10px] tracking-wider text-muted-foreground uppercase">Upcoming deadlines</p>
        <ul className="space-y-1.5 text-[12px]">
          {deadlines.map((d) => (
            <li key={d.t} className="flex justify-between">
              <span>{d.t}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{d.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GradeTracker() {
  const rows = [
    { c: "Calculus I", u: 3, g: "A", p: 5 },
    { c: "Intro to Economics", u: 3, g: "B", p: 4 },
    { c: "Academic Writing", u: 2, g: "A", p: 5 },
    { c: "Statistics", u: 3, g: "B", p: 4 },
  ];
  const units = rows.reduce((s, r) => s + r.u, 0);
  const gpa = rows.reduce((s, r) => s + r.u * r.p, 0) / units;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[10px] tracking-wider text-muted-foreground uppercase">Semester GPA</p>
          <p className="text-3xl font-semibold tracking-[-0.04em] tabular-nums">{gpa.toFixed(2)}</p>
        </div>
        <p className="text-[11px] text-muted-foreground">5-point scale · editable</p>
      </div>
      <table className="mt-4 w-full text-[12px]">
        <thead>
          <tr className="text-left text-[10px] tracking-wider text-muted-foreground uppercase">
            <th className="pb-2 font-medium">Course</th>
            <th className="pb-2 text-right font-medium">Units</th>
            <th className="pb-2 text-right font-medium">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--glass-edge)]">
          {rows.map((r) => (
            <tr key={r.c}>
              <td className="py-1.5">{r.c}</td>
              <td className="py-1.5 text-right tabular-nums">{r.u}</td>
              <td className="py-1.5 text-right font-medium">{r.g}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Every product preview, keyed by the id used in the catalogue. */
export const previews: Record<PreviewId, { title: string; meta?: string; wide?: boolean; Component: () => React.JSX.Element }> = {
  "weekly-reset": { title: "Weekly Reset", meta: "Week 6", Component: WeeklyReset },
  "semester-planner": { title: "Semester Planner", meta: "Week 1", wide: true, Component: SemesterPlanner },
  "assignment-tracker": { title: "Assignment Tracker", meta: "3 due", wide: true, Component: AssignmentTracker },
  "study-planner": { title: "Study Planner", meta: "Focus", Component: StudyPlanner },
  "budget-planner": { title: "Budget Planner", Component: BudgetPlanner },
  calendar: { title: "Calendar", meta: "Oct 2026", Component: Calendar },
  "goal-tracker": { title: "Goal Tracker", Component: GoalTracker },
  "expense-tracker": { title: "Expense Tracker", meta: "This week", Component: ExpenseTracker },
  "grade-tracker": { title: "Grade & GPA", meta: "Semester 1", Component: GradeTracker },
  "packing-checklist": { title: "Checklist", meta: "Interactive", Component: PackingChecklist },
};

export function Preview({ id, className }: { id: PreviewId; className?: string }) {
  const { title, meta, Component } = previews[id];
  return (
    <Window title={title} meta={meta} className={className}>
      <Component />
    </Window>
  );
}
