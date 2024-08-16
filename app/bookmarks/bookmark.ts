"use server";

import {
  createBookark,
  deleteBookmark,
  getBookmarkById,
} from "@/data-access/bookmarks";
import { getUser } from "@/data-access/users";
import { rateLimitByIp } from "@/lib/limiter";
import { authenticatedAction } from "@/lib/safe-action";
import {
  getBookmarkByIdUseCase,
  getBookmarksUseCase,
} from "@/use-cases/bookmarks";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createBookmarkAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      path: z.string(),
      userId: z.number(),
      title: z.string(),
      htmlContent: z.string(),
      textContent: z.string(),
      authorName: z.string(),
      authorImageURL: z.string().url(),
      authorProfileURL: z.string().url(),
      publicationName: z.string(),
      readTime: z.string(),
      publishDate: z.string(),
      articleUrl: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: "create-bookmark", limit: 5, window: 30000 });
    const user = await getUser(input.userId);
    if (user !== undefined) {
      await createBookark(user.id, {
        title: input.title,
        htmlContent: input.htmlContent,
        textContent: input.textContent,
        authorName: input.authorName,
        authorImageURL: input.authorImageURL,
        authorProfileURL: input.authorProfileURL,
        publicationName: input.publicationName,
        readTime: input.readTime,
        publishDate: input.publishDate,
        articleUrl: input.articleUrl,
      });
    }
    revalidatePath(input.path);
  });

export const getBookmarksAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.number() }))
  .handler(async ({ input }) => {
    const user = await getUser(input.userId);
    if (user !== undefined) {
      return await getBookmarksUseCase(user.id);
    }
  });

export const getBookmarkAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      userId: z.number(),
      title: z.string(),
      publishDate: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const user = await getUser(input.userId);
    if (user !== undefined) {
      const bookmarks = await getBookmarksUseCase(user.id);
      const bookmark = bookmarks.find(
        (bookmark) =>
          bookmark.title === input.title &&
          bookmark.publishDate === input.publishDate,
      );

      return bookmark;
    }
  });

export const getBookmarkByIdAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.number(), bookmarkId: z.number() }))
  .handler(async ({ input }) => {
    const user = await getUser(input.userId);
    if (user !== undefined) {
      return await getBookmarkByIdUseCase(user.id, input.bookmarkId);
    }
  });

export const deleteBookmarkAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.number(), id: z.number(), path: z.string() }))
  .handler(async ({ input }) => {
    const user = await getUser(input.userId);

    if (user !== undefined) {
      const bookmark = await getBookmarkById(user?.id, input.id);
      if (bookmark !== undefined) {
        await deleteBookmark(user.id, bookmark.id);
      }
      revalidatePath(input.path);
    }
  });
