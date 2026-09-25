"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Ambient } from "./ambient";
import { ease } from "@/lib/utils";

export function Closing() {
  return (
    <section aria-labelledby="closing-title" className="relative flex min-h-dvh items-center overflow-hidden py-32">
      <Ambient />
      <div className="relative mx-auto max-w-[1240px] px-5 text-center">
        <motion.h2
          id="closing-title"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 1.6, ease }}
          className="display text-[clamp(2.75rem,8vw,8rem)]"
        >
          The first day shouldn&rsquo;t feel uncertain.
          <span className="mt-4 block text-muted-foreground">It should feel prepared.</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
          className="mt-14"
        >
          <Button asChild size="xl">
            <Link href="/#builder">
              Prepare Yourself
              <ArrowRight className="transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
