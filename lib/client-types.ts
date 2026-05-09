import { bookmarkSchema } from "@/schemas/article";
import { z } from "zod";

export type BookmarkRecord = z.infer<typeof bookmarkSchema>;

export type BookmarkStatus = {
  isBookmarked: boolean;
  bookmarkId: number | null;
};

export type ReadingHistoryRecord = {
  authorName: string;
  authorImageURL: string | null;
  authorProfileURL: string | null;
  readTime: string;
  id: number;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  articleUrl: string;
  articleTitle: string;
  accessTime: Date | string;
  progress: string | null;
};
