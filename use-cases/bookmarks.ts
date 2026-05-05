import {
  createBookark,
  getBookmarks,
  getBookmarkById,
  deleteBookmark,
  updateBookmark,
} from "@/data-access/bookmarks";
import { articleSchema } from "@/schemas/article";
import { UserId } from "@/use-cases/types";
import { z } from "zod";

export async function createBookmarkUseCase(
  userId: UserId,
  articleDetails: z.infer<typeof articleSchema> & { articleUrl: string },
) {
  const bookmark = await createBookark(userId, articleDetails);

  return bookmark;
}

export async function getBookmarksUseCase(userId: UserId) {
  const bookmarks = await getBookmarks(userId);

  return bookmarks;
}

export async function getBookmarkByIdUseCase(
  userId: UserId,
  bookmarkId: number,
) {
  const bookmark = await getBookmarkById(userId, bookmarkId);

  return bookmark;
}

export async function deleteBookmarkUseCase(
  userId: UserId,
  bookmarkId: number,
) {
  await deleteBookmark(userId, bookmarkId);
}

export async function updateBookmarkUseCase(
  userId: UserId,
  bookmarkId: number,
  articleDetails: z.infer<typeof articleSchema>,
) {
  const bookmark = await updateBookmark(userId, bookmarkId, articleDetails);

  return bookmark;
}
