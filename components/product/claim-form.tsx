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

/** Free-product claim: email only, delivered by email with a secure download link. */
export function ClaimForm({ productId, productName, className }: { productId: string; productName: string; className?: string }) {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  const claim = useMutation({
    mutationFn: async (values: Values) => {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, productId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "We couldn't send your download. Please try again.");
      return data as { email: string };
    },
  });
  const error = form.formState.errors.email?.message ?? (claim.isError ? claim.error.message : undefined);

  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {claim.isSuccess ? (
          <motion.div key="done" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="status" className="rounded-3xl bg-accent-soft p-5 hairline dark:bg-accent">
            <p className="flex items-center gap-2 font-medium">
              <span className="grid size-6 place-items-center rounded-full bg-foreground text-background">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              Check your inbox
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              We&rsquo;ve emailed your {productName} download link to <span className="text-foreground">{claim.data.email}</span>. It can take a
              minute to arrive — check your spam folder if you don&rsquo;t see it.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0 }}
            noValidate
            onSubmit={form.handleSubmit((v) => claim.mutate(v))}
            aria-label={`Get ${productName} free`}
          >
            <label htmlFor={`claim-${productId}`} className="text-[13px] font-medium text-muted-foreground">
              Where should we send it?
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id={`claim-${productId}`}
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                aria-invalid={!!error}
                aria-describedby={error ? `claim-${productId}-error` : `claim-${productId}-note`}
                className={cn(
                  "h-12 flex-1 rounded-full bg-card px-5 text-[15px] hairline outline-none placeholder:text-subtle-foreground focus-visible:shadow-[0_0_0_1px_var(--ring),0_0_0_5px_var(--accent)]",
                  error && "shadow-[0_0_0_1px_#c0735f]",
                )}
                {...form.register("email")}
              />
              <Button type="submit" size="lg" disabled={claim.isPending} className="sm:w-auto">
                {claim.isPending ? <LoaderCircle className="animate-spin" aria-label="Sending" /> : <>Get it free <ArrowRight /></>}
              </Button>
            </div>
            {error ? (
              <p id={`claim-${productId}-error`} role="alert" className="mt-2 text-xs text-[#b0614f]">
                {error}
              </p>
            ) : (
              <p id={`claim-${productId}-note`} className="mt-2 text-xs text-muted-foreground">
                No payment, no account. We only email you your download.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
