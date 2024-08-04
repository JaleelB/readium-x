import { articleSchema } from "@/schemas/article";
import { db } from "@/server/db/db";
import { bookmarks } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function createBookark(
  userId: number,
  articleDetails: z.infer<typeof articleSchema> & { articleUrl: string },
) {
  const existingBookmark = await db.query.bookmarks.findFirst({
    where:
      eq(bookmarks.userId, userId) &&
      eq(bookmarks.title, articleDetails.title) &&
      eq(bookmarks.articleUrl, articleDetails.articleUrl),
  });

  if (existingBookmark) {
    return existingBookmark;
  }

  const [bookmark] = await db
    .insert(bookmarks)
    .values({
      userId,
      title: articleDetails.title,
      content: articleDetails.content,
      authorName: articleDetails.authorName,
      authorImageURL: articleDetails.authorImageURL,
      authorProfileURL: articleDetails.authorProfileURL,
      publicationName: articleDetails.publicationName,
      readTime: articleDetails.readTime,
      publishDate: articleDetails.publishDate,
      articleUrl: articleDetails.articleUrl,
      createdAt: new Date(),
    })
    .onConflictDoNothing()
    .returning();

  return bookmark;
}

export async function getBookmarks(userId: number) {
  const userBookmarks = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId));

  return userBookmarks;
}

export async function getBookmarkById(userId: number, bookmarkId: number) {
  const bookmark = await db.query.bookmarks.findFirst({
    where: eq(bookmarks.userId, userId) && eq(bookmarks.id, bookmarkId),
  });

  return bookmark;
}

export async function deleteBookmark(userId: number, bookmarkId: number) {
  await db
    .delete(bookmarks)
    .where(eq(bookmarks.userId, userId) && eq(bookmarks.id, bookmarkId));
}

export async function updateBookmark(
  userId: number,
  bookmarkId: number,
  articleDetails: z.infer<typeof articleSchema>,
) {
  const [bookmark] = await db
    .update(bookmarks)
    .set({
      ...articleDetails,
    })
    .where(eq(bookmarks.userId, userId) && eq(bookmarks.id, bookmarkId))
    .returning();

  return bookmark;
}
