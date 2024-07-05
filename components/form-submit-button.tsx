"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { useSparkle } from "@/hooks/use-sparkle";

export function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const sparkleContainerRef = useSparkle<HTMLDivElement>({
    color: "#fff",
    sparkleCount: 20,
  });

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "overflow-hidden min-w-[110px] relative rounded-full items-center h-full border border-input/25 bg-[#1d1c20] dark:bg-[#1a1a1a] dark:text-white dark:border-white/15 p-0"
      )}
    >
      <div className="h-full flex items-center sm:gap-1.5 px-4 py-2 z-20">
        {isSubmitting ? (
          <Icons.spinner className="text-white w-3.5 h-3.5 ml-4" />
        ) : (
          <Icons.sparkles className="text-white w-3.5 h-3.5 ml-4 hidden sm:block" />
        )}
        <span className="mx-4 sm:mr-4 sm:ml-0">Generate</span>
      </div>
      <div ref={sparkleContainerRef} className="absolute w-full h-full" />
    </Button>
  );
}
