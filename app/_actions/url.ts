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
    const validatedUrl = urlSchema.parse(
      typeof url === "string" ? url : url.href
    );

    const isReachable = await checkUrlReachability(validatedUrl);
    if (!isReachable) {
      return new Error(
        "URL is not reachable or does not point to a valid Medium article."
      );
    }

    const urlObj = new URL(validatedUrl);

    // Replace the hostname with freedium domain
    urlObj.host = "freedium.cfd";

    return urlObj.href;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Error(
        `Invalid URL: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    return new Error("An error occurred while processing the URL.");
  }
};
