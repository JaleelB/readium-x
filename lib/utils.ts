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

export function formatDate(dateStr: string | null): string {
  let date: Date;

  if (dateStr === null) {
    // Use today's date if no date string is provided
    date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date,
    );
    return `Fetched at: ${formattedDate}`;
  } else {
    const primaryDateMatch = dateStr.match(/^(.*?)\s\(Updated:/);
    if (primaryDateMatch && primaryDateMatch[1]) {
      return primaryDateMatch[1].trim();
    }
    return dateStr;
  }
}
