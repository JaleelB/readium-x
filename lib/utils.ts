import { env } from "@/env";
import { type ClassValue, clsx } from "clsx";
import { debounce } from "lodash";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
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

export function getLocalStorageItem(key: string, defaultValue: any): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
}

export function setLocalStorageItem(key: string, value: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
}

export const fetchFromLocalStorage = (mainKey: string) => {
  if (typeof window !== "undefined") {
    const storedValue = localStorage.getItem(mainKey);
    if (!storedValue) return {};
    try {
      return JSON.parse(storedValue);
    } catch {
      return storedValue;
    }
  }
  return {};
};

export const updateLocalStorageGroup = debounce(
  (mainKey: string, group: string, key: string, value: string) => {
    if (typeof window !== "undefined") {
      const progressObj = fetchFromLocalStorage(`readiumx-${mainKey}`);
      progressObj[group] = {
        ...progressObj[group],
        [key]: value,
      };
      localStorage.setItem(`readiumx-${mainKey}`, JSON.stringify(progressObj));
    }
  },
  500,
);

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

/**
 * Concatenates multiple ArrayBuffers into a single ArrayBuffer.
 *
 * @param arrays An array of ArrayBuffers to concatenate.
 * @returns A new ArrayBuffer containing the concatenated data.
 */
export function concatArrayBuffers(arrays: ArrayBuffer[]): ArrayBuffer {
  // Calculate the total length of all ArrayBuffers
  const totalLength = arrays.reduce((acc, value) => acc + value.byteLength, 0);

  // Create a new ArrayBuffer with the total length
  const result = new ArrayBuffer(totalLength);

  // Create a Uint8Array view of the new ArrayBuffer
  const view = new Uint8Array(result);

  // Copy the data from each input ArrayBuffer into the new ArrayBuffer
  let offset = 0;
  for (const array of arrays) {
    view.set(new Uint8Array(array), offset);
    offset += array.byteLength;
  }

  return result;
}
