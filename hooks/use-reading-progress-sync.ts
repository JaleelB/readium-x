"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { updateReadingHistoryProgressAction } from "@/app/history/history";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { queryKeys } from "@/lib/query-keys";
import { useServerActionMutation } from "@/lib/server-action-hooks";
import { fetchFromLocalStorage, setLocalStorageItem } from "@/lib/utils";

async function fetchProgress(readingHistoryId: number) {
  const response = await fetch(
    `/api/history/progress?readingHistoryId=${readingHistoryId}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch reading progress");
  }
  return response.json() as Promise<{ progress: string | null }>;
}

function getArticleProgressFromLocalStorage() {
  return fetchFromLocalStorage("readiumx-article-progress");
}

export function useReadingProgressSync({
  readingHistoryId,
  userId,
}: {
  readingHistoryId: number;
  userId: string;
}) {
  const [initialProgress, setInitialProgress] = useState(0);
  const [needsRemoteProgress, setNeedsRemoteProgress] = useState(false);
  const progressQuery = useQuery({
    queryKey: queryKeys.readingProgress(readingHistoryId),
    queryFn: () => fetchProgress(readingHistoryId),
    enabled: needsRemoteProgress,
  });
  const updateProgressMutation = useServerActionMutation(
    updateReadingHistoryProgressAction,
    {
      onError() {
        toast.error("Failed to save reading progress");
      },
    },
  );

  useEffect(() => {
    const progressObj = getArticleProgressFromLocalStorage();
    const savedProgress = progressObj[readingHistoryId];
    if (savedProgress) {
      setInitialProgress(parseFloat(savedProgress));
      setNeedsRemoteProgress(false);
      return;
    }

    setNeedsRemoteProgress(true);
  }, [readingHistoryId]);

  useEffect(() => {
    const remoteProgress = progressQuery.data?.progress;
    if (!remoteProgress) {
      return;
    }

    const progressObj = getArticleProgressFromLocalStorage();
    const newProgressObj = {
      ...progressObj,
      [readingHistoryId]: remoteProgress,
    };
    setLocalStorageItem(
      "readiumx-article-progress",
      JSON.stringify(newProgressObj),
    );
    setInitialProgress(parseFloat(remoteProgress));
  }, [progressQuery.data?.progress, readingHistoryId]);

  const { progress, articleRef } = useReadingProgress(initialProgress);

  const updateLocalStorage = useMemo(
    () =>
      debounce((value: number) => {
        const progressObj = getArticleProgressFromLocalStorage();
        const newProgressObj = {
          ...progressObj,
          [readingHistoryId]: value.toString(),
        };
        setLocalStorageItem(
          "readiumx-article-progress",
          JSON.stringify(newProgressObj),
        );
      }, 1000),
    [readingHistoryId],
  );

  const saveProgress = useCallback(async () => {
    try {
      await updateProgressMutation.mutateAsync({
        readingHistoryId,
        userId,
        progress: `${progress.toFixed(2)}%`,
      });
    } catch {
      // The mutation hook surfaces the user-facing toast.
    }
  }, [progress, readingHistoryId, updateProgressMutation, userId]);

  useEffect(() => {
    updateLocalStorage(progress);

    const handleUnload = () => {
      void saveProgress();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void saveProgress();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      updateLocalStorage.cancel();
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [progress, saveProgress, updateLocalStorage]);

  return { progress, articleRef };
}
