"use client";

import { Button } from "./ui/button";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { SparkleBg } from "./sparkle-bg";

export function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "relative h-full min-w-[110px] items-center overflow-hidden rounded-full border border-input/25 bg-[#1d1c20] p-0 dark:border-white/15 dark:bg-[#1a1a1a] dark:text-white",
      )}
    >
      <div className="z-20 flex h-full items-center px-4 py-2 sm:gap-1.5">
        {isSubmitting ? (
          <Icons.spinner className="ml-4 h-3.5 w-3.5 text-white" />
        ) : (
          <Icons.sparkles className="ml-4 hidden h-3.5 w-3.5 text-white sm:block" />
        )}
        <span className="mx-4 sm:ml-0 sm:mr-4">Generate</span>
      </div>
      <SparkleBg />
    </Button>
  );
}
