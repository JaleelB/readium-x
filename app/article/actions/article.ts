"use server";

import playwright from "playwright";
import { urlSchema } from "@/schemas/url";

type ArticleURL = typeof urlSchema;
export type ArticleDetails = {
  title: string;
  content: string;
  articleImageSrc: string | null;
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

export async function scrapeArticleContent(url: string | ArticleURL) {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url as unknown as string, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    await page.waitForTimeout(5000); // Wait for the page to load.

    const articleTitle = await page.$eval(
      "h1",
      (el) => el?.innerHTML ?? "No title available"
    );
    const articleContent = await page.$eval(
      ".main-content",
      (div) => div.outerHTML
    );
    // Extract the main image from the article
    const articleImageSrc = await page.$eval(
      "img[alt='Preview image']",
      (img) => (img as HTMLImageElement)?.src ?? null
    );

    const authorInfo = await page.evaluate(() => {
      const authorElement = document.querySelector(
        "a[title][href*='/@']"
      ) as HTMLAnchorElement;
      if (!authorElement) {
        return {
          authorName: null,
          authorImageURL: null,
          authorProfileURL: null,
        };
      }

      const authorName = authorElement.querySelector("img")?.alt.trim() ?? null;
      const authorImageURL = authorElement.querySelector("img")?.src ?? null;
      const authorProfileURL = authorElement.getAttribute("href") ?? null;

      return { authorName, authorImageURL, authorProfileURL };
    });

    const publicationInfo = await page.evaluate(() => {
      const infoSection = document.querySelector(
        "div.px-4.pb-2"
      ) as HTMLElement;

      if (!infoSection) {
        return {
          publicationName: null,
          readTime: null,
          publishDate: null,
        };
      }

      // Extract publication if available
      const publicationLink = infoSection.querySelector(
        'a[target="_blank"][previewListener="true"]'
      );
      const publicationName = publicationLink?.textContent?.trim() ?? null;

      // Extract read time by checking the text content directly
      const readTimeElement = Array.from(
        infoSection.querySelectorAll("span")
      ).find((span) => span.textContent?.includes("min read"));
      const readTime = readTimeElement?.textContent?.trim() ?? null;

      // Extract publish date
      const publishDateElement = Array.from(
        infoSection.querySelectorAll("span")
      ).find((span) => span.textContent?.includes("Updated:"));
      const publishDate = publishDateElement?.textContent?.trim() ?? null;

      return { publicationName, readTime, publishDate };
    });

    if (!articleContent.length) {
      throw new Error("Failed to scrape article content");
    }

    return {
      title: articleTitle,
      content: articleContent,
      articleImageSrc,
      authorInformation: {
        ...authorInfo,
      },
      publicationInformation: {
        ...publicationInfo,
      },
    };
  } catch (error) {
    console.error("Scraping failed:", error);
    return null;
  } finally {
    await browser.close();
  }
}
