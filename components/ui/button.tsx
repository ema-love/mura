import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[-0.01em] select-none transition-[transform,background-color,box-shadow,color,opacity] duration-300 ease-calm active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_1px_0_0_rgb(255_255_255/0.12)_inset,0_8px_20px_-8px_rgb(var(--shadow-color)/0.45)] hover:-translate-y-px hover:shadow-[0_1px_0_0_rgb(255_255_255/0.12)_inset,0_14px_28px_-10px_rgb(var(--shadow-color)/0.5)]",
        secondary:
          "bg-card text-foreground hairline hover:-translate-y-px hover:bg-accent-soft hover:shadow-soft",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        accent: "bg-accent text-accent-foreground hover:-translate-y-px hover:shadow-soft",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-full px-3.5 text-[13px]",
        md: "h-10 rounded-full px-5 text-sm",
        lg: "h-12 rounded-full px-6 text-[15px]",
        xl: "h-14 rounded-full px-8 text-base",
        icon: "size-9 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
