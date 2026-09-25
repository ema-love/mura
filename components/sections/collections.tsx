"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import type { Category, Product } from "@/lib/catalog/types";
import { cn, ease } from "@/lib/utils";

type Row = { category: Category; products: Pick<Product, "id" | "name" | "status">[] };

/** Categories as curated collections — an editorial index, not a shelf. */
export function Collections({ rows }: { rows: Row[] }) {
  const [open, setOpen] = useState(rows[0]?.category.id);

  return (
    <section id="collections" aria-labelledby="collections-title" className="relative py-section">
      <div className="page">
        <SectionHeading
          id="collections-title"
          eyebrow="Collections"
          title="A system for every part of student life."
          description="From your first week of term to your first internship application."
        />

        <Reveal className="mt-16 border-t md:mt-24">
          <ul>
            {rows.map(({ category: c, products }, i) => {
              const expanded = open === c.id;
              return (
                <li key={c.id} className="border-b">
                  <h3>
                    <button
                      onClick={() => setOpen(c.id)}
                      aria-expanded={expanded}
                      aria-controls={`collection-${c.id}`}
                      className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-7 text-left md:grid-cols-[4rem_1fr_18rem_auto] md:py-9"
                    >
                      <span className="font-mono text-xs text-subtle-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span
                        className={cn(
                          "text-3xl font-semibold tracking-[-0.035em] transition-colors duration-500 md:text-5xl",
                          expanded ? "text-foreground" : "text-subtle-foreground group-hover:text-foreground",
                        )}
                      >
                        {c.name}
                      </span>
                      <span className="hidden text-sm text-muted-foreground md:block">{c.summary}</span>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">{products.length}</span>
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
                              href={`/collections/${c.slug}`}
                              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
                            >
                              Explore {c.name} <ArrowUpRight className="size-4" aria-hidden />
                            </Link>
                          </div>
                          <StillLife items={products} tone={c.tone} />
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

/** The collection's pieces, composed like an exhibit. */
function StillLife({ items, tone }: { items: Row["products"]; tone: [string, string] }) {
  return (
    <div
      className="relative min-h-56 overflow-hidden rounded-[28px] p-6 dark:opacity-90"
      style={{ background: `linear-gradient(135deg, ${tone[0]}, ${tone[1]})` }}
    >
      <div className="grain absolute inset-0 opacity-[0.08] mix-blend-multiply" aria-hidden />
      <div aria-hidden className="absolute -right-10 -bottom-16 size-64 rounded-full bg-white/50 blur-2xl" />
      <ul className="relative flex h-full flex-wrap content-end gap-2">
        {items.slice(0, 12).map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.05 }}
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#1f1f1f] shadow-[0_8px_20px_-10px_rgb(32_28_20/0.35)] backdrop-blur"
          >
            {item.name.replace(/^(Mura|MURA) /, "")}
            {item.status === "upcoming" && <span className="ml-1.5 text-xs font-normal text-black/45">· soon</span>}
          </motion.li>
        ))}
        {items.length > 12 && <li className="px-2 py-2 text-sm text-[#1f1f1f]/60">+ {items.length - 12} more</li>}
      </ul>
    </div>
  );
}
