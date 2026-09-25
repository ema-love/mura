import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Preview } from "@/components/previews/previews";
import { getProduct } from "@/lib/catalog";
import type { PreviewId } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/**
 * Real interface previews from inside the launch products. Each is labelled with the
 * product it comes from — presented as what you receive, never as an app MÚRÀ runs.
 */
const tiles: { preview: PreviewId; product: string; wide?: boolean }[] = [
  { preview: "semester-planner", product: "semester-system", wide: true },
  { preview: "weekly-reset", product: "student-reset" },
  { preview: "grade-tracker", product: "grade-tgpa-tracker" },
  { preview: "assignment-tracker", product: "assignment-command-center", wide: true },
  { preview: "calendar", product: "semester-system" },
  { preview: "goal-tracker", product: "semester-system" },
];

export function InsideSystems() {
  return (
    <section id="inside" aria-labelledby="inside-title" className="relative overflow-hidden py-section">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-[60%] max-w-5xl rounded-full bg-[radial-gradient(closest-side,var(--accent),transparent)] opacity-70 blur-2xl" />
      <div className="page relative">
        <SectionHeading
          id="inside-title"
          eyebrow="What's inside"
          title="Quiet pages for a busy semester."
          description="A look inside the MÚRÀ systems: courses, deadlines, grades and weekly priorities, laid out so you can see everything at once."
        />

        <Reveal className="mt-16 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          {tiles.map((t) => {
            const product = getProduct(t.product)!;
            return (
              <figure key={`${t.preview}-${t.product}`} className={cn("flex flex-col", t.wide && "sm:col-span-2")}>
                <Preview id={t.preview} className="flex-1" />
                <figcaption className="mt-3 px-1 text-xs text-muted-foreground">
                  From{" "}
                  <Link href={`/products/${product.slug}`} className="font-medium text-foreground underline-offset-4 hover:underline">
                    {product.name}
                  </Link>
                </figcaption>
              </figure>
            );
          })}
        </Reveal>

        <Reveal>
          <p className="mt-10 text-sm text-muted-foreground">Shown with sample data. Each system arrives as a PDF, Google Sheet or Excel file.</p>
        </Reveal>
      </div>
    </section>
  );
}
