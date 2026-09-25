"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { LogoMark } from "@/components/site/logo";
import { builderSchema, budgets, courses, ownableIds, type BuilderInput, type BuilderResult } from "@/lib/builder";
import { universities } from "@/lib/data/universities";
import { getEssential } from "@/lib/data/essentials";
import { cn, ease } from "@/lib/utils";

type Step = keyof BuilderInput;
type Option = { value: string | boolean; label: string; note?: string };

const steps: { field: Step; question: string; options: Option[]; multi?: boolean }[] = [
  {
    field: "university",
    question: "Which university are you going to?",
    options: universities.map((u) => ({ value: u.id, label: u.short, note: u.city })),
  },
  {
    field: "course",
    question: "Lovely. What will you be studying?",
    options: courses.map((c) => ({ value: c.id, label: c.label })),
  },
  {
    field: "residence",
    question: "Will you live in a hostel or off-campus?",
    options: [
      { value: "hostel", label: "Hostel", note: "On campus, shared room" },
      { value: "off-campus", label: "Off-campus", note: "Lodge or family home" },
    ],
  },
  {
    field: "budget",
    question: "What budget feels comfortable for your preparation?",
    options: budgets.map((b) => ({ value: b.id, label: b.label, note: b.note })),
  },
  {
    field: "hasLaptop",
    question: "Do you already own a laptop?",
    options: [
      { value: true, label: "Yes, I have one" },
      { value: false, label: "Not yet" },
    ],
  },
  {
    field: "owned",
    question: "Last one. Which of these do you already have?",
    options: ownableIds.map((id) => ({ value: id, label: getEssential(id).name })),
    multi: true,
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function labelFor(field: Step, value: unknown): string {
  const step = steps.find((s) => s.field === field)!;
  if (field === "owned") {
    const list = value as string[];
    return list.length ? list.map((v) => getEssential(v).name).join(", ") : "Nothing yet";
  }
  return step.options.find((o) => o.value === value)?.label ?? String(value);
}

export function Builder() {
  const form = useForm<BuilderInput>({
    resolver: zodResolver(builderSchema),
    defaultValues: { owned: [] },
    mode: "onChange",
  });
  const values = useWatch({ control: form.control });
  const [step, setStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: async (input: BuilderInput) => {
      const [res] = await Promise.all([
        fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        }),
        sleep(1400), // a considered pause reads as thought, not latency
      ]);
      if (!res.ok) throw new Error("We couldn't build your pack. Please try again.");
      return (await res.json()) as BuilderResult;
    },
  });

  const current = steps[step];
  const done = step >= steps.length;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [step, mutation.status]);

  const answer = async (value: string | boolean) => {
    form.setValue(current.field, value as never, { shouldValidate: true });
    const ok = await form.trigger(current.field);
    if (ok) setStep((s) => s + 1);
  };

  const toggleOwned = (id: string) => {
    const owned = form.getValues("owned");
    form.setValue("owned", owned.includes(id) ? owned.filter((o) => o !== id) : [...owned, id]);
  };

  const finish = form.handleSubmit((data) => {
    setStep(steps.length);
    mutation.mutate(data);
  });

  const restart = () => {
    form.reset({ owned: [] });
    mutation.reset();
    setStep(0);
  };

  return (
    <section id="builder" aria-labelledby="builder-title" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-[1240px] px-5">
        <SectionHeading
          id="builder-title"
          eyebrow="Preparation builder"
          title="Six questions. One pack, made for you."
          description="Tell MÚRÀ a little about your next chapter. We'll anticipate the rest — and explain every recommendation."
        />

        <Reveal className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-[1.25fr_1fr]">
          {/* Conversation */}
          <div className="glass flex h-[640px] flex-col overflow-hidden rounded-[32px]">
            <div className="flex items-center justify-between border-b border-[var(--glass-edge)] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-card hairline">
                  <LogoMark className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">MÚRÀ</p>
                  <p className="text-xs text-muted-foreground">Preparation assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {Math.min(step + 1, steps.length)}/{steps.length}
                </span>
                <div className="flex gap-1" aria-hidden>
                  {steps.map((_, i) => (
                    <span key={i} className={cn("h-1 w-4 rounded-full transition-colors duration-500", i < step ? "bg-foreground" : "bg-border-strong")} />
                  ))}
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-6 py-6" aria-live="polite">
              <Bubble from="mura">Hi — I&rsquo;m here to make sure nothing is forgotten. We&rsquo;ll take this one question at a time.</Bubble>

              {steps.slice(0, step).map((s) => (
                <div key={s.field} className="space-y-3">
                  <Bubble from="mura">{s.question}</Bubble>
                  <Bubble from="you">{labelFor(s.field, values[s.field])}</Bubble>
                </div>
              ))}

              {!done && (
                <motion.div key={current.field} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="space-y-4">
                  <Bubble from="mura">{current.question}</Bubble>
                  <fieldset className="pl-11">
                    <legend className="sr-only">{current.question}</legend>
                    <div className={cn("grid gap-2", current.options.length > 4 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
                      {current.options.map((o, i) => {
                        const selected = current.multi ? (values.owned ?? []).includes(o.value as string) : false;
                        return (
                          <motion.button
                            key={String(o.value)}
                            type="button"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease, delay: 0.15 + i * 0.035 }}
                            onClick={() => (current.multi ? toggleOwned(o.value as string) : answer(o.value))}
                            aria-pressed={current.multi ? selected : undefined}
                            className={cn(
                              "group flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-300 ease-calm hover:-translate-y-px",
                              selected ? "bg-foreground text-background" : "bg-card hairline hover:shadow-soft",
                            )}
                          >
                            <span>
                              <span className="block font-medium">{o.label}</span>
                              {o.note && <span className={cn("block text-xs", selected ? "text-background/70" : "text-muted-foreground")}>{o.note}</span>}
                            </span>
                            {current.multi && (
                              <span className={cn("grid size-4 shrink-0 place-items-center rounded-full", selected ? "bg-background text-foreground" : "border border-border-strong")}>
                                {selected && <Check className="size-2.5" strokeWidth={3.5} />}
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    {current.multi && (
                      <Button type="button" className="mt-4" onClick={finish}>
                        {(values.owned ?? []).length ? "Build my pack" : "I have none of these yet"}
                        <ArrowRight />
                      </Button>
                    )}
                    {Object.values(form.formState.errors)[0]?.message && (
                      <p className="mt-3 text-xs text-[#b0614f]">{String(Object.values(form.formState.errors)[0]?.message)}</p>
                    )}
                  </fieldset>
                </motion.div>
              )}

              {done && mutation.isPending && (
                <Bubble from="mura">
                  <span className="flex items-center gap-1.5 py-1" aria-label="Thinking">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-1.5 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}
                      />
                    ))}
                  </span>
                </Bubble>
              )}

              {mutation.isError && (
                <Bubble from="mura">
                  {mutation.error.message}{" "}
                  <button className="underline" onClick={() => mutation.mutate(form.getValues())}>
                    Try again
                  </button>
                </Bubble>
              )}

              {mutation.isSuccess && (
                <div className="space-y-3">
                  <Bubble from="mura">
                    Here&rsquo;s your pack for <strong className="font-medium">{mutation.data.university}</strong>. {mutation.data.recommendations.length} items,
                    ordered by what you&rsquo;ll need first.
                  </Bubble>
                  <ul className="space-y-2 pl-11">
                    {mutation.data.recommendations.map((r, i) => (
                      <motion.li
                        key={r.item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease, delay: 0.2 + i * 0.07 }}
                        className="flex items-start justify-between gap-4 rounded-2xl bg-card px-4 py-3 hairline"
                      >
                        <span>
                          <span className="block text-sm font-medium">{r.item.name}</span>
                          <span className="block text-xs text-muted-foreground">{r.reason}</span>
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase",
                            r.priority === "now" ? "bg-accent text-accent-ink" : "text-muted-foreground hairline",
                          )}
                        >
                          {r.priority}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Backpack */}
          <PackPanel result={mutation.data} pending={mutation.isPending} onRestart={restart} answered={Math.min(step, steps.length)} total={steps.length} />
        </Reveal>
      </div>
    </section>
  );
}

function Bubble({ from, children }: { from: "mura" | "you"; children: React.ReactNode }) {
  if (from === "you") {
    return (
      <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease }} className="flex justify-end">
        <p className="max-w-[80%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-sm text-background">{children}</p>
      </motion.div>
    );
  }
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-card hairline" aria-hidden>
        <LogoMark className="size-3.5" />
      </span>
      <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-card/80 px-4 py-2.5 text-[15px] leading-relaxed hairline">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function PackPanel({
  result,
  pending,
  onRestart,
  answered,
  total,
}: {
  result?: BuilderResult;
  pending: boolean;
  onRestart: () => void;
  answered: number;
  total: number;
}) {
  const items = useMemo(() => result?.recommendations ?? [], [result]);
  const [packed, setPacked] = useState(0);

  useEffect(() => {
    setPacked(0);
    if (!items.length) return;
    let n = 0;
    const t = window.setInterval(() => {
      n += 1;
      setPacked(n);
      if (n >= items.length) window.clearInterval(t);
    }, 260);
    return () => window.clearInterval(t);
  }, [items]);

  const before = result?.scoreBefore ?? 0;
  // Answering questions is itself preparation: the score grows gently, then climbs as the pack fills.
  const score = result
    ? Math.round(before + ((100 - before) * packed) / Math.max(items.length, 1))
    : Math.round((answered / total) * 18);
  const fill = result ? 0.15 + 0.75 * (packed / Math.max(items.length, 1)) : 0.08;
  const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

  return (
    <div className="relative flex h-[640px] flex-col overflow-hidden rounded-[32px] bg-card p-6 hairline shadow-soft">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-32 h-80 bg-[radial-gradient(closest-side,var(--accent),transparent)] opacity-80" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="eyebrow">Your pack</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {result ? `${packed} of ${items.length} packed` : pending ? "Thinking it through…" : "Answer to begin packing"}
          </p>
        </div>
        <ProgressRing value={score} size={76} stroke={5} />
      </div>

      {/* Backpack, front view. Items fall in through the open top. */}
      <div className="relative mx-auto mt-4 flex w-full max-w-[300px] flex-1 items-end justify-center">
        <div className="relative aspect-[5/6] w-full">
          {/* falling items */}
          <div className="absolute inset-x-[18%] top-[-6%] h-[40%]">
            <AnimatePresence>
              {items.slice(0, packed).slice(-4).map((r, i) => (
                <motion.span
                  key={r.item.id}
                  initial={{ opacity: 0, y: -60, rotate: i % 2 ? 6 : -6 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [-60, 0, 40, 90], rotate: 0 }}
                  transition={{ duration: 1.1, ease: "easeIn", times: [0, 0.2, 0.6, 1] }}
                  className="absolute left-1/2 -translate-x-1/2 rounded-full bg-background px-3 py-1 text-xs font-medium whitespace-nowrap shadow-soft hairline"
                >
                  {r.item.name}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <svg viewBox="0 0 250 300" className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <linearGradient id="pack-body" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#6E7680" />
                <stop offset="1" stopColor="#3F454D" />
              </linearGradient>
              <linearGradient id="pack-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#DCEEFF" />
                <stop offset="1" stopColor="#9DB8D6" />
              </linearGradient>
              <clipPath id="pack-inner">
                <path d="M40 70 C40 56 52 48 66 48 L184 48 C198 48 210 56 210 70 L218 272 C218 286 206 294 192 294 L58 294 C44 294 32 286 32 272 Z" />
              </clipPath>
            </defs>
            <path d="M95 44 C95 14 155 14 155 44" fill="none" stroke="#353A41" strokeWidth="10" strokeLinecap="round" />
            <path d="M40 70 C40 56 52 48 66 48 L184 48 C198 48 210 56 210 70 L218 272 C218 286 206 294 192 294 L58 294 C44 294 32 286 32 272 Z" fill="url(#pack-body)" />
            {/* the fill level rises as items are packed */}
            <g clipPath="url(#pack-inner)">
              <motion.rect
                x="0"
                width="250"
                height="300"
                fill="url(#pack-fill)"
                initial={false}
                animate={{ y: 300 - 250 * fill }}
                transition={{ duration: 0.8, ease }}
                opacity="0.9"
              />
            </g>
            <path d="M58 150 C58 140 66 134 78 134 L172 134 C184 134 192 140 192 150 L196 262 C196 274 188 280 176 280 L74 280 C62 280 54 274 54 262 Z" fill="#4B525A" fillOpacity="0.55" />
            <line x1="70" x2="180" y1="154" y2="154" stroke="#2B2F35" strokeWidth="4" strokeLinecap="round" />
            <rect x="108" y="84" width="34" height="38" rx="7" fill="#A77A53" />
            <path d="M44 60 C60 44 190 44 206 60" fill="none" stroke="#2B2F35" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="relative mt-5 rounded-2xl bg-background/70 p-4 hairline">
        <AnimatePresence mode="wait" initial={false}>
          {result ? (
            <motion.div key="result" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow !text-[10px] !text-accent-ink">Next action</p>
                <p className="mt-1 text-sm font-medium">{result.nextAction}</p>
                <p className="mt-1 text-xs text-muted-foreground">Estimated total · {naira.format(result.budgetTotal)}</p>
              </div>
              <Button variant="secondary" size="icon" onClick={onRestart} aria-label="Start again">
                <RotateCcw />
              </Button>
            </motion.div>
          ) : (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
              Every recommendation comes with a reason. Nothing you already own, nothing you won&rsquo;t use.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
