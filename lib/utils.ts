import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateReadTime(text: string[] | string | undefined): string {
  if (!text) return "0 min read";

  const wordsPerMinute = 200; // Average reading speed
  let wordCount = 0;

  if (Array.isArray(text)) {
    wordCount = text.join(" ").split(/\s+/).length;
  } else {
    wordCount = text.split(/\s+/).length;
  }

  const minutes = wordCount / wordsPerMinute;
  const roundedMinutes = Math.ceil(minutes); // Round up to the nearest minute

  return `${roundedMinutes} min read`;
}
