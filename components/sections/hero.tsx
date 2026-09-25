"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeskScene } from "@/components/scene/desk-scene";
import { PrepPanel } from "./prep-panel";
import { Ambient } from "./ambient";
import { ease } from "@/lib/utils";

const headline = ["Prepare", "yourself."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const deskScale = useTransform(scrollYProgress, [0, 0.6], [0.94, 1]);
  const deskY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.35], [0, -40]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative overflow-hidden pt-32 pb-24 sm:pt-40 md:pb-32">
      <Ambient />
      <motion.div style={{ opacity: copyOpacity, y: copyY }} className="relative mx-auto max-w-[1240px] px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.2 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full bg-card/70 py-1.5 pr-3.5 pl-2 text-[12px] font-medium text-muted-foreground hairline backdrop-blur"
        >
          <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] tracking-wider text-accent-ink">MÚRÀ</span>
          Moo-rah · <em className="not-italic text-foreground">prepare yourself</em>
        </motion.p>

        <h1 id="hero-title" className="display mt-8 text-[clamp(3.5rem,11vw,10.5rem)]">
          {headline.map((word, i) => (
            <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "105%", opacity: 0, filter: "blur(12px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.4, ease, delay: 0.3 + i * 0.12 }}
              >
                {word}
                {i === 0 && " "}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.7 }}
          className="lede mx-auto mt-7 max-w-xl"
        >
          Everything you need before your first day at university.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.85 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="xl">
            <Link href="/#builder">
              Find Your Pack
              <ArrowRight className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="secondary">
            <Link href="/#resources">Explore Resources</Link>
          </Button>
        </motion.div>
      </motion.div>

      <div className="relative mx-auto mt-16 max-w-[1320px] px-3 sm:px-5 md:mt-24">
        <motion.div style={{ scale: deskScale, y: deskY }} className="relative origin-top">
          <div className="-mx-[18%] sm:mx-0">
            <DeskScene mode="hero" />
          </div>
          <PrepPanel className="absolute -right-2 -bottom-16 hidden lg:block xl:-right-8" />
        </motion.div>
        <PrepPanel className="mx-auto mt-10 lg:hidden" />
      </div>
    </section>
  );
}
