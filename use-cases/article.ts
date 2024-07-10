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

export async function createReadingHistoryLogUseCase(
  userId: number,
  articleDetails: z.infer<typeof readingHistorySchema>
) {
  const readingHistoryLog = await createReadingHistoryLog(
    userId,
    articleDetails
  );

  return readingHistoryLog;
}

export async function getReadingHistoryUseCase(userId: number) {
  const readingHistory = await getReadingHistory(userId);

  return readingHistory;
}

export async function getReadingHistoryByIdUseCase(
  readingHistoryId: number,
  userId: number
) {
  const readingHistoryLog = await getReadingHistoryById(
    readingHistoryId,
    userId
  );

  return readingHistoryLog;
}

export async function updateReadingHistoryProgressUseCase(
  readingHistoryId: number,
  userId: number,
  progress: string
) {
  const readingHistoryLog = await updateReadingHistoryProgress(
    readingHistoryId,
    userId,
    progress
  );

  return readingHistoryLog;
}

export async function deleteReadingHistoryByIdUseCase(
  readingHistoryId: number,
  userId: number
) {
  await deleteReadingHistoryById(readingHistoryId, userId);
}

export async function deleteAllReadingHistoryUseCase(userId: number) {
  await deleteAllReadingHistory(userId);
}
