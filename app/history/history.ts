"use server";

import {
  createReadingHistoryLogUseCase,
  getReadingHistoryUseCase,
  getReadingHistoryByIdUseCase,
  updateReadingHistoryProgressUseCase,
  deleteReadingHistoryByIdUseCase,
  deleteAllReadingHistoryUseCase,
  getReadingHistoryProgressUseCase,
} from "@/use-cases/article";
import { authenticatedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { rateLimitByIp } from "@/lib/limiter";

export const createReadingHistoryLogAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.string(),
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
    }),
  )
  .handler(async ({ input, ctx }) => {
    await rateLimitByIp({ key: "create-history-log", limit: 5, window: 30000 });
    const log = await createReadingHistoryLogUseCase(ctx.user.id, {
      title: input.articleDetails.title,
      authorName: input.articleDetails.authorName,
      articleUrl: input.articleDetails.articleURL,
      authorImageURL: input.articleDetails.authorImageURL,
      authorProfileURL: input.articleDetails.authorProfileURL,
      readTime: input.articleDetails.readTime,
      accessTime: input.articleDetails.accessTime,
      progress: input.articleDetails.progress,
    });

    return log;
  });

export const getReadingHistoryAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.string(),
    }),
  )
  .handler(async ({ ctx }) => {
    return await getReadingHistoryUseCase(ctx.user.id);
  });

export const getReadingHistoryProgressAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.string(),
      readingHistoryId: z.number(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const readingHistoryProgress = await getReadingHistoryProgressUseCase(
      input.readingHistoryId,
      ctx.user.id,
    );
    return readingHistoryProgress;
  });

export const getReadingHistoryByIdAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.string(),
      readingHistoryId: z.number(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const readingHistory = await getReadingHistoryByIdUseCase(
      input.readingHistoryId,
      ctx.user.id,
    );
    revalidatePath("/history");
    return readingHistory;
  });

export const updateReadingHistoryProgressAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.string(),
      readingHistoryId: z.number(),
      progress: z.string(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    await rateLimitByIp({
      key: "update-history-progress",
      limit: 5,
      window: 30000,
    });
    await updateReadingHistoryProgressUseCase(
      input.readingHistoryId,
      ctx.user.id,
      input.progress,
    );
  });

export const deleteReadingHistoryByIdAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.string(),
      readingHistoryId: z.number(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    await deleteReadingHistoryByIdUseCase(input.readingHistoryId, ctx.user.id);
    revalidatePath("/history");
  });

export const deleteAllReadingHistoryAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.string(),
    }),
  )
  .handler(async ({ ctx }) => {
    await deleteAllReadingHistoryUseCase(ctx.user.id);
    revalidatePath("/history");
  });
