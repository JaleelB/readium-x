import { ArticleDetails } from "@/app/article/actions/article";
import {
  createBookark,
  getBookmarks,
  getBookmarkById,
  deleteBookmark,
  updateBookmark,
} from "@/data-access/bookmarks";
import { articleSchema } from "@/schemas/boomark";
import { z } from "zod";

export async function createBookmarkUseCase(
  userId: number,
  articleDetails: z.infer<typeof articleSchema>
) {
  const bookmark = await createBookark(userId, articleDetails);

  return bookmark;
}

export async function getBookmarksUseCase(userId: number) {
  const bookmarks = await getBookmarks(userId);

  return bookmarks;
}

export async function getBookmarkByIdUseCase(bookmarkId: number) {
  const bookmark = await getBookmarkById(bookmarkId);

  return bookmark;
}

export async function deleteBookmarkUseCase(bookmarkId: number) {
  await deleteBookmark(bookmarkId);
}

export async function updateBookmarkUseCase(
  bookmarkId: number,
  articleDetails: ArticleDetails
) {
  const bookmark = await updateBookmark(bookmarkId, articleDetails);

  return bookmark;
}
