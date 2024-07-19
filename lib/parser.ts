import * as cheerio from "cheerio";
import { type ArticleDetails as ArticleMetadata } from "@/app/article/actions/article";

type ElementsType =
  | "H1"
  | "H2"
  | "H3"
  | "H4"
  | "IMG"
  | "P"
  | "UL"
  | "OL"
  | "LI"
  | "PRE"
  | "BLOCKQUOTE"
  | "PQ"
  | "STRONG"
  | "EM"
  | "A"
  | "CODE"
  | "STRIKE"
  | "MARK"
  | "SUP"
  | "SUB"
  | "FIGCAPTION"
  | "DIV";

export interface ArticleElement {
  type: ElementsType;
  content: string;
}

interface Article {
  html: string;
}

export class MediumArticleProcessor {
  constructor() {}

  private stripIdentifiers = [
    '[aria-labelledby="postFooterSocialMenu"]',
    '[data-testid="audioPlayButton"]',
    '[data-testid="headerSocialShareButton"]',
    '[data-testid="headerBookmarkButton"]',
    '[aria-label="responses"]',
    '[data-testid="headerClapButton"]',
    '[data-testid="storyPublishDate"]',
    '[data-testid="storyReadTime"]',
    '[data-testid="authorName"]',
    '[href="/@benulansey"]',
    '[data-testid="publicationName"]',
    '[data-testid="authorPhoto"]',
    '[data-testid="publicationPhoto"]',
    '[data-testid="storyTitle"]',
    ".pw-subtitle-paragraph",
  ];

  private textsToRemove = ["Sign in", "Get started", "Follow", "--"];

