import { MediumArticleProcessor, hasPaywallIndicators } from "@/lib/parser";
import { urlSchema } from "@/schemas/url";
import {
  getUrlWithoutPaywall,
  resolveArchiveUrl,
} from "@/app/article/actions/url";
import { rateLimitByIp } from "@/lib/limiter";
import { getCachedArticle, setCachedArticle } from "@/lib/article-cache";

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
    const urlResult = urlSchema.safeParse(url);
    if (!urlResult.success) {
      throw new Error("Invalid URL");
    }

    const cachedArticle = await getCachedArticle(urlResult.data);
    if (cachedArticle) {
      return cachedArticle;
    }

    await rateLimitByIp({
      key: "scrape-article-content",
      limit: 10,
      window: 60000,
    });

    const fallbackUrls = await getUrlWithoutPaywall(urlResult.data);

    if (fallbackUrls instanceof Error) {
      throw new Error("Unable to fetch paywalled article");
    }

    let articleDetails: ArticleDetails | null = null;

    for (const service of fallbackUrls) {
      console.log(`Trying bypass service: ${service.type} - ${service.url}`);

      let fetchUrl = service.url;
      if (service.type === "archive") {
        const archiveUrl = await resolveArchiveUrl(service.url);
        if (!archiveUrl) {
          console.log("Failed to resolve archive URL, skipping...");
          continue;
        }
        fetchUrl = archiveUrl;
      }

      try {
        const response = await fetch(fetchUrl, {
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
          console.log(
            `Fetch failed with status ${response.status} for ${service.type}`,
          );
          continue;
        }

        const html = await response.text();

        if (hasPaywallIndicators(html)) {
          console.log(
            `Service ${service.type} returned paywalled teaser content. Skipping...`,
          );
          continue;
        }

        const processor = new MediumArticleProcessor();
        const articleMetadata = (await processor.extractArticleMetadata(
          html,
          service.type,
        )) as ArticleDetails;

        if (articleMetadata) {
          articleDetails = {
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
          console.log(`Successfully extracted article via ${service.type}`);
          break; // Success! Break out of the fallback loop.
        } else {
          console.log(`Failed to extract metadata via ${service.type}`);
        }
      } catch (err) {
        console.error(`Error processing ${service.type}:`, err);
      }
    }

    if (!articleDetails) {
      throw new Error(
        "Unable to locate article content after trying all bypass methods",
      );
    }

    await setCachedArticle(urlResult.data, articleDetails);

    return articleDetails;
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
