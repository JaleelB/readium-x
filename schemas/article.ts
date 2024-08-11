import { z } from "zod";

export const articleSchema = z.object({
  title: z.string(),
  textContent: z.string(),
  htmlContent: z.string(),
  articleUrl: z.string().url(),
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
  articleUrl: z.string().url(),
  authorImageURL: z.string().url(),
  authorProfileURL: z.string().url(),
  readTime: z.string(),
  accessTime: z.date(),
  progress: z.string().optional(),
});

export const bookmarkSchema = articleSchema.extend({
  id: z.number(),
  userId: z.number(),
  updatedAt: z.date().nullable().optional(),
  createdAt: z.date().optional(),
});
