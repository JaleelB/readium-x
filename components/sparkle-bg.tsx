"use client";

import { useSparkle } from "@/hooks/use-sparkle";

export function SparkleBg({ sparkleCount = 20 }: { sparkleCount?: number }) {
  const sparkleContainerRef = useSparkle<HTMLDivElement>({
    color: "#fff",
    sparkleCount: sparkleCount,
  });

  return <div ref={sparkleContainerRef} className="absolute w-full h-full" />;
}
