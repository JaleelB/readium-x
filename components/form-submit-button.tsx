"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";

export function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const sparkleContainerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!sparkleContainerRef.current) {
      return;
    }

    const container = sparkleContainerRef.current as HTMLElement;
    if (container) {
      for (let i = 0; i < 40; i++) {
        // Generate 30 sparkles
        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.animationDuration = `${Math.random() * 5 + 3}s`; // Random duration between 3 and 8 seconds
        sparkle.style.animationDelay = `${Math.random() * 5}s`; // Random delay
        container.appendChild(sparkle);
      }
    }
  }, [sparkleContainerRef]);

  return (
    <Button
      type="submit"
      ref={sparkleContainerRef}
      disabled={isSubmitting}
      className={cn(
        "overflow-hidden relative rounded-full items-center h-full border border-input/25 bg-[#1d1c20] dark:bg-[#1a1a1a] dark:text-white dark:border-white/15 p-0 glow-button"
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
    </Button>
  );
}
