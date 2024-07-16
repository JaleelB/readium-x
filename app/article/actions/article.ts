"use server";

import { urlSchema } from "@/schemas/url";
import { load } from "cheerio";

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

export async function scrapeArticleContent(url: string) {
  console.log("Scraping article content from:", url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to retrieve the web page. Status code: ${response.status}`
      );
    }

    const html = await response.text();
    const $ = load(html);

    // Remove script tag and content before <html>
    $('script:contains("window.main();")').remove();

    // Article information
    const articleContent = $(".main-content").html();
    const articleTitle = $("h1").first().text().trim();
    const articleImageSrc = $("img[alt='Preview image']").attr("src") ?? null;

    // Author information
    const authorName =
      $("a[title][href*='/@']").find("img").attr("alt") ?? null;
    const authorImageURL =
      $("a[title][href*='/@']").find("img").attr("src") ?? null;
    const authorProfileURL = $("a[title][href*='/@']").attr("href") ?? null;
    console.log("authorProfileURL: ", authorProfileURL);

    // Publication information
    const publicationName = $("a[target='_blank'][previewListener='true']")
      .text()
      .trim();
    const readTime = $("span")
      .filter((_, el) => $(el).text().includes("min read"))
      .text()
      .trim();
    const publishDate = $("span")
      .filter((_, el) => $(el).text().includes("Updated:"))
      .text()
      .trim();

    if (!articleContent) {
      throw new Error("Failed to scrape article content");
    }

    return {
      title: articleTitle,
      content: articleContent,
      articleImageSrc,
      authorInformation: {
        authorName,
        authorImageURL,
        authorProfileURL: `https://medium.com${authorProfileURL}`,
      },
      publicationInformation: {
        publicationName,
        readTime,
        publishDate,
      },
    };
  } catch (error) {
    console.error("Scraping failed:", error);
    return null;
  }
}
