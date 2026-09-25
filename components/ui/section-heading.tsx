import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", className, id }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="headline mt-5 text-4xl sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {description && <p className={cn("lede mt-6 max-w-2xl", align === "center" && "mx-auto")}>{description}</p>}
    </Reveal>
  );
}
