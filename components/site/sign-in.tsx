"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoMark } from "./logo";
import { signInSchema, type SignInInput } from "@/lib/auth-schema";

export function SignInDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const form = useForm<SignInInput>({ resolver: zodResolver(signInSchema), defaultValues: { email: "" } });

  const mutation = useMutation({
    mutationFn: async (values: SignInInput) => {
      const res = await fetch("/api/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      return (await res.json()) as { email: string };
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      mutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-8">
        <AnimatePresence mode="wait" initial={false}>
          {mutation.isSuccess ? (
            <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="py-4 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-ink">
                <Check className="size-5" />
              </span>
              <DialogTitle className="mt-6">Check your inbox</DialogTitle>
              <DialogDescription className="mt-2">
                We&rsquo;ve sent a sign-in link to <span className="text-foreground">{mutation.data.email}</span>.
              </DialogDescription>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}>
              <LogoMark className="size-7" />
              <DialogTitle className="mt-6">Welcome back.</DialogTitle>
              <DialogDescription className="mt-2">Sign in to continue your preparation.</DialogDescription>
              <form className="mt-8 space-y-4" noValidate onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={!!form.formState.errors.email}
                    aria-describedby={form.formState.errors.email ? "signin-email-error" : undefined}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p id="signin-email-error" className="text-xs text-[#b0614f]">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                  {mutation.isError && <p className="text-xs text-[#b0614f]">{mutation.error.message}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? <LoaderCircle className="animate-spin" /> : <>Continue with email <ArrowRight /></>}
                </Button>
                <p className="text-center text-xs text-muted-foreground">No password. We&rsquo;ll email you a secure link.</p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
