"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAllReadingHistoryAction,
  deleteReadingHistoryByIdAction,
} from "@/app/history/history";
import type { ReadingHistoryRecord } from "@/lib/client-types";
import { queryKeys } from "@/lib/query-keys";
import { useServerActionMutation } from "@/lib/server-action-hooks";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json() as Promise<T>;
}

export function useHistoryQuery(initialData?: ReadingHistoryRecord[]) {
  return useQuery({
    queryKey: queryKeys.history,
    queryFn: () => fetchJson<ReadingHistoryRecord[]>("/api/history"),
    initialData,
  });
}

export function useHistoryDeleteMutations() {
  const queryClient = useQueryClient();

  const deleteById = useServerActionMutation(deleteReadingHistoryByIdAction, {
    onSettled() {
      queryClient.invalidateQueries({ queryKey: queryKeys.history });
    },
  });

  const deleteAll = useServerActionMutation(deleteAllReadingHistoryAction, {
    onSettled() {
      queryClient.invalidateQueries({ queryKey: queryKeys.history });
    },
  });

  return { deleteById, deleteAll };
}
