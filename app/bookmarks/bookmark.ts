"use server";

import {
  createBookark,
  deleteBookmark,
  getBookmarkById,
} from "@/data-access/bookmarks";
import { rateLimitByIp } from "@/lib/limiter";
import { authenticatedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createBookmarkAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      path: z.string(),
      userId: z.string(),
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
  .handler(async ({ input, ctx }) => {
    await rateLimitByIp({ key: "create-bookmark", limit: 5, window: 30000 });
    const bookmark = await createBookark(ctx.user.id, {
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
    revalidatePath(input.path);
    return bookmark;
  });

export const deleteBookmarkAction = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.string(), id: z.number(), path: z.string() }))
  .handler(async ({ input, ctx }) => {
    const bookmark = await getBookmarkById(ctx.user.id, input.id);
    if (bookmark !== undefined) {
      await deleteBookmark(ctx.user.id, bookmark.id);
      revalidatePath(input.path);
    }
    return bookmark;
  });
