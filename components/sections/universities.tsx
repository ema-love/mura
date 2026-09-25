"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Backpack, BedDouble, BookOpen, Lightbulb, MapPin, Stethoscope, Store, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { universities, type University, type CampusZone } from "@/lib/data/universities";
import { cn, ease } from "@/lib/utils";

async function fetchUniversity(id: string): Promise<University> {
  const res = await fetch(`/api/universities/${id}`);
  if (!res.ok) throw new Error("Unable to load university");
  return res.json();
}

/* Architectural motifs — drawn, not photographed, so every campus shares one visual language. */
function Motif({ motif, tone }: { motif: University["motif"]; tone: University["tone"] }) {
  const stroke = "rgb(31 42 54 / 0.28)";
  const common = { fill: "none", stroke, strokeWidth: 1.2 } as const;
  return (
    <svg viewBox="0 0 240 160" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <defs>
        <linearGradient id={`m-${motif}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={tone[0]} />
          <stop offset="1" stopColor={tone[1]} />
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill={`url(#m-${motif})`} />
      {motif === "arches" &&
        Array.from({ length: 6 }).map((_, i) => (
          <path key={i} {...common} d={`M${20 + i * 36} 160 V96 a16 16 0 0 1 32 0 V160`} />
        ))}
      {motif === "columns" && (
        <g {...common}>
          <path d="M30 70 L120 36 L210 70 Z" />
          <line x1="30" x2="210" y1="76" y2="76" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={42 + i * 30} y="80" width="10" height="80" />
          ))}
        </g>
      )}
      {motif === "tower" && (
        <g {...common}>
          <rect x="104" y="22" width="32" height="138" />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1="104" x2="136" y1={34 + i * 14} y2={34 + i * 14} />
          ))}
          <rect x="44" y="96" width="60" height="64" />
          <rect x="136" y="84" width="70" height="76" />
          {Array.from({ length: 4 }).map((_, i) => (
            <line key={`h${i}`} x1="136" x2="206" y1={96 + i * 16} y2={96 + i * 16} />
          ))}
        </g>
      )}
      {motif === "grid" && (
        <g {...common}>
          {Array.from({ length: 5 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => <rect key={`${r}-${c}`} x={28 + c * 24} y={48 + r * 22} width="20" height="18" rx="2" />),
          )}
        </g>
      )}
      {motif === "steps" && (
        <g {...common}>
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={20 + i * 16} y={70 + i * 15} width={200 - i * 32} height="15" />
          ))}
        </g>
      )}
      {motif === "terraces" && (
        <g {...common}>
          {Array.from({ length: 5 }).map((_, i) => (
            <path key={i} d={`M${10 + i * 12} ${60 + i * 22} H${230 - i * 12} L${220 - i * 12} ${78 + i * 22} H${20 + i * 12} Z`} />
          ))}
        </g>
      )}
      <circle cx="200" cy="34" r="12" fill="#fff" fillOpacity="0.7" />
    </svg>
  );
}

const zoneStyle: Record<CampusZone["kind"], string> = {
  academic: "fill-[var(--accent)] stroke-[var(--accent-ink)]",
  residence: "fill-[var(--muted)] stroke-[var(--foreground)]",
  library: "fill-[var(--accent)] stroke-[var(--accent-ink)]",
  health: "fill-[#e9f3ee] stroke-[#3e7a5c] dark:fill-[#1b2a24]",
  sport: "fill-[var(--card)] stroke-[var(--subtle-foreground)]",
  gate: "fill-[var(--foreground)] stroke-[var(--foreground)]",
  social: "fill-[var(--accent-soft)] stroke-[var(--accent-ink)]",
};

