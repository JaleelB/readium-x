import { readingHistorySchema } from "@/schemas/article";
import { db } from "@/server/db/db";
import { readingHistory } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { UserId } from "@/use-cases/types";

export async function createReadingHistoryLog(
  userId: UserId,
  articleDetails: z.infer<typeof readingHistorySchema>,
) {
  const existingReadingHistory = await db.query.readingHistory.findFirst({
    where:
      eq(readingHistory.userId, userId) &&
      eq(readingHistory.articleTitle, articleDetails.title) &&
      eq(readingHistory.articleUrl, articleDetails.articleUrl),
  });

  if (existingReadingHistory) {
    return existingReadingHistory;
  }

  const [readingHistoryLog] = await db
    .insert(readingHistory)
    .values({
      userId,
      authorName: articleDetails.authorName,
      articleUrl: articleDetails.articleUrl,
      articleTitle: articleDetails.title,
      authorImageURL: articleDetails.authorImageURL,
      authorProfileURL: articleDetails.authorProfileURL,
      readTime: articleDetails.readTime,
      accessTime: articleDetails.accessTime,
      progress: articleDetails.progress,
      createdAt: new Date(),
    })
    .onConflictDoNothing()
    .returning();

  return readingHistoryLog;
}

export async function getReadingHistory(userId: UserId) {
  const userReadingHistory = await db
    .select()
    .from(readingHistory)
    .where(eq(readingHistory.userId, userId));

  return userReadingHistory;
}

export async function getReadingHistoryById(
  readingHistoryId: number,
  userId: UserId,
) {
  const readingHistoryLog = await db.query.readingHistory.findFirst({
    where:
      eq(readingHistory.userId, userId) &&
      eq(readingHistory.id, readingHistoryId),
  });

  return readingHistoryLog;
}

export async function updateReadingHistoryProgress(
  readingHistoryId: number,
  userId: UserId,
  progress: string,
) {
  const [updatedReadingHistory] = await db
    .update(readingHistory)
    .set({
      progress,
      updatedAt: new Date(),
    })
    .where(
      eq(readingHistory.userId, userId) &&
        eq(readingHistory.id, readingHistoryId),
    )
    .returning();

  return updatedReadingHistory;
}

export async function getReadingHistoryProgress(
  readingHistoryId: number,
  userId: UserId,
) {
  const readingHistoryLog = await db.query.readingHistory.findFirst({
    where:
      eq(readingHistory.userId, userId) &&
      eq(readingHistory.id, readingHistoryId),
  });

  return readingHistoryLog?.progress;
}

export async function deleteReadingHistoryById(
  readingHistoryId: number,
  userId: UserId,
) {
  await db
    .delete(readingHistory)
    .where(
      eq(readingHistory.userId, userId) &&
        eq(readingHistory.id, readingHistoryId),
    );
}

export async function deleteAllReadingHistory(userId: UserId) {
  await db.delete(readingHistory).where(eq(readingHistory.userId, userId));
}
