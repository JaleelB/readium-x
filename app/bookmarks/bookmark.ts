"use server";

import { createBookark } from "@/data-access/bookmarks";
import { getUser } from "@/data-access/users";
import { authenticatedAction } from "@/lib/safe-action";
import { z } from "zod";

export const createBookmarkAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
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
    }
  });
