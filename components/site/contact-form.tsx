"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(1, { error: "Tell us your name." }).max(120),
  email: z.email({ error: "Enter a valid email address." }),
  message: z.string().trim().min(10, { error: "A little more detail, please (10+ characters)." }).max(5000),
  company: z.string().optional(),
});
type Values = z.infer<typeof schema>;

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="mt-1.5 text-xs text-[#b0614f]">
      {message}
    </p>
  ) : null;
}

export function ContactForm() {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", message: "", company: "" } });
  const send = useMutation({
    mutationFn: async (values: Values) => {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Your message couldn't be sent. Please try again.");
    },
  });
  const { errors } = form.formState;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {send.isSuccess ? (
        <motion.div key="done" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="status" className="rounded-3xl bg-accent-soft p-6 hairline dark:bg-accent">
          <p className="flex items-center gap-2 font-medium">
            <span className="grid size-6 place-items-center rounded-full bg-foreground text-background">
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            Message sent
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Thank you. We&rsquo;ll reply to the email you gave us.</p>
        </motion.div>
      ) : (
        <motion.form key="form" exit={{ opacity: 0 }} noValidate onSubmit={form.handleSubmit((v) => send.mutate(v))} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" autoComplete="name" className="mt-2" aria-invalid={!!errors.name} aria-describedby={errors.name ? "contact-name-error" : undefined} {...form.register("name")} />
              <FieldError id="contact-name-error" message={errors.name?.message} />
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" autoComplete="email" className="mt-2" aria-invalid={!!errors.email} aria-describedby={errors.email ? "contact-email-error" : undefined} {...form.register("email")} />
              <FieldError id="contact-email-error" message={errors.email?.message} />
            </div>
          </div>
          <div>
            <Label htmlFor="contact-message">Message</Label>
            <textarea
              id="contact-message"
              rows={6}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className={cn(
                "mt-2 w-full resize-y rounded-2xl bg-card px-4 py-3 text-[15px] hairline outline-none placeholder:text-subtle-foreground focus-visible:shadow-[0_0_0_1px_var(--ring),0_0_0_5px_var(--accent)]",
                errors.message && "shadow-[0_0_0_1px_#c0735f]",
              )}
              {...form.register("message")}
            />
            <FieldError id="contact-message-error" message={errors.message?.message} />
          </div>
          {/* Honeypot — hidden from people and assistive tech. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="contact-company">Company</label>
            <input id="contact-company" tabIndex={-1} autoComplete="off" {...form.register("company")} />
          </div>
          {send.isError && (
            <p role="alert" className="text-sm text-[#b0614f]">
              {send.error.message}
            </p>
          )}
          <Button type="submit" size="lg" disabled={send.isPending}>
            {send.isPending ? <LoaderCircle className="animate-spin" aria-label="Sending" /> : <>Send message <ArrowRight /></>}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
