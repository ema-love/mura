"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({ email: z.email({ error: "Enter a valid email address." }) });
type Values = z.infer<typeof schema>;

export function AccessForm() {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  const request = useMutation({
    mutationFn: async (values: Values) => {
      const res = await fetch("/api/access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      return values;
    },
  });
  const error = form.formState.errors.email?.message ?? (request.isError ? request.error.message : undefined);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {request.isSuccess ? (
        <motion.div key="done" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="status" className="rounded-3xl bg-accent-soft p-6 hairline dark:bg-accent">
          <p className="flex items-center gap-2 font-medium">
            <span className="grid size-6 place-items-center rounded-full bg-foreground text-background">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            Check your inbox
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            If <span className="text-foreground">{request.data.email}</span> has MÚRÀ purchases or downloads, we&rsquo;ve emailed fresh links to
            it. It can take a minute — check spam if you don&rsquo;t see it.
          </p>
        </motion.div>
      ) : (
        <motion.form key="form" exit={{ opacity: 0 }} noValidate onSubmit={form.handleSubmit((v) => request.mutate(v))}>
          <label htmlFor="access-email" className="text-[13px] font-medium text-muted-foreground">
            Email used at checkout
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="access-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              aria-invalid={!!error}
              aria-describedby={error ? "access-error" : undefined}
              className={cn(
                "h-12 flex-1 rounded-full bg-card px-5 text-[15px] hairline outline-none placeholder:text-subtle-foreground focus-visible:shadow-[0_0_0_1px_var(--ring),0_0_0_5px_var(--accent)]",
                error && "shadow-[0_0_0_1px_#c0735f]",
              )}
              {...form.register("email")}
            />
            <Button type="submit" size="lg" disabled={request.isPending}>
              {request.isPending ? <LoaderCircle className="animate-spin" aria-label="Sending" /> : <>Email my links <ArrowRight /></>}
            </Button>
          </div>
          {error && (
            <p id="access-error" role="alert" className="mt-2 text-xs text-[#b0614f]">
              {error}
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
