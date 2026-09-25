"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Article, ResourceTopic } from "@/lib/data/resources";
import { ResourceCard } from "./resource-card";
import { cn, ease } from "@/lib/utils";

export function ResourceBrowser({ articles, topics }: { articles: Article[]; topics: ResourceTopic[] }) {
  const [topic, setTopic] = useState<ResourceTopic | "All">("All");
  const shown = topic === "All" ? articles : articles.filter((a) => a.topic === topic);
  const available = topics.filter((t) => articles.some((a) => a.topic === t));

  return (
    <div>
      <div role="group" aria-label="Filter guides by topic" className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {(["All", ...available] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={topic === t}
            onClick={() => setTopic(t)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ease-calm",
              topic === t ? "bg-foreground text-background" : "bg-card text-muted-foreground hairline hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} guides
      </p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={topic}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease }}
          className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
        >
          {shown.map((a) => (
            <li key={a.slug}>
              <ResourceCard article={a} />
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
