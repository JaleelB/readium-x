"use server";

import { urlSchema } from "@/schemas/url";
import { z } from "zod";

export const checkUrlReachability = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: "HEAD", // Use HEAD to fetch headers only for faster response
    });
    return response.ok;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return false;
  }
};

export const getUrlWithoutPaywall = async (
  url: string | URL,
): Promise<string | Error> => {
  try {
    // Validate and parse the input URL
    const validatedUrl = urlSchema.parse(
      typeof url === "string" ? url : url.href,
    );

    // Check if the URL is reachable and valid for the intended use
    const isReachable = await checkUrlReachability(validatedUrl);
    if (!isReachable) {
      return new Error(
        "URL is not reachable or does not point to a valid article.",
      );
    }

    const isMedium = await validateMediumArticle(validatedUrl);
    if (isMedium) {
      const isFree = await isMediumArticleFree(validatedUrl);
      if (isFree instanceof Error) {
        return isFree;
      }
      if (!isFree) {
        // If it's not free, return the Google cache URL
        const baseUrl =
          "https://webcache.googleusercontent.com/search?q=cache:";
        return `${baseUrl}${validatedUrl}&strip=0&vwsrc=0`;
      }
      // If it's free, return the original URL
      return validatedUrl;
    }

    // Construct the full URL to bypass the paywall using Google's web cache
    const baseUrl = "https://webcache.googleusercontent.com/search?q=cache:";
    const fullUrl = `${baseUrl}${validatedUrl}&strip=0&vwsrc=0`;

    return fullUrl;
  } catch (error) {
    // Handle validation and unexpected errors
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
