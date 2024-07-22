"use server";

import {
  createBookark,
  deleteBookmark,
  getBookmarkById,
} from "@/data-access/bookmarks";
import { getUser } from "@/data-access/users";
import { authenticatedAction } from "@/lib/safe-action";
import {
  getBookmarkByIdUseCase,
  getBookmarksUseCase,
} from "@/use-cases/bookmarks";
import { revalidatePath } from "next/cache";
import { b } from "vitest/dist/suite-BWgaIsVn.js";
import { z } from "zod";

export const createBookmarkAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      path: z.string(),
      userId: z.number(),
      title: z.string(),
      content: z.string(),
      authorName: z.string(),
      authorImageURL: z.string().url(),
      authorProfileURL: z.string().url(),
      publicationName: z.string(),
      readTime: z.string(),
      publishDate: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const user = await getUser(input.userId);
    if (user !== undefined) {
      await createBookark(user.id, {
        title: input.title,
        content: input.content,
        authorName: input.authorName,
        authorImageURL: input.authorImageURL,
        authorProfileURL: input.authorProfileURL,
        publicationName: input.publicationName,
        readTime: input.readTime,
        publishDate: input.publishDate,
      });

      revalidatePath(input.path);
    }
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

export const getBookmarkByIdAction = authenticatedAction
  .createServerAction()
  .input(z.object({ id: z.number(), bookmarkId: z.number() }))
  .handler(async ({ input }) => {
    const user = await getUser(input.id);
    if (user !== undefined) {
      return await getBookmarkByIdUseCase(user.id, input.bookmarkId);
    }
  });

export const deleteBookmarkAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.number(), id: z.number() }))
  .handler(async ({ input }) => {
    const user = await getUser(input.userId);

    if (user !== undefined) {
      const bookmark = await getBookmarkById(user?.id, input.id);
      if (bookmark !== undefined) {
        await deleteBookmark(user.id, bookmark.id);
      }
      revalidatePath("/bookmarks");
    }
  });
