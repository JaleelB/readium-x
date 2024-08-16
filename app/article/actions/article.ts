"use server";

import { MediumArticleProcessor } from "@/lib/parser";
import { urlSchema } from "@/schemas/url";
import { getUrlWithoutPaywall } from "./url";
import { rateLimitByIp } from "@/lib/limiter";

export type ArticleDetails = {
  title: string;
  htmlContent: string;
  textContent: string;
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
};

export async function scrapeArticleContent(
  url: string,
): Promise<ArticleDetails | { error: string }> {
  try {
    await rateLimitByIp({
      key: "scrape-article-content",
      limit: 10,
      window: 60000,
    });
    const urlResult = urlSchema.safeParse(url);
    if (!urlResult.success) {
      throw new Error("Invalid URL");
    }

    const urlWithoutPaywall = await getUrlWithoutPaywall(url);
    if (urlWithoutPaywall instanceof Error) {
      throw new Error("Unable to get URL without paywall");
    }

    const response = await fetch(urlWithoutPaywall.url, {
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
      urlWithoutPaywall.type,
    )) as ArticleDetails;

    if (!articleMetadata) {
      throw new Error("Unable to extract article metadata");
    }

    return {
      title: articleMetadata.title,
      htmlContent: articleMetadata.htmlContent,
      textContent: articleMetadata.textContent,
      authorInformation: {
        ...articleMetadata.authorInformation,
      },
      publicationInformation: {
        ...articleMetadata.publicationInformation,
      },
    };
  } catch (error) {
    console.error("Scraping failed:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to scrape extract article metadata",
    };
  }
}
