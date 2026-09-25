"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import {
  categoriesWithProducts,
  getCategory,
  isBundle,
  isFree,
  productsInCategory,
  searchProducts,
  type CategoryId,
  type Product,
} from "@/lib/catalog";
import { ProductGrid } from "./product-card";
import { BundleCard } from "./bundle-card";
import { cn, ease } from "@/lib/utils";

const types = [
  { id: "all", label: "Everything" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
  { id: "bundles", label: "Bundles" },
] as const;
type TypeFilter = (typeof types)[number]["id"];

function matchesType(p: Product, t: TypeFilter) {
  if (t === "free") return isFree(p);
  if (t === "paid") return !isFree(p) && !isBundle(p);
  if (t === "bundles") return isBundle(p);
  return true;
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-300 ease-calm",
        active ? "bg-foreground text-background" : "bg-card text-muted-foreground hairline hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Browse, filter and search the catalogue. State lives in the URL (?q=&category=&type=)
 * so every view is shareable — useful when visitors arrive from Pinterest.
 */
export function StoreBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const category = (params.get("category") ?? "all") as CategoryId | "all";
  const type = (types.some((t) => t.id === params.get("type")) ? params.get("type") : "all") as TypeFilter;
  const filtered = q !== "" || category !== "all" || type !== "all";

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(
    () => searchProducts(q).filter((p) => (category === "all" || p.category === category) && matchesType(p, type)),
    [q, category, type],
  );

  const cats = categoriesWithProducts();
  const all = searchProducts("");
  const typeOptions = types.filter((t) => t.id === "all" || all.some((p) => matchesType(p, t.id)));
  const categoryOptions = cats.filter((c) => c.id !== "bundles");

  return (
    <div>
      {/* Controls */}
      <div className="z-20 -mx-2 rounded-[28px] px-2 py-3 lg:sticky lg:top-20">
        <div className="glass flex flex-col gap-3 rounded-[24px] p-3 lg:flex-row lg:items-center">
          <label className="relative flex items-center lg:w-72 lg:shrink-0">
            <span className="sr-only">Search the store</span>
            <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Search systems and templates"
              className="h-11 w-full rounded-full bg-card pr-10 pl-11 text-[14px] hairline outline-none placeholder:text-subtle-foreground focus-visible:shadow-[0_0_0_1px_var(--ring),0_0_0_4px_var(--accent)]"
            />
            {q && (
              <button type="button" onClick={() => set("q", "")} className="absolute right-3 grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-muted" aria-label="Clear search">
                <X className="size-3.5" />
              </button>
            )}
          </label>
          <div role="group" aria-label="Filter by type" className="no-scrollbar -mx-1 flex shrink-0 gap-1.5 overflow-x-auto px-1">
            {typeOptions.map((t) => (
              <Chip key={t.id} active={type === t.id} onClick={() => set("type", t.id)}>
                {t.label}
              </Chip>
            ))}
          </div>
          <span className="hidden h-6 w-px bg-border lg:block" aria-hidden />
          <div role="group" aria-label="Filter by collection" className="no-scrollbar -mx-1 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-1 [mask-image:linear-gradient(90deg,#000_92%,transparent)]">
            <Chip active={category === "all"} onClick={() => set("category", "all")}>
              All collections
            </Chip>
            {categoryOptions.length > 1 &&
              categoryOptions.map((c) => (
                <Chip key={c.id} active={category === c.id} onClick={() => set("category", c.id)}>
                  {c.name}
                </Chip>
              ))}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {filtered ? (
          <motion.div key={`${q}|${category}|${type}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }} className="mt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {results.length} {results.length === 1 ? "result" : "results"}
                {category !== "all" && <> in <span className="text-foreground">{getCategory(category).name}</span></>}
                {q && <> for <span className="text-foreground">&ldquo;{q}&rdquo;</span></>}
              </p>
              <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="text-sm font-medium underline-offset-4 hover:underline">
                Clear filters
              </button>
            </div>
            {results.length ? (
              <ProductGrid products={results} className="mt-10" />
            ) : (
              <div className="mt-10 rounded-[32px] bg-card px-8 py-20 text-center hairline">
                <p className="text-xl font-semibold tracking-[-0.02em]">Nothing matches yet.</p>
                <p className="mt-2 text-muted-foreground">Try a broader word like &ldquo;planner&rdquo;, &ldquo;exam&rdquo; or &ldquo;budget&rdquo;.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {cats.map((c) => {
              const items = productsInCategory(c.id);
              return (
                <section key={c.id} aria-labelledby={`cat-${c.id}`} className="mt-20 border-t pt-12 md:mt-28">
                  <div className="grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-end">
                    <div>
                      <p className="font-mono text-xs text-subtle-foreground tabular-nums">{String(c.order).padStart(2, "0")}</p>
                      <h2 id={`cat-${c.id}`} className="headline mt-3 text-3xl md:text-5xl">
                        {c.name}
                      </h2>
                    </div>
                    <p className="max-w-lg text-muted-foreground md:justify-self-end md:text-right">{c.statement}</p>
                  </div>
                  {c.id === "bundles" ? (
                    <div className="mt-12 grid gap-6 lg:grid-cols-2">
                      {items.map((b) => (
                        <BundleCard key={b.id} bundle={b} layout="stack" className="h-full" />
                      ))}
                    </div>
                  ) : (
                    <ProductGrid products={items} className="mt-12" />
                  )}
                </section>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
