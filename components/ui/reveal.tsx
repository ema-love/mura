"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { ease } from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  /** Render as a list item when revealing items inside <ul>/<ol>, keeping list semantics valid. */
  as?: "div" | "li";
};

/** Content settles into place as it enters the viewport: arrival, never spectacle. */
export function Reveal({ delay = 0, y = 24, as = "div", children, ...props }: RevealProps) {
  const animation = {
    initial: { opacity: 0, y, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, margin: "0px 0px -12% 0px" },
    transition: { duration: 1.1, ease, delay },
  };

  if (as === "li") {
    const { className, style, id } = props;
    return (
      <motion.li {...animation} className={className} style={style} id={id}>
        {children}
      </motion.li>
    );
  }
  return (
    <motion.div {...animation} {...props}>
      {children}
    </motion.div>
  );
}
