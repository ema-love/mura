"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight, BookOpen, CornerDownLeft, Gift, LayoutGrid, Package, Search as SearchIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { categoriesWithProducts, isBundle, isFree, visibleProducts } from "@/lib/catalog";
import { articles } from "@/lib/data/resources";
import { cn } from "@/lib/utils";

type Entry = { group: string; title: string; hint: string; href: string; keywords?: string; icon: React.ComponentType<{ className?: string }> };

const index: Entry[] = [
  ...visibleProducts().map((p) => ({
    group: isBundle(p) ? "Bundles" : "Systems",
    title: p.name,
    hint: isFree(p) ? `Free · ${p.summary}` : p.summary,
    href: `/products/${p.slug}`,
    keywords: [...p.includes, ...p.formats].join(" "),
    icon: isFree(p) ? Gift : Package,
  })),
  ...categoriesWithProducts().map((c) => ({ group: "Collections", title: c.name, hint: c.summary, href: `/collections/${c.slug}`, icon: LayoutGrid })),
  ...articles.map((a) => ({ group: "Resources", title: a.title, hint: a.dek, href: `/resources/${a.slug}`, icon: BookOpen })),
];

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const found = q ? index.filter((e) => `${e.title} ${e.hint} ${e.group} ${e.keywords ?? ""}`.toLowerCase().includes(q)) : index.slice(0, 9);
    return found.slice(0, 12);
  }, [query]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (entry?: Entry) => {
    if (!entry) return;
    onOpenChange(false);
    router.push(entry.href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl overflow-hidden p-0" hideClose aria-describedby={undefined}>
        <DialogTitle className="sr-only">Search MÚRÀ</DialogTitle>
        <div className="flex items-center gap-3 border-b px-5">
          <SearchIcon className="size-4 text-muted-foreground" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                go(results[active]);
              }
            }}
            placeholder="Search systems, templates, guides…"
            className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-subtle-foreground"
            role="combobox"
            aria-expanded
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `search-${active}` : undefined}
            aria-label="Search"
          />
          <DialogPrimitive.Close className="rounded-md px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hairline">ESC</DialogPrimitive.Close>
        </div>
        <ul ref={listRef} id="search-results" role="listbox" className="no-scrollbar max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">Nothing found — try “semester”, “budget” or “exam”.</li>
          )}
          {results.map((r, i) => {
            const Icon = r.icon;
            const showGroup = i === 0 || results[i - 1].group !== r.group;
            return (
              <li key={`${r.group}-${r.title}`} role="presentation">
                {showGroup && <p className="eyebrow px-3 pt-3 pb-1.5 !text-[10px]">{r.group}</p>}
                <button
                  id={`search-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(r)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    i === active ? "bg-accent-soft dark:bg-accent" : "",
                  )}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-card hairline">
                    <Icon className="size-4 text-muted-foreground" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{r.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{r.hint}</span>
                  </span>
                  {i === active ? (
                    <CornerDownLeft className="size-3.5 text-muted-foreground" aria-hidden />
                  ) : (
                    <ArrowUpRight className="size-3.5 text-transparent" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
