"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface ReadingProgressHook {
  progress: number;
  isScrolling: boolean;
  articleRef: React.RefObject<HTMLElement>;
}

export const useReadingProgress = (): ReadingProgressHook => {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const frameRef = useRef<number>();

  const calculateProgress = () => {
    if (!articleRef.current) return;
    const element = articleRef.current;
    const totalHeight = element.clientHeight - element.offsetTop;
    const windowScrollTop = window.scrollY || window.pageYOffset;
    const scrolledAmount = windowScrollTop - element.offsetTop;
    return Math.min(Math.max((scrolledAmount / totalHeight) * 100, 0), 100);
  };

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const newProgress = calculateProgress();
      setProgress(newProgress as number);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeoutRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [handleScroll]);

  return { progress, isScrolling, articleRef };
};
