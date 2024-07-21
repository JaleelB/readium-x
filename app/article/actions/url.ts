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
  url: string | URL
): Promise<string | Error> => {
  try {
    // Validate and parse the input URL
    const validatedUrl = urlSchema.parse(
      typeof url === "string" ? url : url.href
    );

    // Check if the URL is reachable and valid for the intended use
    const isReachable = await checkUrlReachability(validatedUrl);
    if (!isReachable) {
      return new Error(
        "URL is not reachable or does not point to a valid article."
      );
    }

    // Construct the full URL to bypass the paywall using Google's web cache
    const baseUrl = "https://webcache.googleusercontent.com/search?q=cache:";
    const fullUrl = `${baseUrl}${validatedUrl}&strip=0&vwsrc=0`;

    return fullUrl;
  } catch (error) {
    // Handle validation and unexpected errors
    if (error instanceof z.ZodError) {
      return new Error(
        `Invalid URL: ${error.errors.map((e) => e.message).join(", ")}`
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
