"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";

const statement = "Student life shouldn’t run on memory. It should run on a system.";

const principles = [
  { title: "Pay once", body: "No subscriptions. The files are yours to keep and reuse." },
  { title: "Delivered by email", body: "A secure download link, straight after checkout. No account needed." },
  { title: "Your format", body: "Printable PDF, Google Sheets or Excel — whichever way you work." },
];

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  // Decide after mount: hydration keeps server-rendered styles, so the switch must happen client-side.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const prefersReduced = useReducedMotion();
  const reduce = mounted && !!prefersReduced;
  const opacity = useTransform(progress, range, [0.14, 1]);
  const blur = useTransform(progress, range, ["blur(3px)", "blur(0px)"]);
  return (
    // With reduced motion, words are simply shown at full contrast.
    // Keyed so the element remounts cleanly once the preference is known after hydration.
    <motion.span key={reduce ? "static" : "animated"} style={reduce ? undefined : { opacity, filter: blur }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

export function Why() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = statement.split(" ");

  return (
    <section aria-labelledby="why-title" className="relative py-32 md:py-48">
      <div className="page">
        <Reveal>
          <p className="eyebrow">Why MÚRÀ exists</p>
        </Reveal>
        <h2 id="why-title" className="sr-only">
          {statement}
        </h2>
        <p ref={ref} aria-hidden className="headline mt-8 max-w-[18ch] text-[clamp(2.5rem,7vw,6.5rem)]">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>

        <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-12">
          <Reveal className="md:col-span-5 md:col-start-6">
            <p className="text-xl leading-relaxed text-pretty text-muted-foreground md:text-2xl md:leading-relaxed">
              Deadlines in group chats. Exam dates in your head. Money that runs out before the month does. MÚRÀ makes the
              planners, trackers and templates that turn all of it into something you can see —{" "}
              <span className="text-foreground">so you always know what to do next.</span>
            </p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-3 md:col-start-11">
            <dl className="space-y-8 border-l pl-6">
              {principles.map((p) => (
                <div key={p.title}>
                  <dt className="text-[15px] font-semibold tracking-[-0.01em]">{p.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
