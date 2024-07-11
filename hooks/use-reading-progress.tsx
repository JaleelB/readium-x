import { useEffect, useState, useRef } from "react";

interface ReadingProgressHook {
  progress: number;
  articleRef: React.RefObject<HTMLElement>;
}

export default function useReadingProgress(): ReadingProgressHook {
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;

      const element = articleRef.current;
      const totalHeight = element.clientHeight - element.offsetTop;
      const windowScrollTop = window.scrollY || window.pageYOffset;
      const scrolledAmount = windowScrollTop - element.offsetTop;

      const progressPercentage = (scrolledAmount / totalHeight) * 100;
      setProgress(Math.min(Math.max(progressPercentage, 0), 100)); // Ensures progress is between 0 and 100
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { progress, articleRef };
}
