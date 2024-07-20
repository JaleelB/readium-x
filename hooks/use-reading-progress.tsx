import { useEffect, useState, useRef, useCallback } from "react";

interface ReadingProgressHook {
  progress: number;
  isScrolling: boolean;
  articleRef: React.RefObject<HTMLElement>;
}

export const useReadingProgress = (
  initialProgress: number
): ReadingProgressHook => {
  const [progress, setProgress] = useState(initialProgress);
  const [isScrolling, setIsScrolling] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const isUserScroll = useRef(true); // Track if scroll was triggered by user

  useEffect(() => {
    const scrollToPosition = () => {
      if (articleRef.current) {
        const maxScrollTop =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const targetScrollTop = maxScrollTop * (initialProgress / 100);
        isUserScroll.current = false; // Mark scroll as programmatic
        window.scrollTo({ top: targetScrollTop, behavior: "smooth" });
        console.log("Initial scrolling to:", targetScrollTop);
      }
    };

    const timer = setTimeout(scrollToPosition, 100);
    return () => clearTimeout(timer);
  }, [initialProgress]);

  const calculateProgress = useCallback(() => {
    if (!articleRef.current) return;
    const maxScrollTop =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const windowScrollTop = window.pageYOffset;
    return Math.min(Math.max((windowScrollTop / maxScrollTop) * 100, 0), 100);
  }, []);

  const handleScroll = useCallback(() => {
    if (!isUserScroll.current) {
      // Ignore programmatic scrolls
      isUserScroll.current = true;
      return;
    }
    setIsScrolling(true);
    setTimeout(() => {
      const newProgress = calculateProgress() || 0;
      setProgress(newProgress);
      setIsScrolling(false);
    }, 150);
  }, [calculateProgress]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return { progress, isScrolling, articleRef };
};
