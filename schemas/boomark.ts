import { z } from "zod";

export const articleSchema = z.object({
  title: z.string(),
  content: z.string(),
  articleImageSrc: z.string().url(),
  authorName: z.string(),
  authorImageURL: z.string().url(),
  authorProfileURL: z.string().url(),
  publicationName: z.string(),
  readTime: z.string(),
  publishDate: z.string(),
});
