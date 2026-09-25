"use client";

import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";

type ProgressRingProps = {
  /** 0–100, or a motion value for scroll-linked progress. */
  value: number | MotionValue<number>;
  size?: number;
  stroke?: number;
  className?: string;
  label?: string;
  showValue?: boolean;
};

export function ProgressRing({ value, size = 120, stroke = 6, className, label = "Preparation", showValue = true }: ProgressRingProps) {
  const gradientId = useId();
  const isMotion = typeof value !== "number";
  const spring = useSpring(0, { stiffness: 60, damping: 20, mass: 1 });

  useEffect(() => {
    if (!isMotion) {
      spring.set(value as number);
      return;
    }
    const mv = value as MotionValue<number>;
    spring.set(mv.get());
    return mv.on("change", (v) => spring.set(v));
  }, [isMotion, value, spring]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = useTransform(spring, (v) => c - (Math.max(0, Math.min(100, v)) / 100) * c);
  const text = useTransform(spring, (v) => `${Math.round(v)}`);

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${Math.round(isMotion ? (value as MotionValue<number>).get() : (value as number))} percent`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent-ink)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent-ink)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          style={{ strokeDashoffset: dash }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 grid place-items-center" aria-hidden>
          <div className="flex items-start font-semibold tracking-[-0.04em] tabular-nums" style={{ fontSize: size * 0.26 }}>
            <motion.span>{text}</motion.span>
            <span className="mt-[0.18em] text-[0.42em] text-muted-foreground">%</span>
          </div>
        </div>
      )}
    </div>
  );
}
