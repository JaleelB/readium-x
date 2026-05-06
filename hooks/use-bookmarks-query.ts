"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBookmarkAction,
  deleteBookmarkAction,
} from "@/app/bookmarks/bookmark";
import { queryKeys } from "@/lib/query-keys";
import { useServerActionMutation } from "@/lib/server-action-hooks";
import type { BookmarkRecord, BookmarkStatus } from "@/lib/client-types";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json() as Promise<T>;
}

export function useBookmarksQuery(initialData?: BookmarkRecord[]) {
  return useQuery({
    queryKey: queryKeys.bookmarks,
    queryFn: () => fetchJson<BookmarkRecord[]>("/api/bookmarks"),
    initialData,
  });
}

export function useBookmarkStatusQuery(
  articleUrl: string,
  initialData?: BookmarkStatus,
) {
  return useQuery({
    queryKey: queryKeys.bookmarkStatus(articleUrl),
    queryFn: () =>
      fetchJson<BookmarkStatus>(
        `/api/bookmarks/status?articleUrl=${encodeURIComponent(articleUrl)}`,
      ),
    initialData,
  });
}

type CreateBookmarkInput = {
  path: string;
  userId: string;
  title: string;
  htmlContent: string;
  textContent: string;
  authorName: string;
  authorImageURL: string;
  authorProfileURL: string;
  publicationName: string;
  readTime: string;
  publishDate: string;
  articleUrl: string;
};

type BookmarkMutationContext = {
  previousStatus?: BookmarkStatus;
  previousBookmarks?: BookmarkRecord[];
};

export function useArticleBookmark(
  articleUrl: string,
  initialStatus?: BookmarkStatus,
) {
  const queryClient = useQueryClient();
  const statusQuery = useBookmarkStatusQuery(articleUrl, initialStatus);

  const createBookmarkMutation = useServerActionMutation(createBookmarkAction, {
    async onMutate(input: CreateBookmarkInput) {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: queryKeys.bookmarkStatus(articleUrl),
        }),
        queryClient.cancelQueries({ queryKey: queryKeys.bookmarks }),
      ]);

      const previousStatus = queryClient.getQueryData<BookmarkStatus>(
        queryKeys.bookmarkStatus(articleUrl),
      );
      const previousBookmarks = queryClient.getQueryData<BookmarkRecord[]>(
        queryKeys.bookmarks,
      );

      queryClient.setQueryData<BookmarkStatus>(
        queryKeys.bookmarkStatus(articleUrl),
        {
          isBookmarked: true,
          bookmarkId: previousStatus?.bookmarkId ?? null,
        },
      );

      return { previousStatus, previousBookmarks };
    },
    onError(_error, _input, context) {
      const mutationContext = context as BookmarkMutationContext | undefined;
      if (mutationContext?.previousStatus) {
        queryClient.setQueryData(
          queryKeys.bookmarkStatus(articleUrl),
          mutationContext.previousStatus,
        );
      }
      if (mutationContext?.previousBookmarks) {
        queryClient.setQueryData(
          queryKeys.bookmarks,
          mutationContext.previousBookmarks,
        );
      }
    },
    onSuccess(bookmark) {
      if (!bookmark) {
        return;
      }

      queryClient.setQueryData<BookmarkStatus>(
        queryKeys.bookmarkStatus(articleUrl),
        {
          isBookmarked: true,
          bookmarkId: bookmark.id,
        },
      );
      queryClient.setQueryData<BookmarkRecord[]>(queryKeys.bookmarks, (old) => {
        if (!old) {
          return [bookmark];
        }
        if (old.some((item) => item.id === bookmark.id)) {
          return old;
        }
        return [bookmark, ...old];
      });
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarkStatus(articleUrl),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks });
    },
  });

  const deleteBookmarkMutation = useServerActionMutation(deleteBookmarkAction, {
    async onMutate(input) {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: queryKeys.bookmarkStatus(articleUrl),
        }),
        queryClient.cancelQueries({ queryKey: queryKeys.bookmarks }),
      ]);

      const previousStatus = queryClient.getQueryData<BookmarkStatus>(
        queryKeys.bookmarkStatus(articleUrl),
      );
      const previousBookmarks = queryClient.getQueryData<BookmarkRecord[]>(
        queryKeys.bookmarks,
      );

      queryClient.setQueryData<BookmarkStatus>(
        queryKeys.bookmarkStatus(articleUrl),
        {
          isBookmarked: false,
          bookmarkId: null,
        },
      );
      queryClient.setQueryData<BookmarkRecord[]>(queryKeys.bookmarks, (old) =>
        old?.filter((item) => item.id !== input.id),
      );

      return { previousStatus, previousBookmarks };
    },
    onError(_error, _input, context) {
      const mutationContext = context as BookmarkMutationContext | undefined;
      if (mutationContext?.previousStatus) {
        queryClient.setQueryData(
          queryKeys.bookmarkStatus(articleUrl),
          mutationContext.previousStatus,
        );
      }
      if (mutationContext?.previousBookmarks) {
        queryClient.setQueryData(
          queryKeys.bookmarks,
          mutationContext.previousBookmarks,
        );
      }
    },
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarkStatus(articleUrl),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks });
    },
  });

  return {
    statusQuery,
    createBookmark: createBookmarkMutation.mutateAsync,
    deleteBookmark: deleteBookmarkMutation.mutateAsync,
    isPending:
      createBookmarkMutation.isPending || deleteBookmarkMutation.isPending,
  };
}

export function useDeleteBookmarkMutation() {
  const queryClient = useQueryClient();

  return useServerActionMutation(deleteBookmarkAction, {
    async onMutate(input) {
      await queryClient.cancelQueries({ queryKey: queryKeys.bookmarks });
      const previousBookmarks = queryClient.getQueryData<BookmarkRecord[]>(
        queryKeys.bookmarks,
      );

      queryClient.setQueryData<BookmarkRecord[]>(queryKeys.bookmarks, (old) =>
        old?.filter((item) => item.id !== input.id),
      );

      return { previousBookmarks };
    },
    onError(_error, _input, context) {
      const mutationContext = context as BookmarkMutationContext | undefined;
      if (mutationContext?.previousBookmarks) {
        queryClient.setQueryData(
          queryKeys.bookmarks,
          mutationContext.previousBookmarks,
        );
      }
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks });
    },
  });
}
