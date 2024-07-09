"use server";

import {
  createBookark,
  deleteBookmark,
  getBookmarkById,
} from "@/data-access/bookmarks";
import { getUser } from "@/data-access/users";
import { authenticatedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createBookmarkAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      path: z.string(),
      userId: z.number(),
      title: z.string(),
      content: z.string(),
      articleImageSrc: z.string().url(),
      authorName: z.string(),
      authorImageURL: z.string().url(),
      authorProfileURL: z.string().url(),
      publicationName: z.string(),
      readTime: z.string(),
      publishDate: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const user = await getUser(input.userId);
    if (user !== undefined) {
      await createBookark(user.id, {
        title: input.title,
        content: input.content,
        articleImageSrc: input.articleImageSrc,
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

export const deleteBookmarkAction = authenticatedAction
  .createServerAction()
  .input(z.object({ id: z.number() }))
  .handler(async ({ input }) => {
    const bookmark = await getBookmarkById(input.id);
    if (bookmark !== undefined) {
      await deleteBookmark(bookmark.id);
    }
    revalidatePath("/bookmarks");
  });
