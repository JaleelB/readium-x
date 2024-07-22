import {
  createBookark,
  getBookmarks,
  getBookmarkById,
  deleteBookmark,
  updateBookmark,
} from "@/data-access/bookmarks";
import { articleSchema } from "@/schemas/article";
import { z } from "zod";

export async function createBookmarkUseCase(
  userId: number,
  articleDetails: z.infer<typeof articleSchema>,
) {
  const bookmark = await createBookark(userId, articleDetails);

  return bookmark;
}

export async function getBookmarksUseCase(userId: number) {
  const bookmarks = await getBookmarks(userId);

  return bookmarks;
}

export async function getBookmarkByIdUseCase(
  userId: number,
  bookmarkId: number,
) {
  const bookmark = await getBookmarkById(userId, bookmarkId);

  return bookmark;
}

export async function deleteBookmarkUseCase(
  userId: number,
  bookmarkId: number,
) {
  await deleteBookmark(userId, bookmarkId);
}

export async function updateBookmarkUseCase(
  userId: number,
  bookmarkId: number,
  articleDetails: z.infer<typeof articleSchema>,
) {
  const bookmark = await updateBookmark(userId, bookmarkId, articleDetails);

  return bookmark;
}
