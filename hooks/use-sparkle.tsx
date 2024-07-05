"use client";
import { useRef, useEffect, RefObject } from "react";

interface UseSparkleProps {
  color?: string;
  sparkleCount?: number;
  sparkleSize?: number;
}

export function useSparkle<T extends HTMLElement>({
  color = "#ffffffb3",
  sparkleCount = 40,
  sparkleSize = 1.5,
}: UseSparkleProps): RefObject<T> {
  const sparkleContainerRef = useRef<T>(null);

  useEffect(() => {
    const container = sparkleContainerRef.current;
    if (!container) {
      console.error("Sparkle container ref is not set");
      return;
    }

    // Clear previous sparkles to avoid memory leak
    container.innerHTML = "";

    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.backgroundColor = color;
      sparkle.style.width = `${sparkleSize}px`;
      sparkle.style.height = `${sparkleSize}px`;
      sparkle.style.position = "absolute";
      sparkle.style.borderRadius = "100%";
      sparkle.style.animation = `twinkling ${Math.random() * 5 + 3}s linear ${
        Math.random() * 5
      }s infinite`;

      container.appendChild(sparkle);
    }

    // Clean up function to remove sparkles when the component unmounts or inputs change
    return () => {
      container.innerHTML = "";
    };
  }, [color, sparkleCount, sparkleSize]);

  return sparkleContainerRef;
}
