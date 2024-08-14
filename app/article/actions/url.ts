"use server";

import { urlSchema } from "@/schemas/url";
import { z } from "zod";
import * as cheerio from "cheerio";

export type UrlType =
  | "medium"
  | "webcache"
  | "archive"
  | "freedium"
  | "original";

interface UrlResult {
  url: string;
  type: UrlType;
}

async function tryUrlWithService(
  baseUrl: string,
  articleUrl: string,
): Promise<string | null> {
  if (baseUrl.includes("archive.ph")) {
    // Special handling for archive.ph
    const searchUrl = `https://archive.ph/${encodeURIComponent(articleUrl)}`;
    console.log("Trying archive.ph with URL:", searchUrl);
    try {
      const response = await fetch(searchUrl);
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        const archiveLink = $(".TEXT-BLOCK a").first().attr("href");
        if (archiveLink) {
          return archiveLink.startsWith("http")
            ? archiveLink
            : `https://archive.ph${archiveLink}`;
        }
      }
    } catch (error) {
      console.error("Error fetching from archive.ph:", error);
    }
    return null;
  }

  const fullUrl = `${baseUrl}${encodeURIComponent(articleUrl)}`;
  console.log("Trying URL with service:", fullUrl);
  try {
    const response = await fetch(fullUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Connection: "keep-alive",
      },
    });
    console.log("Response status:", response.status);
    return response.ok ? fullUrl : null;
  } catch {
    return null;
  }
}

export const getUrlWithoutPaywall = async (
  url: string | URL,
): Promise<UrlResult | Error> => {
  try {
    const validatedUrl = urlSchema.parse(
      typeof url === "string" ? url : url.href,
    );

    const isMedium = await validateMediumArticle(validatedUrl);
    if (isMedium) {
      const isFree = await isMediumArticleFree(validatedUrl);
      if (isFree instanceof Error) {
        return isFree;
      }
      if (isFree) {
        return { url: validatedUrl, type: "medium" }; // Return original URL for free articles
      }

      // For paywalled articles, try different services
      const services = [
        {
          url: `https://webcache.googleusercontent.com/search?q=cache:`,
          type: "webcache" as UrlType,
        },
        // { url: `https://archive.ph/`, type: "archive" as UrlType },
        { url: `https://freedium.cfd/`, type: "freedium" as UrlType },
      ];

      for (const service of services) {
        const result = await tryUrlWithService(service.url, validatedUrl);
        if (result) {
          return { url: result, type: service.type };
        }
      }

      // If all services fail, try fetching the original URL without cookies
      try {
        const response = await fetch(validatedUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            Connection: "keep-alive",
          },
        });
        if (response.ok) {
          return { url: validatedUrl, type: "original" };
        }
      } catch (error) {
        console.error("Error fetching without cookies:", error);
      }

      // If all attempts fail, return an error
      return new Error(
        "Unable to bypass paywall. Article might not be accessible.",
      );
    }

    // For non-Medium URLs, return the original URL
    return { url: validatedUrl, type: "original" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Error(
        `Invalid URL: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    }
    return new Error("An error occurred while processing the URL.");
  }
};

export async function validateMediumArticle(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });
    if (!response.body) throw new Error("Response body is null");

    // streaming response body to check for meta tags
    const reader = response.body.getReader();
    let body = "";
    let completed = false;

    while (!completed) {
      const { done, value } = await reader.read();
      if (done) break;

      body += new TextDecoder().decode(value);
      if (body.includes("</head>")) {
        completed = true;
      }
    }

    const metaTagRegex =
      /<meta[^>]+(property="og:site_name"[^>]+content="Medium"|name="twitter:site"[^>]+content="@Medium")[^>]*>/;
    const isMedium = metaTagRegex.test(body);

    return isMedium;
  } catch (error) {
    console.error("Failed to fetch or parse the URL:", error);
    return false;
  }
}

export async function isMediumArticleFree(
  url: string,
): Promise<boolean | Error> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });

    if (!response.ok) {
      return new Error("Failed to fetch the article");
    }

    const html = await response.text();

    // Check for indicators of a paywalled article
    const paywallIndicators = [
      'class="meteredContent"',
      'id="paywall-upsell-button-upgrade"',
      'class="paywall-upsell-button-upgrade"',
      "Your membership has expired",
      "Become a member to read this story",
      "Get unlimited access to Medium",
      "The writer made this a member-only story.",
    ];

    for (const indicator of paywallIndicators) {
      if (html.includes(indicator)) {
        return false; // Article is behind a paywall
      }
    }

    // Check for "Upgrade now" link using regex
    const upgradeNowRegex =
      /<a[^>]*href="\/plans\?source=upgrade_membership[^>]*>Upgrade now<\/a>/i;
    if (upgradeNowRegex.test(html)) {
      return false; // Article is behind a paywall
    }

    // If none of the paywall indicators are found, assume the article is free
    return true;
  } catch (error) {
    console.error("Error checking Medium article accessibility:", error);
    return new Error("Failed to determine article accessibility");
  }
}
