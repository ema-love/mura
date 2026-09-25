import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/data/resources";
import { Cover } from "@/components/site/cover";
import { cn } from "@/lib/utils";

export function ResourceCard({ article, featured, className }: { article: Article; featured?: boolean; className?: string }) {
  if (featured) {
    return (
      <Link href={`/resources/${article.slug}`} className={cn("group grid gap-8 rounded-[32px] md:grid-cols-2 md:items-center md:gap-14", className)}>
        <Cover kind={article.cover} title={article.title} className="aspect-[4/3] transition-transform duration-700 ease-calm group-hover:scale-[0.99]" />
        <div>
          <p className="eyebrow">
            {article.topic} · {article.minutes} min read
          </p>
          <h3 className="headline mt-5 text-4xl md:text-6xl">{article.title}</h3>
          <p className="lede mt-5">{article.dek}</p>
          <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium">
            Read the guide{" "}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </Link>
    );
  }
  return (
    <Link href={`/resources/${article.slug}`} className={cn("group block rounded-[28px]", className)}>
      <Cover kind={article.cover} className="aspect-[4/3] transition-all duration-700 ease-calm group-hover:-translate-y-1 group-hover:shadow-float" />
      <p className="eyebrow mt-6 !text-[10px]">
        {article.topic} · {article.minutes} min
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{article.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{article.dek}</p>
    </Link>
  );
}
