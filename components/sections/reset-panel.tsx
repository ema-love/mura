"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn, ease } from "@/lib/utils";

const priorities = [
  { label: "Submit lab report", done: true },
  { label: "Read chapter 4", done: true },
  { label: "Plan essay outline", done: true },
  { label: "Review statistics notes", done: false },
  { label: "Email project group", done: false },
];

/** A floating preview of the free Student Reset — labelled as the product it is. */
export function ResetPanel({ className }: { className?: string }) {
  return (
    <motion.aside
      aria-label="Preview of Mura Student Reset, a free weekly reset kit"
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.3, ease, delay: 1.4 }}
      className={cn("glass w-[300px] rounded-[28px] p-5", className)}
    >
      <div className="motion-safe:animate-float">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow !text-[10px]">Inside Student Reset</p>
            <p className="mt-1 text-sm font-medium">This week&rsquo;s priorities</p>
          </div>
          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] tracking-wider text-accent-ink">FREE</span>
        </div>

        <ul className="mt-5 space-y-2.5">
          {priorities.map((item, i) => (
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
            </motion.li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-accent-soft p-3.5 hairline dark:bg-accent">
          <div>
            <p className="eyebrow !text-[10px] !text-accent-ink">Exam countdown</p>
            <p className="mt-1 text-[13px] font-medium">Statistics midterm</p>
          </div>
          <p className="text-2xl font-semibold tracking-[-0.04em] tabular-nums">
            12<span className="ml-1 text-xs font-medium tracking-normal text-muted-foreground">days</span>
          </p>
        </div>

        <Link
          href="/products/student-reset"
          className="mt-4 flex items-center justify-between rounded-full px-1 text-[13px] font-medium underline-offset-4 hover:underline"
        >
          Get the Student Reset free
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </motion.aside>
  );
}
