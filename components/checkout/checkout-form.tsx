"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, LoaderCircle, Lock } from "lucide-react";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({ email: z.email({ error: "Enter a valid email address." }) });
type Values = z.infer<typeof schema>;

/** Email, then off to Flutterwave's secure payment page. Card details never touch MÚRÀ. */
export function CheckoutForm({ productId, productName }: { productId: string; productName: string }) {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  const start = useMutation({
    mutationFn: async (values: Values) => {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, productId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.link) throw new Error(data.error ?? "We couldn't start checkout. Please try again.");
      return data as { link: string };
    },
    onSuccess: ({ link }) => window.location.assign(link),
  });
  const error = form.formState.errors.email?.message ?? (start.isError ? start.error.message : undefined);
  const busy = start.isPending || start.isSuccess;

  return (
    <form noValidate onSubmit={form.handleSubmit((v) => start.mutate(v))} aria-label={`Buy ${productName}`}>
      <label htmlFor="checkout-email" className="text-[13px] font-medium text-muted-foreground">
        Email for your download
      </label>
      <input
        id="checkout-email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@example.com"
        aria-invalid={!!error}
        aria-describedby={error ? "checkout-email-error" : "checkout-email-note"}
        className={cn(
          "mt-2 h-12 w-full rounded-full bg-card px-5 text-[15px] hairline outline-none placeholder:text-subtle-foreground focus-visible:shadow-[0_0_0_1px_var(--ring),0_0_0_5px_var(--accent)]",
          error && "shadow-[0_0_0_1px_#c0735f]",
        )}
        {...form.register("email")}
      />
      {error ? (
        <p id="checkout-email-error" role="alert" className="mt-2 text-xs text-[#b0614f]">
          {error}
        </p>
      ) : (
        <p id="checkout-email-note" className="mt-2 text-xs text-muted-foreground">
          We send your download link here. Please check it&rsquo;s correct.
        </p>
      )}

      <Button type="submit" size="lg" disabled={busy} className="mt-6 w-full">
        {busy ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden /> Opening secure payment…
          </>
        ) : (
          <>
            Continue to payment <ArrowRight />
          </>
        )}
      </Button>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
        <span>
          Payment is handled securely by Flutterwave. By continuing, you agree to the{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/refunds" className="underline underline-offset-4 hover:text-foreground">
            Refund Policy
          </Link>
          .
        </span>
      </p>
    </form>
  );
}
