import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-2xl bg-card px-4 text-[15px] text-foreground hairline transition-shadow duration-300 outline-none placeholder:text-subtle-foreground focus-visible:shadow-[0_0_0_1px_var(--ring),0_0_0_5px_var(--accent)] aria-invalid:shadow-[0_0_0_1px_#d38a7a] disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
