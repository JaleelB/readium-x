"use client";

import { useSparkle } from "@/hooks/use-sparkle";

export function SparkleBg({
  sparkleCount,
  color,
  sparkleSize,
}: {
  sparkleCount?: number;
  color?: string;
  sparkleSize?: number;
}) {
  const sparkleContainerRef = useSparkle<HTMLDivElement>({
    color: color || "#ffffffb3",
    sparkleCount: sparkleCount || 40,
    sparkleSize: sparkleSize || 1.5,
  });

  return <div ref={sparkleContainerRef} className="absolute h-full w-full" />;
}
