"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { ease } from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Content settles into place as it enters the viewport: arrival, never spectacle. */
export function Reveal({ delay = 0, y = 24, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
