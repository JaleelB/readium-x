"use server";

import { ArticleElement, MediumArticleProcessor } from "@/lib/parser";
import { urlSchema } from "@/schemas/url";
import { load } from "cheerio";

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
  try {
    const baseUrl = "https://webcache.googleusercontent.com/search?q=cache:";
    const fullUrl = `${baseUrl}${url}&strip=0&vwsrc=0`;

    console.log("fullUrl: ", fullUrl);

    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to retrieve the web page. Status code: ${response.status}`
      );
    }

    const html = await response.text();
    const $ = load(html);

    const processor = new MediumArticleProcessor();

    // const { strippedArticleContent } = processor.stripHTML(html);

    // const section= $("section").first()
    // const sectionElement = $("section").first().html();
    // const $ = load(strippedArticleContent as string);
    const sectionElement = $("article").first();
    // console.log("sectionElement: ", sectionElement.html());
    const articleTitle = sectionElement
      ? sectionElement.find("h1").first().text().trim()
      : "No title available";

    const content = await processor.processArticle(html);

    // author information
    const authorName = sectionElement
      ? $(sectionElement).find('a[data-testid="authorName"]').text().trim()
      : null;

    const authorProfileURL = sectionElement
      ? $(sectionElement).find('a[data-testid="authorName"]').attr("href") ??
        null
      : null;

    const authorImageURL = sectionElement
      ? $(sectionElement).find('img[data-testid="authorPhoto"]').attr("src") ??
        null
      : null;

    // publication information
    const readTime = sectionElement
      ? $(sectionElement)
          .find('span[data-testid="storyReadTime"]')
          .text()
          .trim()
      : null;

    const publishDate = sectionElement
      ? $(sectionElement)
          .find('span[data-testid="storyPublishDate"]')
          .text()
          .trim()
      : null;

    const publicationName = sectionElement
      ? $(sectionElement).find('a[data-testid="publicationName"]').text().trim()
      : null;

    return {
      title: articleTitle,
      content: content.html,
      articleImageSrc: null,
      authorInformation: {
        authorName: authorName,
        authorImageURL: authorImageURL,
        authorProfileURL: `https://medium.com${authorProfileURL}`,
      },
      publicationInformation: {
        publicationName: publicationName,
        readTime: readTime,
        publishDate: publishDate,
      },
    };
  } catch (error) {
    console.error("Scraping failed:", error);
    return null;
  }
}
