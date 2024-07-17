"use server";

import { ArticleElement, MediumArticleProcessor } from "@/lib/parser";
import { urlSchema } from "@/schemas/url";
import { load } from "cheerio";

type ArticleURL = typeof urlSchema;
export type ArticleDetails = {
  title: string;
  // content: string | null;
  // content: {
  //   title: string;
  //   elements: ArticleElement[];
  // };
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

    // const articleTitle = sectionElement
    //   ? strippedArticleContent.find("h1").first().text().trim()
    //   : "No title available";

    const content = await processor.processArticle(html);
    console.log("content: ", content);

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
  // } finally {
  //   await browser.close();
  // }
}
// "use server";

// import { urlSchema } from "@/schemas/url";
// import { load } from "cheerio";

// type ArticleURL = typeof urlSchema;
// export type ArticleDetails = {
//   title: string;
//   content: string;
//   articleImageSrc: string | null;
//   authorInformation: {
//     authorName: string | null;
//     authorImageURL: string | null;
//     authorProfileURL: string | null;
//   };
//   publicationInformation: {
//     publicationName: string | null;
//     readTime: string | null;
//     publishDate: string | null;
//   };
// } | null;

// export async function scrapeArticleContent(url: string | ArticleURL) {
//   try {
//     const response = await fetch(url.toString(), {
//       method: "GET",
//       headers: {
//         "User-Agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
//       },
//     });
//     if (!response.ok) {
//       throw new Error(
//         `Failed to retrieve the web page. Status code: ${response.status}`
//       );
//     }

//     const html = await response.text();
//     const $ = load(html);

//     // Remove script tag and content before <html>
//     $('script:contains("window.main();")').remove();

//     // Article information
//     const articleContent = $(".main-content").html();
//     const articleTitle = $("h1").first().text().trim();
//     const articleImageSrc = $("img[alt='Preview image']").attr("src") ?? null;

//     // Author information
//     const authorName =
//       $("a[title][href*='/@']").find("img").attr("alt") ?? null;
//     const authorImageURL =
//       $("a[title][href*='/@']").find("img").attr("src") ?? null;
//     const authorProfileURL = $("a[title][href*='/@']").attr("href") ?? null;
//     console.log("authorProfileURL: ", authorProfileURL);

//     // Publication information
//     const publicationName = $("a[target='_blank'][previewListener='true']")
//       .text()
//       .trim();
//     const readTime = $("span")
//       .filter((_, el) => $(el).text().includes("min read"))
//       .text()
//       .trim();
//     const publishDate = $("span")
//       .filter((_, el) => $(el).text().includes("Updated:"))
//       .text()
//       .trim();

//     if (!articleContent) {
//       throw new Error("Failed to scrape article content");
//     }

//     return {
//       title: articleTitle,
//       content: articleContent,
//       articleImageSrc,
//       authorInformation: {
//         authorName,
//         authorImageURL,
//         authorProfileURL: `https://medium.com${authorProfileURL}`,
//       },
//       publicationInformation: {
//         publicationName,
//         readTime,
//         publishDate,
//       },
//     };
//   } catch (error) {
//     console.error("Scraping failed:", error);
//     return null;
//   }
// }
