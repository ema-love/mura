import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Reveal } from "@/components/ui/reveal";
import { Ambient } from "@/components/sections/ambient";
import { categoriesWithProducts, productsInCategory } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Explore collections",
  description: "Curated MÚRÀ collections for academic life, study, university life, careers and opportunities.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsIndex() {
  const cats = categoriesWithProducts();
  return (
    <>
      <Nav />
      <main id="main">
        <section aria-labelledby="explore-title" className="relative overflow-hidden pt-36 pb-16 md:pt-44">
          <Ambient />
          <div className="page relative">
            <Reveal>
              <p className="eyebrow">Explore</p>
              <h1 id="explore-title" className="display mt-6 text-[clamp(3rem,9vw,8rem)]">
                Collections.
              </h1>
              <p className="lede mt-6 max-w-2xl">Each collection is built around one part of student life, and every system in it works alongside the others.</p>
            </Reveal>
          </div>
        </section>

        <div className="page pb-section">
          <ul className="grid gap-6 md:grid-cols-2">
            {cats.map((c, i) => {
              const items = productsInCategory(c.id);
              const live = items.filter((p) => p.status === "published").length;
              return (
                <Reveal as="li" key={c.id} delay={(i % 2) * 0.06} className={i === 0 ? "md:col-span-2" : ""}>
                  <div className="group relative h-full overflow-hidden rounded-[32px] hairline transition-shadow duration-700 hover:shadow-float">
                    <div
                      className={i === 0 ? "relative min-h-[360px] p-8 md:p-12" : "relative min-h-[300px] p-8 md:p-10"}
                      style={{ background: `linear-gradient(140deg, ${c.tone[0]}, ${c.tone[1]})` }}
                    >
                      <div className="grain absolute inset-0 opacity-[0.08] mix-blend-multiply" aria-hidden />
                      <div className="relative flex h-full flex-col text-[#1f1f1f]">
                        <p className="font-mono text-xs text-black/40 tabular-nums">{String(c.order).padStart(2, "0")}</p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] md:text-5xl">
                          <Link href={`/collections/${c.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                            {c.name}
                          </Link>
                        </h2>
                        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-black/60">{c.statement}</p>
                        <ul className={i === 0 ? "mt-8 flex max-w-2xl flex-wrap gap-2" : "mt-8 flex flex-wrap gap-2"} aria-label={`In ${c.name}`}>
                          {items.slice(0, i === 0 ? 8 : 5).map((p) => (
                            <li key={p.id} className="rounded-full bg-white/75 px-3.5 py-1.5 text-[13px] font-medium shadow-[0_6px_16px_-10px_rgb(32_28_20/0.35)]">
                              {p.name.replace(/^(Mura|MURA) /, "")}
                            </li>
                          ))}
                          {items.length > (i === 0 ? 8 : 5) && <li className="px-2 py-1.5 text-[13px] text-black/50">+ {items.length - (i === 0 ? 8 : 5)} more</li>}
                        </ul>
                        <div className="mt-auto flex items-end justify-between gap-4 pt-12">
                          <p className="text-sm text-black/55">
                            {items.length} {items.length === 1 ? "piece" : "pieces"}
                            {live > 0 && live < items.length && ` · ${live} available now`}
                          </p>
                          <span className="grid size-10 place-items-center rounded-full bg-[#1f1f1f] text-white transition-transform duration-500 group-hover:-rotate-45" aria-hidden>
                            <ArrowUpRight className="size-4 rotate-45" />
                          </span>
                        </div>
                      </div>
                    </div>
                    <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[32px] ring-2 ring-transparent transition group-has-[:focus-visible]:ring-ring" />
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