function CampusMap({ zones }: { zones: CampusZone[] }) {
  return (
    <svg viewBox="0 0 100 64" className="size-full" role="img" aria-label="Simplified campus map">
      <defs>
        <pattern id="map-grid" width="4" height="4" patternUnits="userSpaceOnUse">
          <path d="M4 0 H0 V4" fill="none" stroke="var(--border)" strokeWidth="0.2" />
        </pattern>
      </defs>
      <rect width="100" height="64" fill="url(#map-grid)" />
      <path d="M2 31 H98" stroke="var(--border-strong)" strokeWidth="1.2" strokeDasharray="0.1 0" />
      {zones.map((z, i) => (
        <motion.g key={z.label} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease, delay: i * 0.05 }} style={{ transformOrigin: `${z.x + z.w / 2}px ${z.y + z.h / 2}px` }}>
          <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="1.6" strokeWidth="0.25" className={zoneStyle[z.kind]} />
          <text
            x={z.x + 1.6}
            y={z.y + 3.6}
            fontSize="2"
            className={z.kind === "gate" ? "fill-[var(--background)]" : "fill-[var(--foreground)]"}
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            {z.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

function Tile({ icon: Icon, title, className, children }: { icon: React.ComponentType<{ className?: string }>; title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-3xl bg-card p-6 hairline", className)}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <h4 className="eyebrow !text-[10px]">{title}</h4>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-[15px]">
      {items.map((i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent-ink" aria-hidden />
          <span className="text-pretty">{i}</span>
        </li>
      ))}
    </ul>
  );
}

export function Universities() {
  const [selected, setSelected] = useState(universities[0].id);
  const queryClient = useQueryClient();
  const prefetch = (id: string) =>
    queryClient.prefetchQuery({ queryKey: ["university", id], queryFn: () => fetchUniversity(id) });
  const { data, isFetching } = useQuery({
    queryKey: ["university", selected],
    queryFn: () => fetchUniversity(selected),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    const onSelect = (e: Event) => setSelected((e as CustomEvent<string>).detail);
    window.addEventListener("mura:university", onSelect);
    return () => window.removeEventListener("mura:university", onSelect);
  }, []);

  return (
    <section id="universities" aria-labelledby="uni-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1240px] px-5">
        <SectionHeading
          id="uni-title"
          eyebrow="University explorer"
          title="Every campus has its own rhythm. Arrive knowing it."
          description="Hostel realities, packing lists, clearance requirements and the quiet advice seniors wish they'd had."
        />
      </div>

      <Reveal className="mt-14 md:mt-20">
        <div role="radiogroup" aria-label="Choose a university" className="no-scrollbar mx-auto flex max-w-[1240px] snap-x gap-4 overflow-x-auto px-5 pt-4 pb-6">
          {universities.map((u) => {
            const active = u.id === selected;
            return (
              <button
                key={u.id}
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(u.id)}
                // Warm the cache on intent so selection feels instant.
                onPointerEnter={() => prefetch(u.id)}
                onFocus={() => prefetch(u.id)}
                className={cn(
                  "group relative h-72 w-56 shrink-0 snap-start overflow-hidden rounded-[28px] text-left transition-all duration-500 ease-calm md:w-[188px]",
                  active ? "-translate-y-2 shadow-float ring-2 ring-foreground/80 ring-offset-4 ring-offset-background" : "hover:-translate-y-1 hover:shadow-soft",
                )}
              >
                <Motif motif={u.motif} tone={u.tone} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                <div className="absolute inset-x-0 top-0 p-5">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-[#1f2a36]/60">EST. {u.established}</p>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-2xl font-semibold tracking-[-0.03em]">{u.short}</p>
                  <p className="mt-0.5 text-xs text-white/80">{u.city}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Reveal>

      <div className="mx-auto mt-8 max-w-[1240px] px-5">
        <div className={cn("transition-opacity duration-300", isFetching && "opacity-70")} aria-busy={isFetching}>
          <AnimatePresence mode="wait">
            {data && (
              <motion.div
                key={data.id}
                initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.55, ease }}
                className="grid gap-4 md:grid-cols-6"
              >
                <div className="relative overflow-hidden rounded-3xl bg-foreground p-8 text-background md:col-span-4 md:p-10">
                  <p className="font-mono text-[11px] tracking-[0.18em] text-background/60 uppercase">University guide</p>
                  <h3 className="headline mt-4 text-3xl md:text-4xl">{data.name}</h3>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-background/60">
                    <MapPin className="size-3.5" /> {data.city}
                  </p>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-background/85">{data.guide}</p>
                </div>

                <Tile icon={BedDouble} title="Hostel" className="md:col-span-2">
                  <p className="text-[15px] font-medium text-pretty">{data.hostel.summary}</p>
                  <div className="mt-4 text-muted-foreground">
                    <List items={data.hostel.notes} />
                  </div>
                </Tile>

                <Tile icon={MapPin} title="Campus map" className="md:col-span-3">
                  <div className="aspect-[100/64] overflow-hidden rounded-2xl bg-background hairline">
                    <CampusMap zones={data.map} />
                  </div>
                </Tile>

                <div className="flex flex-col gap-4 md:col-span-3">
                  <Tile icon={Backpack} title="Pack for this campus" className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {data.packing.map((p) => (
                        <span key={p} className="rounded-full bg-accent-soft px-3 py-1.5 text-sm hairline dark:bg-accent">
                          {p}
                        </span>
                      ))}
                    </div>
                  </Tile>
                  <Tile icon={BookOpen} title="Department resources" className="flex-1">
                    <div className="flex flex-wrap gap-2">
                      {data.departments.map((d) => (
                        <span key={d} className="rounded-full px-3 py-1.5 text-sm hairline">
                          {d}
                        </span>
                      ))}
                    </div>
                  </Tile>
                </div>

                <Tile icon={Lightbulb} title="Student tips" className="md:col-span-2">
                  <List items={data.tips} />
                </Tile>
                <Tile icon={Stethoscope} title="Medical requirements" className="md:col-span-2">
                  <List items={data.medical} />
                </Tile>
                <Tile icon={Store} title="Nearby stores" className="md:col-span-2">
                  <ul className="space-y-3">
                    {data.stores.map((s) => (
                      <li key={s.name}>
                        <p className="text-[15px] font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.note}</p>
                      </li>
                    ))}
                  </ul>
                </Tile>

                <Tile icon={Users} title="Freshers communities" className="md:col-span-6">
                  <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {data.communities.map((c) => (
                      <li key={c.name} className="rounded-2xl bg-background p-4 hairline">
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
                      </li>
                    ))}
                  </ul>
                </Tile>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-6 text-xs text-subtle-foreground">
          Guidance is general and changes each session. Always confirm requirements with your university&rsquo;s official admissions office.
        </p>
      </div>
    </section>
  );
}
