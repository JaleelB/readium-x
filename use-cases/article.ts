import { readingHistorySchema } from "@/schemas/article";
import { z } from "zod";
import {
  createReadingHistoryLog,
  getReadingHistory,
  getReadingHistoryById,
  updateReadingHistoryProgress,
  deleteReadingHistoryById,
  deleteAllReadingHistory,
} from "@/data-access/article";
import { UserId } from "@/use-cases/types";

export async function createReadingHistoryLogUseCase(
  userId: UserId,
  articleDetails: z.infer<typeof readingHistorySchema>,
) {
  const readingHistoryLog = await createReadingHistoryLog(
    userId,
    articleDetails,
  );

  return readingHistoryLog;
}

export async function getReadingHistoryUseCase(userId: UserId) {
  const readingHistory = await getReadingHistory(userId);

  return readingHistory;
}

export async function getReadingHistoryProgressUseCase(
  readingHistoryId: number,
  userId: UserId,
) {
  const readingHistory = await getReadingHistoryById(readingHistoryId, userId);

  return readingHistory?.progress;
}

export async function getReadingHistoryByIdUseCase(
  readingHistoryId: number,
  userId: UserId,
) {
  const readingHistoryLog = await getReadingHistoryById(
    readingHistoryId,
    userId,
  );

  return readingHistoryLog;
}

export async function updateReadingHistoryProgressUseCase(
  readingHistoryId: number,
  userId: UserId,
  progress: string,
) {
  const readingHistoryLog = await updateReadingHistoryProgress(
    readingHistoryId,
    userId,
    progress,
  );

  return readingHistoryLog;
}

export async function deleteReadingHistoryByIdUseCase(
  readingHistoryId: number,
  userId: UserId,
) {
  await deleteReadingHistoryById(readingHistoryId, userId);
}

export async function deleteAllReadingHistoryUseCase(userId: UserId) {
  await deleteAllReadingHistory(userId);
}
