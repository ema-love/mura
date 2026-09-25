"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { cn, ease } from "@/lib/utils";

const checklist = [
  { label: "Admission Letter", done: true },
  { label: "Laptop", done: true },
  { label: "Backpack", done: true },
  { label: "Accommodation", done: true },
  { label: "Student Bank Account", done: false },
  { label: "Passport Photos", done: false },
  { label: "Department Clearance", done: false },
];

/** The floating glass Preparation panel — score, checklist, and one clear next step. */
export function PrepPanel({ className }: { className?: string }) {
  return (
    <motion.aside
      aria-label="Preparation summary"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.3, ease, delay: 1.4 }}
      className={cn("glass w-[300px] rounded-[28px] p-5", className)}
    >
      <div className="motion-safe:animate-float">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow !text-[10px]">Preparation</p>
            <p className="mt-1 text-sm text-muted-foreground">University of Lagos · 2026</p>
          </div>
          <ProgressRing value={83} size={64} stroke={5} />
        </div>

        <ul className="mt-5 space-y-2.5">
          {checklist.map((item, i) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease, delay: 1.8 + i * 0.08 }}
              className="flex items-center gap-3 text-[13px]"
            >
              <span
                className={cn(
                  "grid size-[18px] shrink-0 place-items-center rounded-full",
                  item.done ? "bg-foreground text-background" : "border border-border-strong",
                )}
                aria-hidden
              >
                {item.done && <Check className="size-3" strokeWidth={3} />}
              </span>
              <span className={item.done ? "text-muted-foreground line-through decoration-border-strong" : "text-foreground"}>
                {item.label}
              </span>
              <span className="sr-only">{item.done ? "complete" : "remaining"}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-5 rounded-2xl bg-accent-soft p-3.5 hairline dark:bg-accent">
          <p className="eyebrow !text-[10px] !text-accent-ink">Next recommendation</p>
          <p className="mt-1.5 flex items-center justify-between gap-2 text-[13px] font-medium">
            Complete hostel registration.
            <ArrowRight className="size-3.5 shrink-0 text-accent-ink" aria-hidden />
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
