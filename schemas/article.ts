import { z } from "zod";

export const articleSchema = z.object({
  title: z.string(),
  content: z.string(),
  articleImageSrc: z.string().url().nullable(),
  authorName: z.string().nullable(),
  authorImageURL: z.string().url().nullable(),
  authorProfileURL: z.string().url().nullable(),
  publicationName: z.string().nullable(),
  readTime: z.string().nullable(),
  publishDate: z.string().nullable(),
});

export const readingHistorySchema = z.object({
  title: z.string(),
  authorName: z.string(),
  // articleTitle: z.string(),
  articleUrl: z.string().url(),
  authorImageURL: z.string().url(),
  authorProfileURL: z.string().url(),
  readTime: z.string(),
  accessTime: z.date(),
  progress: z.string().optional(),
});
