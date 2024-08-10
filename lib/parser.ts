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
  text: string;
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
    '[aria-label="kicker paragraph"]',
  ];

  private textsToRemove = [
    "Sign in",
    "Get started",
    "Follow",
    "--",
    "Member-only story",
  ];

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

    // Recursively remove empty elements
    const removeEmptyElements = (element: cheerio.Cheerio) => {
      element.each((index, elem) => {
        const $elem = $(elem);
        if ($elem.children().length > 0) {
          removeEmptyElements($elem.children());
        }
        if (
          !$elem.text().trim() &&
          $elem.children().length === 0 &&
          !$elem.is("img, figure, picture, source")
        ) {
          $elem.remove();
        }
      });
    };

    removeEmptyElements($("*"));

    // Remove empty paragraphs and divs that are often left empty
    $("p, div").each((index, element) => {
      const $element = $(element);
      if ($element.text().trim() === "" && $element.children().length === 0) {
        $element.remove();
      }
    });

    return $.html();
  }

  private extractTextContent(html: string): string {
    const $ = cheerio.load(html);
    let extractedText = "";

    function processElement(element: cheerio.Cheerio) {
      element.contents().each((_, el) => {
        if (el.type === "text") {
          const text = $(el).text().trim();
          if (text) {
            extractedText += text + " ";
          }
        } else if (el.type === "tag") {
          const tagName = el.tagName.toLowerCase();

          if (
            ["p", "h1", "h2", "h3", "h4", "blockquote", "figcaption"].includes(
              tagName,
            )
          ) {
            processElement($(el));
            extractedText += "\n\n";
          } else if (tagName === "br") {
            extractedText += "\n";
          } else if (tagName === "li") {
            extractedText += "• "; // or use '- ' for unordered lists
            processElement($(el));
            extractedText += "\n";
          } else if (["ol", "ul"].includes(tagName)) {
            extractedText += "\n";
            processElement($(el));
            extractedText += "\n";
          } else if (tagName === "pre") {
            const preText = $(el).text().trim();
            if (preText) {
              extractedText += "```\n" + preText + "\n```\n\n";
            }
          } else {
            processElement($(el));
          }
        }
      });
    }

    processElement($("body"));
    return extractedText.replace(/\n{3,}/g, "\n\n").trim();
  }

  private processElement(
    $: cheerio.Root,
    element: cheerio.Cheerio,
    captured: Set<cheerio.Element>,
    elements: ArticleElement[],
    supportedTypes: ElementsType[],
  ): void {
    element.children().each((_, child) => {
      if (child.type !== "tag") return;

      const $child = $(child);
      const tagName = child.tagName.toLowerCase();
      const isFirstElement = elements.length === 0;

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

        const marginClass = isFirstElement ? "" : "mt-10 md:mt-12";
        elements.push({
          type: "IMG",
          content: $.html(`<div class="${marginClass}">${imgHtml}</div>`),
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
              ? `font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-1xl md:text-2xl ${
                  isFirstElement ? "" : "pt-12"
                }`
              : `font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-l md:text-xl ${
                  isFirstElement ? "" : "pt-8"
                }`
          }>${$child.html()}</${newTagName.toLowerCase()}>`,
        });
        captured.add(child);
        return; // Do not process children of this, as it's converted and captured
      }

      if (tagName === "a") {
        const href = $child.attr("href");
        if (href && href.startsWith("/")) {
          $child.attr("href", `https://medium.com${href}`);
        }

        elements.push({
          type: "A",
          content: $.html($child),
        });
        captured.add(child);
        return;
      }

      if (tagName === "p") {
        const cssClass = ["leading-8"]; // Default css class

        // Check if the previous element was an h3 or h4
        if (elements.length > 0) {
          const lastElement = elements[elements.length - 1];
          if (lastElement.type === "H3" || lastElement.type === "H4") {
            cssClass.push("mt-3");
          } else {
            cssClass.push("mt-7");
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
          cssClass.pop(); // Remove margin css class if it is a child of an important element
          cssClass.push("font-italic");
        }

        elements.push({
          type: "P",
          content: `<p class="${cssClass.join(" ")}">${$child.html()}</p>`,
        });
        captured.add(child);
        return;
      }

      if (
        supportedTypes.includes(tagName.toUpperCase() as ElementsType) &&
        !captured.has(child)
      ) {
        if (tagName === "a") {
          const href = $child.attr("href");
          if (href && href.startsWith("/")) {
            $child.attr("href", `https://medium.com${href}`);
            console.log(
              "Updated href for:",
              $child.html(),
              "to",
              $child.attr("href"),
            );
          }
        }

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
          supportedTypes,
        );
      });

      const finalHtml = elements.map((el) => el.content).join("");
      const wrappedHtml = `<div class="main-content mt-6">${finalHtml}</div>`;

      const textContent = this.extractTextContent(wrappedHtml);

      return { html: wrappedHtml, text: textContent };
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
        sectionElement.find('[data-testid="storyTitle"]').text().trim() ||
        "No title available",
      htmlContent: (
        await this.processArticleContent(sectionElement.html() as string)
      ).html,
      textContent: (
        await this.processArticleContent(sectionElement.html() as string)
      ).text,
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

    return metadata;
  }
}
