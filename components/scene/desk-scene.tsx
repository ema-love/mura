"use client";

import { useEffect, type ReactNode } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn, ease } from "@/lib/utils";
import {
  BudgetSheet,
  Calculator,
  Headphones,
  LaptopBase,
  LaptopLid,
  LaptopScreen,
  MechanicalPencil,
  Notebook,
  Phone,
  PlannerCover,
  PlannerPage,
  PrintedSchedule,
  StickyNotes,
  StudentId,
  Tablet,
} from "./objects";

/** The desk is laid out on a fixed 1600 × 1000 plan, then scaled fluidly. */
const W = 1600;
const H = 1000;

type Entrance = "fade" | "drop" | "slide-left" | "slide-right" | "rise";

export type Placement = {
  id: SceneObjectId;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Parallax depth: higher objects move more with the cursor. */
  depth: number;
  entrance: Entrance;
  /** Scroll progress (0–1) at which this object arrives during assembly. */
  at: number;
};

export type SceneObjectId =
  | "schedule"
  | "sticky"
  | "phone"
  | "pencil"
  | "id"
  | "notebook"
  | "calculator"
  | "headphones"
  | "laptop"
  | "planner"
  | "tablet"
  | "budget";

// Knolled: everything parallel, everything with room to breathe.
export const layout: Placement[] = [
  { id: "schedule", x: 80, y: 70, w: 250, h: 350, depth: 0.5, entrance: "drop", at: 0 },
  { id: "sticky", x: 380, y: 78, w: 120, h: 120, depth: 0.6, entrance: "fade", at: 0 },
  { id: "notebook", x: 80, y: 470, w: 230, h: 310, depth: 0.7, entrance: "rise", at: 0.1 },
  { id: "phone", x: 392, y: 238, w: 96, h: 196, depth: 0.9, entrance: "drop", at: 0.16 },
  { id: "pencil", x: 380, y: 906, w: 380, h: 20, depth: 0.9, entrance: "slide-left", at: 0.2 },
  { id: "laptop", x: 800, y: 500, w: 420, h: 290, depth: 1, entrance: "rise", at: 0.28 },
  { id: "tablet", x: 1270, y: 70, w: 270, h: 363, depth: 1.1, entrance: "slide-right", at: 0.48 },
  { id: "planner", x: 380, y: 616, w: 190, h: 250, depth: 0.6, entrance: "rise", at: 0.52 },
  { id: "id", x: 80, y: 816, w: 220, h: 174, depth: 0.9, entrance: "drop", at: 0.72 },
  { id: "headphones", x: 700, y: 64, w: 264, h: 220, depth: 0.9, entrance: "drop", at: 0.78 },
  { id: "calculator", x: 600, y: 344, w: 130, h: 199, depth: 0.7, entrance: "rise", at: 0.84 },
  { id: "budget", x: 1276, y: 506, w: 258, h: 337, depth: 0.8, entrance: "slide-right", at: 0.9 },
];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const entranceFrom: Record<Entrance, { x?: number; y?: number; scale?: number; rotate?: number }> = {
  fade: { scale: 0.96 },
  drop: { y: -40, scale: 1.04, rotate: -2 },
  rise: { y: 40 },
  "slide-left": { x: -60 },
  "slide-right": { x: 80 },
};

/* ------------------------------------------------------------------ */

function ObjectArt({ id, lid, fold }: { id: SceneObjectId; lid: MotionValue<number>; fold: MotionValue<number> }) {
  switch (id) {
    case "schedule":
      return <PrintedSchedule className="size-full" />;
    case "sticky":
      return <StickyNotes className="size-full" />;
    case "phone":
      return <Phone className="size-full" />;
    case "pencil":
      return <MechanicalPencil className="size-full" />;
    case "id":
      return <StudentId className="size-full" />;
    case "notebook":
      return <Notebook className="size-full" />;
    case "calculator":
      return <Calculator className="size-full" />;
    case "headphones":
      return <Headphones className="size-full" />;
    case "tablet":
      return <Tablet className="size-full" />;
    case "budget":
      return <BudgetSheet className="size-full" />;
    case "laptop":
      return <Laptop lid={lid} />;
    case "planner":
      return <Planner fold={fold} />;
  }
}

