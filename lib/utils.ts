import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** The house easing curve: a long, calm deceleration. */
export const ease = [0.22, 1, 0.36, 1] as const;
