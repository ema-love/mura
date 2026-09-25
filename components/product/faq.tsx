import { Plus } from "lucide-react";
import type { Faq as FaqItem } from "@/lib/catalog/types";

/** Native <details> keeps the FAQ keyboard- and screen-reader-friendly with no script. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y border-y">
      {items.map((f) => (
        <details key={f.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg text-lg font-medium tracking-[-0.01em]">
            {f.q}
            <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45" aria-hidden />
          </summary>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
