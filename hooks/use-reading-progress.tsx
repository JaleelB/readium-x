import { useEffect, useState, useRef, useCallback } from "react";
import { throttle } from "lodash";

interface ReadingProgressHook {
  progress: number;
  isScrolling: boolean;
  articleRef: React.RefObject<HTMLElement>;
}

export const useReadingProgress = (): ReadingProgressHook => {
  // const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const handleScroll = useCallback(() => {
    if (!articleRef.current) return;

    const element = articleRef.current;
    const totalHeight = element.clientHeight - element.offsetTop;
    const windowScrollTop = window.scrollY || window.pageYOffset;
    const scrolledAmount = windowScrollTop - element.offsetTop;
    const newProgress = Math.min(
      Math.max((scrolledAmount / totalHeight) * 100, 0),
      100
    );

    if (Math.abs(progressRef.current - newProgress) > 0.1) {
      progressRef.current = newProgress;
    }
    // if (Math.abs(progress - newProgress) > 0.1) {
    //   console.log("Setting progress", newProgress);
    //   setProgress(newProgress);
    // }

    setIsScrolling(true); // Always set to true on scroll
    clearTimeout(scrollTimeoutRef.current); // Clear the existing timeout

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false); // Set to false only when scrolling stops
    }, 150);
  }, []);

  useEffect(() => {
    const throttleScroll = throttle(handleScroll, 100);

    window.addEventListener("scroll", throttleScroll);
    return () => {
      window.removeEventListener("scroll", throttleScroll);
      clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  return { progress: progressRef.current, isScrolling, articleRef };
};
