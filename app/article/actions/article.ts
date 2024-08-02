"use server";

import { MediumArticleProcessor } from "@/lib/parser";
import { urlSchema } from "@/schemas/url";

export type ArticleDetails = {
  title: string;
  content: string;
  authorInformation: {
    authorName: string | null;
    authorImageURL: string | null;
    authorProfileURL: string | null;
  };
  publicationInformation: {
    publicationName: string | null;
    readTime: string | null;
    publishDate: string | null;
  };
} | null;

export async function scrapeArticleContent(url: string) {
  try {
    const urlResult = urlSchema.safeParse(url);
    if (!urlResult.success) {
      throw new Error("Invalid URL");
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Connection: "keep-alive",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve the web page. Status code: ${response.status}`,
      );
    }

    const html = await response.text();

    const processor = new MediumArticleProcessor();
    const articleMetadata = (await processor.extractArticleMetadata(
      html,
    )) as ArticleDetails;

    if (!articleMetadata) {
      return null;
    }

    return {
      title: articleMetadata.title,
      content: articleMetadata.content,
      authorInformation: {
        ...articleMetadata.authorInformation,
        authorProfileURL: `https://medium.com${articleMetadata.authorInformation.authorProfileURL}`,
      },
      publicationInformation: {
        ...articleMetadata.publicationInformation,
      },
    };
  } catch (error) {
    console.error("Scraping failed:", error);
    return null;
  }
}
