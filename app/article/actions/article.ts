"use server";

import {
  scrapeArticleContent as scrapeArticleContentUseCase,
  type ArticleDetails,
} from "@/lib/article-content";

export type { ArticleDetails };

export async function scrapeArticleContent(url: string) {
  return scrapeArticleContentUseCase(url);
}