/** Laptop with a real 3D hinge: the lid swings up and reveals the screen. */
function Laptop({ lid }: { lid: MotionValue<number> }) {
  return (
    <div className="relative size-full">
      <LaptopBase className="absolute inset-0 size-full" />
      <div className="absolute inset-0" style={{ perspective: "1100px", perspectiveOrigin: "50% 100%" }}>
        <motion.div
          className="absolute inset-0"
          style={{ rotateX: lid, transformOrigin: "50% 0%", transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <LaptopLid className="size-full" />
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: "rotateX(180deg)" }}>
            <LaptopScreen className="size-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** Planner spread: the right page is hinged on the spine and folds open. */
function Planner({ fold }: { fold: MotionValue<number> }) {
  return (
    <div className="relative size-full">
      <PlannerPage side="left" className="absolute inset-0 size-full" />
      <div className="absolute inset-0" style={{ perspective: "1400px" }}>
        <motion.div
          className="absolute top-0 left-full h-full w-full"
          style={{ rotateY: fold, transformOrigin: "0% 50%", transformStyle: "preserve-3d" }}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <PlannerPage side="right" className="size-full" />
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>
            <PlannerCover className="size-full" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DeskSurface({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative size-full overflow-hidden rounded-[clamp(18px,2.2vw,36px)]",
        "shadow-[0_2px_0_0_rgb(255_255_255/0.2)_inset,0_-2px_0_0_rgb(0_0_0/0.25)_inset,0_50px_100px_-40px_rgb(40_22_10/0.55),0_20px_40px_-20px_rgb(40_22_10/0.4)]",
        className,
      )}
    >
      {/* walnut */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,#5b3b27_0%,#6e4a31_30%,#634129_55%,#714c33_80%,#5a3a26_100%)] dark:brightness-[0.62] dark:saturate-[0.8]" />
      <svg className="absolute inset-0 size-full opacity-60 mix-blend-soft-light dark:opacity-40" preserveAspectRatio="none" aria-hidden>
        <filter id="walnut-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.085" numOctaves="4" seed="7" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="gamma" exponent="1.6" amplitude="1.2" />
            <feFuncG type="gamma" exponent="1.6" amplitude="1.2" />
            <feFuncB type="gamma" exponent="1.6" amplitude="1.2" />
          </feComponentTransfer>
        </filter>
        <rect width="100%" height="100%" filter="url(#walnut-grain)" />
      </svg>
      <div className="grain absolute inset-0 opacity-[0.18] mix-blend-overlay" />
      {/* morning light from the left, with the soft shadow of a window frame */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_0%_20%,rgb(255_236_205/0.55),transparent_60%)] mix-blend-soft-light dark:bg-[radial-gradient(120%_90%_at_0%_20%,rgb(169_201_236/0.35),transparent_60%)]" />
      <div className="pointer-events-none absolute -inset-[10%] motion-safe:animate-[drift_40s_ease-in-out_infinite_alternate]">
        <div className="absolute top-[-4%] left-[-10%] h-[116%] w-[54%] -skew-x-[16deg] opacity-45 mix-blend-soft-light dark:opacity-30">
          <div className="grid size-full grid-cols-2 grid-rows-2 gap-[4%] blur-[14px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[linear-gradient(90deg,rgb(255_243_222/0.95),rgb(255_243_222/0.35))] dark:bg-[linear-gradient(90deg,rgb(200_222_246/0.8),rgb(200_222_246/0.2))]" />
            ))}
          </div>
        </div>
      </div>
      {/* bevelled edge */}
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.06),inset_0_0_60px_rgb(20_10_4/0.35)]" />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */

type DeskSceneProps = {
  /** Hero: fully set, cursor parallax. Assembly: scroll-driven arrival. */
  mode: "hero" | "assembly";
  /** 0–1 scroll progress, required in assembly mode. */
  progress?: MotionValue<number>;
  className?: string;
};