  private stripHTML(html: string): string {
    const $ = cheerio.load(html);

    // Remove elements by CSS selectors and attributes
    this.stripIdentifiers.forEach((identifier) => {
      try {
        if (identifier.includes("=")) {
          // More robust splitting that handles cases where value might include '='
          const match = identifier.match(/^\[([^=\]]+)=["']?(.*?)["']?\]$/);
          if (match) {
            const attr = match[1];
            const value = match[2];
            $(`[${attr}="${value}"]`).remove();
          } else {
            console.error("Invalid attribute selector:", identifier);
          }
        } else {
          $(identifier).remove(); // Normal CSS selector
        }
      } catch (error) {
        console.error("Error processing selector:", identifier, error);
      }
    });

    // Remove elements by matching text content
    this.textsToRemove.forEach((text) => {
      $("*")
        .contents()
        .filter(function (this: cheerio.Element) {
          // Explicitly return a boolean
          return (
            this.type === "text" && !!this.data && this.data.includes(text)
          );
        })
        .parent()
        .remove();
    });

    $(`*`).each((index, element) => {
      const $element = $(element);
      // Check if the element is effectively empty
      if (
        $element.children().length === 0 &&
        !$element.text().trim() &&
        !$element.is("img, figure, picture, source")
      ) {
        $element.remove();
      }
    });

    $('a[rel="noopener follow"]').each((index, element) => {
      const $element = $(element);
      // Check if the link does not contain meaningful content
      if ($element.text().trim() === "" && $element.find("img").length === 0) {
        $element.remove();
      }
    });

    // Remove empty paragraphs and divs that are often left empty
    $("p, div").each((index, element) => {
      const $element = $(element);
      if ($element.text().trim() === "" && $element.children().length === 0) {
        $element.remove();
      }
    });

    return $.html();
  }

  private processElement(
    $: cheerio.Root,
    element: cheerio.Cheerio,
    captured: Set<cheerio.Element>,
    elements: ArticleElement[],
    supportedTypes: ElementsType[]
  ): void {
    element.children().each((_, child) => {
      if (child.type !== "tag") return;

      const $child = $(child);
      const tagName = child.tagName.toLowerCase();

      if (tagName === "picture") {
        // Process picture tag specifically
        const img = $child.find("img");
        if (!img.attr("src") && img.length) {
          const firstSource = $child.find("source").first();
          const srcset = firstSource.attr("srcset");
          const firstSrc = srcset?.split(",")[0].split(" ")[0]; // Take the first URL from srcset
          img.attr("src", firstSrc as string);
          img.attr("class", "pt-5 lazy m-auto w-full max-w-full rounded-lg");
        }
        const imgHtml = $.html(img);
        elements.push({
          type: "IMG",
          content: $.html(`<div class="mt-10 md:mt-12">${imgHtml}</div>`),
        });
        captured.add(child);
        return; // Do not process children of picture, as they are already captured
      }

      if (tagName === "h1" || tagName === "h2") {
        const newTagName = tagName === "h1" ? "H3" : "H4"; // Convert h1 to h3 and h2 to h4
        elements.push({
          type: newTagName as ElementsType,
          content: `<${newTagName.toLowerCase()} class=${
            tagName === "h1"
              ? "font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-1xl md:text-2xl pt-12"
              : "font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-l md:text-xl pt-8"
          }>${$child.html()}</${newTagName.toLowerCase()}>`,
        });
        captured.add(child);
        return; // Do not process children of this, as it's converted and captured
      }

      if (tagName === "p") {
        const cssClass = ["mt-7"]; // Default css class

        // Check if the previous element was an h3 or h4
        if (elements.length > 0) {
          const lastElement = elements[elements.length - 1];
          if (lastElement.type === "H3" || lastElement.type === "H4") {
            // cssClass = "mt-3";
            cssClass.pop();
            cssClass.push("mt-3");
          }
        }

        // Safe check for parent's tagName
        const parentElement = $child.parent()[0];
        const parentTagName =
          parentElement && parentElement.type === "tag"
            ? parentElement.tagName.toLowerCase()
            : "";

        // Check if the paragraph is a direct child of an important element
        if (["blockquote", "a", "figure"].includes(parentTagName)) {
          // cssClass = ""; // Remove css class if it is a child of an important element
          cssClass.pop();
          cssClass.push("font-italic");
        }

        elements.push({
          type: "P",
          content: `<p class="leading-8 ${cssClass.join(
            " "
          )}">${$child.html()}</p>`,
        });
        captured.add(child);
        return;
      }

      if (
        supportedTypes.includes(tagName.toUpperCase() as ElementsType) &&
        !captured.has(child)
      ) {
        elements.push({
          type: tagName.toUpperCase() as ElementsType,
          content: $.html($child),
        });
        captured.add(child);
      } else {
        this.processElement($, $child, captured, elements, supportedTypes);
      }
    });
  }

  public async processArticleContent(html: string): Promise<Article> {
    try {
      const $ = cheerio.load(html);

      const elements: ArticleElement[] = [];

      // Supported tags
      const supportedTypes: ElementsType[] = [
        "H1",
        "H2",
        "H3",
        "H4",
        "IMG",
        "P",
        "UL",
        "OL",
        "PRE",
        "BLOCKQUOTE",
        "PQ",
        "STRONG",
        "EM",
        "A",
        "STRIKE",
        "MARK",
        "SUP",
        "SUB",
        "FIGCAPTION",
      ];

      // Initial empty set to keep track of captured elements
      const capturedElements = new Set<cheerio.Element>();
      const sectionElement = $("section");
      const sectionHtmlContent = this.stripHTML($.html(sectionElement));

      // Start processing from the section level
      $(sectionHtmlContent).each((_, section) => {
        const $section = cheerio.load(section);

        this.processElement(
          $,
          $section("section"),
          capturedElements,
          elements,
          supportedTypes
        );
      });

      const finalHtml = elements.map((el) => el.content).join("");
      const wrappedHtml = `<div class="main-content mt-8">${finalHtml}</div>`;

      return { html: wrappedHtml };
    } catch (error) {
      console.error("Error scraping article:", error);
      throw error;
    }
  }

  public async extractArticleMetadata(html: string): Promise<ArticleMetadata> {
    const $ = cheerio.load(html);
    const sectionElement = $("article").first();

    const metadata: ArticleMetadata = {
      title:
        sectionElement.find("h1").first().text().trim() || "No title available",
      content: (
        await this.processArticleContent(sectionElement.html() as string)
      ).html,
      authorInformation: {
        authorName:
          sectionElement.find('a[data-testid="authorName"]').text().trim() ||
          null,
        authorProfileURL:
          sectionElement.find('a[data-testid="authorName"]').attr("href") ||
          null,
        authorImageURL:
          sectionElement.find('img[data-testid="authorPhoto"]').attr("src") ||
          null,
      },
      publicationInformation: {
        readTime:
          sectionElement
            .find('span[data-testid="storyReadTime"]')
            .text()
            .trim() || null,
        publishDate:
          sectionElement
            .find('span[data-testid="storyPublishDate"]')
            .text()
            .trim() || null,
        publicationName:
          sectionElement
            .find('a[data-testid="publicationName"]')
            .text()
            .trim() || null,
      },
    };

    console.log("article content:", metadata.content);

    return metadata;
  }
}
