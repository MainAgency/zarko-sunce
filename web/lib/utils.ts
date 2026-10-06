import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn's class helper: conditional class names, with conflicting Tailwind utilities merged. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