export function DeskScene({ mode, progress, className }: DeskSceneProps) {
  const reduce = useReducedMotion();
  const fallback = useMotionValue(1);
  const p = progress ?? fallback;

  // Cursor parallax (hero only).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 50, damping: 18, mass: 0.8 });
  const tiltX = useTransform(sy, (v) => v * -3);
  const tiltY = useTransform(sx, (v) => v * 4);

  useEffect(() => {
    if (mode !== "hero" || reduce) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode, reduce, mx, my]);

  // Laptop lid and planner fold: open in the hero, scroll-linked in assembly.
  const lidAssembly = useTransform(p, (v) => 112 * clamp01((v - 0.34) / 0.12));
  const foldAssembly = useTransform(p, (v) => -180 + 180 * clamp01((v - 0.58) / 0.12));
  const lidHero = useMotionValue(reduce ? 112 : 0);
  const foldHero = useMotionValue(reduce ? 0 : -180);

  useEffect(() => {
    if (mode !== "hero" || reduce) return;
    // After the desk settles, the laptop opens and the planner unfolds.
    const t = window.setTimeout(() => {
      animate(lidHero, 112, { duration: 1.8, ease });
      animate(foldHero, 0, { duration: 1.6, ease, delay: 0.35 });
    }, 1300);
    return () => window.clearTimeout(t);
  }, [mode, reduce, lidHero, foldHero]);

  const lid = mode === "hero" ? lidHero : lidAssembly;
  const fold = mode === "hero" ? foldHero : foldAssembly;

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ perspective: "2200px" }}
      role="img"
      aria-label="A walnut desk in morning light, neatly laid out with a printed timetable, a laptop and tablet showing MÚRÀ systems, a planner, a notebook, a budget sheet and other study essentials."
    >
      <motion.div
        className="relative w-full"
        style={{
          aspectRatio: `${W} / ${H}`,
          rotateX: mode === "hero" ? tiltX : 0,
          rotateY: mode === "hero" ? tiltY : 0,
          transformStyle: "preserve-3d",
        }}
      >
        <DeskSurface>
          {layout.map((o, i) => (
            <SceneObject
              key={o.id}
              placement={o}
              index={i}
              mode={mode}
              progress={p}
              sx={sx}
              sy={sy}
              reduce={!!reduce}
            >
              <ObjectArt id={o.id} lid={lid} fold={fold} />
            </SceneObject>
          ))}
        </DeskSurface>
      </motion.div>
    </div>
  );
}

function SceneObject({
  placement: o,
  index,
  mode,
  progress,
  sx,
  sy,
  reduce,
  children,
}: {
  placement: Placement;
  index: number;
  mode: "hero" | "assembly";
  progress: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  reduce: boolean;
  children: ReactNode;
}) {
  const from = entranceFrom[o.entrance];
  const start = o.at;
  const end = Math.min(1, o.at + 0.07);

  // Assembly: each object arrives over a short window of scroll.
  // Function transforms keep these on the main thread; Framer's native
  // scroll-timeline acceleration mis-maps target-relative offsets here.
  const ramp = (a: number, b: number) => (v: number) => {
    const t = Math.min(1, Math.max(0, (v - start) / (end - start)));
    const eased = 1 - Math.pow(1 - t, 3);
    return a + (b - a) * eased;
  };
  const aOpacity = useTransform(progress, start === 0 ? () => 1 : ramp(0, 1));
  const aX = useTransform(progress, ramp(from.x ?? 0, 0));
  const aY = useTransform(progress, ramp(from.y ?? 0, 0));
  const aScale = useTransform(progress, ramp(from.scale ?? 1, 1));
  const aRotate = useTransform(progress, ramp(from.rotate ?? 0, 0));

  // Hero: gentle parallax proportional to depth.
  const pX = useTransform(sx, (v) => v * o.depth * 10);
  const pY = useTransform(sy, (v) => v * o.depth * 8);

  const box = {
    left: pct(o.x, W),
    top: pct(o.y, H),
    width: pct(o.w, W),
    height: pct(o.h, H),
  };

  const shadow =
    "drop-shadow(0.35vw 0.45vw 0.5vw rgb(28 14 4 / 0.34)) drop-shadow(0.06vw 0.08vw 0.06vw rgb(28 14 4 / 0.35))";

  if (mode === "assembly") {
    return (
      <motion.div
        className="absolute will-change-transform dark:brightness-[0.9]"
        style={{ ...box, opacity: aOpacity, x: aX, y: aY, scale: aScale, rotate: aRotate, filter: shadow }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div className="absolute dark:brightness-[0.9]" style={{ ...box, x: pX, y: pY }}>
      <motion.div
        className="size-full"
        style={{ filter: shadow }}
        initial={reduce ? false : { opacity: 0, ...from }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, ease, delay: 0.25 + index * 0.07 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
