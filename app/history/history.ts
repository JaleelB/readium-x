"use server";

import {
  createReadingHistoryLogUseCase,
  getReadingHistoryUseCase,
  getReadingHistoryByIdUseCase,
  updateReadingHistoryProgressUseCase,
  deleteReadingHistoryByIdUseCase,
  deleteAllReadingHistoryUseCase,
} from "@/use-cases/article";
import { authenticatedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createReadingHistoryLogAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      articleDetails: z.object({
        title: z.string(),
        authorName: z.string(),
        articleURL: z.string().url(),
        authorImageURL: z.string().url(),
        authorProfileURL: z.string().url(),
        readTime: z.string(),
        accessTime: z.date(),
        progress: z.string().optional(),
      }),
    })
  )
  .handler(async ({ input }) => {
    await createReadingHistoryLogUseCase(input.userId, {
      title: input.articleDetails.title,
      authorName: input.articleDetails.authorName,
      articleUrl: input.articleDetails.articleURL,
      authorImageURL: input.articleDetails.authorImageURL,
      authorProfileURL: input.articleDetails.authorProfileURL,
      readTime: input.articleDetails.readTime,
      accessTime: input.articleDetails.accessTime,
      progress: input.articleDetails.progress,
    });

    revalidatePath("/history");
  });

export const getReadingHistoryAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
    })
  )
  .handler(async ({ input }) => {
    return await getReadingHistoryUseCase(input.userId);
  });

export const getReadingHistoryByIdAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      readingHistoryId: z.number(),
    })
  )
  .handler(async ({ input }) => {
    return await getReadingHistoryByIdUseCase(
      input.readingHistoryId,
      input.userId
    );
  });

export const updateReadingHistoryProgressAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      readingHistoryId: z.number(),
      progress: z.string(),
    })
  )
  .handler(async ({ input }) => {
    await updateReadingHistoryProgressUseCase(
      input.readingHistoryId,
      input.userId,
      input.progress
    );
  });

export const deleteReadingHistoryByIdAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      readingHistoryId: z.number(),
    })
  )
  .handler(async ({ input }) => {
    await deleteReadingHistoryByIdUseCase(input.readingHistoryId, input.userId);
  });

export const deleteAllReadingHistoryAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
    })
  )
  .handler(async ({ input }) => {
    await deleteAllReadingHistoryUseCase(input.userId);
  });
