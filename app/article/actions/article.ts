"use server";

import { MediumArticleProcessor } from "@/lib/parser";

export type ArticleDetails = {
  title: string;
  content: string;
  // articleImageSrc: string | null;
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

    const baseUrl = "https://webcache.googleusercontent.com/search?q=cache:"; // refactor the getURLWithoutPaywall function to use this base URL
    const fullUrl = `${baseUrl}${url}&strip=0&vwsrc=0`;

    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to retrieve the web page. Status code: ${response.status}`
      );
    }

    const html = await response.text();

    const processor = new MediumArticleProcessor();
    const articleMetadata = (await processor.extractArticleMetadata(
      html
    )) as ArticleDetails;

    if (!articleMetadata) {
      return null;
    }

    return {
      title: articleMetadata.title,
      content: articleMetadata.content,
      // articleImageSrc: articleMetadata.articleImageSrc,
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
