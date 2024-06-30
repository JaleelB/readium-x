"use client";

import { useState, useCallback } from "react";

type ZoomConfig = {
  minScale: number;
  maxScale: number;
  scaleSensitivity: number;
  initialScale?: number;
};

const defaultConfig: ZoomConfig = {
  minScale: 0.5,
  maxScale: 5,
  scaleSensitivity: 0.1,
  initialScale: 1,
};

export function useZoom(config: Partial<ZoomConfig> = {}) {
  // Merge default and user-provided configurations
  const {
    minScale,
    maxScale,
    scaleSensitivity,
    initialScale = 1,
  } = {
    ...defaultConfig,
    ...config,
  };

  const [scale, setScale] = useState<number>(initialScale);

  const zoomIn = useCallback(() => {
    setScale((prevScale) => {
      const newScale = Math.min(prevScale + scaleSensitivity, maxScale);
      return Math.round(newScale * 10) / 10; // Rounding to one decimal place for finer control
    });
  }, [maxScale, scaleSensitivity]);

  const zoomOut = useCallback(() => {
    setScale((prevScale) => {
      const newScale = Math.max(prevScale - scaleSensitivity, minScale);
      return Math.round(newScale * 10) / 10; // Rounding to one decimal place
    });
  }, [minScale, scaleSensitivity]);

  const resetZoom = useCallback(() => {
    setScale(initialScale);
  }, [initialScale]);

  return {
    scale,
    zoomIn,
    zoomOut,
    resetZoom,
    zoom: scale,
  };
}
