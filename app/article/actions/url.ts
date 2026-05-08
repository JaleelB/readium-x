"use server";

import { urlSchema } from "@/schemas/url";
import { z } from "zod";
import * as cheerio from "cheerio";

export type UrlType =
  | "medium"
  | "archive"
  | "freedium"
  | "original";

export interface UrlResult {
  url: string;
  type: UrlType;
}

export async function resolveArchiveUrl(
  articleUrl: string,
): Promise<string | null> {
  const searchUrl = `https://archive.ph/${encodeURIComponent(articleUrl)}`;
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

export const getUrlWithoutPaywall = async (
  url: string | URL,
): Promise<UrlResult[] | Error> => {
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
        return [
          { url: validatedUrl, type: "medium" }, // Try original URL first
          {
            url: `https://freedium-mirror.cfd/${validatedUrl}`,
            type: "freedium",
          },
        ];
      }

      // For paywalled articles, return the fallback sequence
      return [
        {
          url: `https://freedium-mirror.cfd/${validatedUrl}`,
          type: "freedium",
        },
        { url: validatedUrl, type: "original" },
      ];
    }

    // For non-Medium URLs, return the original URL
    return [{ url: validatedUrl, type: "original" }];
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

import { hasPaywallIndicators } from "@/lib/parser";

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

    return !hasPaywallIndicators(html);
  } catch (error) {
    console.error("Error checking Medium article accessibility:", error);
    return new Error("Failed to determine article accessibility");
  }
}
