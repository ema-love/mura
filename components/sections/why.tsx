"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { essentials } from "@/lib/data/essentials";
import { stages } from "@/lib/data/timeline";

const statement =
  "University shouldn’t begin with uncertainty. It should begin with confidence.";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const blur = useTransform(progress, range, ["blur(3px)", "blur(0px)"]);
  return (
    <motion.span style={{ opacity, filter: blur }} className="inline-block">
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
      <div className="mx-auto max-w-[1240px] px-5">
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
              MÚRÀ exists to help students prepare thoughtfully so they can spend less time worrying and more time{" "}
              <span className="text-foreground">becoming.</span>
            </p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-3 md:col-start-11">
            <dl className="space-y-8 border-l pl-6">
              {[
                ["6", "questions to a personal plan"],
                [String(essentials.length), "essentials, each with a reason"],
                [String(stages.length), "stages from letter to thriving"],
              ].map(([n, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd>
                    <span className="block text-4xl font-semibold tracking-[-0.04em] tabular-nums">{n}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
