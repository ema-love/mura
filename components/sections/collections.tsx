"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { collections } from "@/lib/data/collections";
import { cn, ease } from "@/lib/utils";

export function Collections() {
  const [open, setOpen] = useState(collections[0].id);

  return (
    <section id="collections" aria-labelledby="collections-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1240px] px-5">
        <SectionHeading
          id="collections-title"
          eyebrow="Curated preparation"
          title="Collections, not catalogues."
          description="Each collection is edited by discipline — assembled around the first weeks of a real programme, so you arrive with exactly what the work asks for."
        />

        <Reveal className="mt-16 border-t md:mt-24">
          <ul>
            {collections.map((c, i) => {
              const expanded = open === c.id;
              return (
                <li key={c.id} className="border-b">
                  <h3>
                    <button
                      onClick={() => setOpen(c.id)}
                      aria-expanded={expanded}
                      aria-controls={`collection-${c.id}`}
                      className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-7 text-left md:grid-cols-[4rem_1fr_16rem_auto] md:py-9"
                    >
                      <span className="font-mono text-xs text-subtle-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={cn(
                          "text-3xl font-semibold tracking-[-0.035em] transition-colors duration-500 md:text-5xl",
                          expanded ? "text-foreground" : "text-subtle-foreground group-hover:text-foreground",
                        )}
                      >
                        {c.title}
                      </span>
                      <span className="hidden text-sm text-muted-foreground md:block">{c.for}</span>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">{c.pieces} pieces</span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        id={`collection-${c.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.7, ease }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-x-4 gap-y-8 pb-10 md:grid-cols-[4rem_1fr_1fr] md:pb-14">
                          <span />
                          <div>
                            <p className="max-w-md text-xl leading-relaxed text-pretty text-muted-foreground">{c.statement}</p>
                            <Link
                              href="/#builder"
                              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                            >
                              Prepare with this collection <ArrowUpRight className="size-4" />
                            </Link>
                          </div>
                          <StillLife items={c.items} tone={c.tone} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/** A composed arrangement of the collection's pieces — presented like an exhibit, not a shelf. */
function StillLife({ items, tone }: { items: string[]; tone: [string, string] }) {
  return (
    <div
      className="relative aspect-[5/3] overflow-hidden rounded-[28px] p-6 dark:opacity-90"
      style={{ background: `linear-gradient(135deg, ${tone[0]}, ${tone[1]})` }}
    >
      <div className="grain absolute inset-0 opacity-[0.08] mix-blend-multiply" aria-hidden />
      <div aria-hidden className="absolute -right-10 -bottom-16 size-64 rounded-full bg-white/50 blur-2xl" />
      <ul className="relative flex h-full flex-wrap content-end gap-2">
        {items.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.06 }}
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1f1f1f] shadow-[0_8px_20px_-10px_rgb(32_28_20/0.35)] backdrop-blur"
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
