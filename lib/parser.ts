import * as cheerio from "cheerio";
import ejs from "ejs";

type ParagraphType =
  | "H3"
  | "H4"
  | "IMG"
  | "P"
  | "ULI"
  | "OLI"
  | "PRE"
  | "BQ"
  | "PQ";

type MarkupType =
  | "STRONG"
  | "EM"
  | "A"
  | "CODE"
  | "STRIKE"
  | "MARK"
  | "SUP"
  | "SUB";

type ElementsType =
  | "H3"
  | "H4"
  | "IMG"
  | "P"
  | "ULI"
  | "OLI"
  | "PRE"
  | "BQ"
  | "PQ"
  | "STRONG"
  | "EM"
  | "A"
  | "CODE"
  | "STRIKE"
  | "MARK"
  | "SUP"
  | "SUB"
  | "FIGCAPTION";

export interface ArticleElement {
  type: ParagraphType;
  content: string;
  markups?: Markup[];
}

interface Markup {
  type: MarkupType;
  start: number;
  end: number;
  href?: string;
}

interface Article {
  html: string;
}

export class MediumArticleProcessor {
  constructor() {}

  private renderTemplate(templateString: string, context: object): string {
    return ejs.render(templateString, context);
  }

  private parseMarkups($: cheerio.Root, element: cheerio.Cheerio): Markup[] {
    const markups: Markup[] = [];
    const content = element.text();

    element
      .find("strong, em, a, code, strike, mark, sup, sub")
      .each((_, el) => {
        const $el = $(el);
        const tagName = (el as cheerio.TagElement).tagName.toLowerCase();
        const start = content.indexOf($el.text());
        const end = start + $el.text().length;

        let markupType: MarkupType;
        switch (tagName) {
          case "strong":
            markupType = "STRONG";
            break;
          case "em":
            markupType = "EM";
            break;
          case "a":
            markupType = "A";
            break;
          case "code":
            markupType = "CODE";
            break;
          case "strike":
            markupType = "STRIKE";
            break;
          case "mark":
            markupType = "MARK";
            break;
          case "sup":
            markupType = "SUP";
            break;
          case "sub":
            markupType = "SUB";
            break;
          default:
            return; // Skip unsupported tags
        }

        const markup: Markup = { type: markupType, start, end };
        if (tagName === "a") {
          markup.href = $el.attr("href") || undefined;
        }
        markups.push(markup);
      });

    return markups;
  }

  // private stripHTML(html: string, identifiers: string[]): string {
  //   const $ = cheerio.load(html);
  //   identifiers.forEach((selector) => {
  //     $(selector).remove();
  //   });
  //   return $.html();
  // }
  private stripHTML(
    html: string,
    identifiers: string[],
    textsToRemove: string[]
  ): string {
    const $ = cheerio.load(html);

    // Remove elements by CSS selectors and attributes
    identifiers.forEach((identifier) => {
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
    textsToRemove.forEach((text) => {
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
        const img = $child.find("img");
        if (!img.attr("src") && img.length) {
          const firstSource = $child.find("source").first();
          const srcset = firstSource.attr("srcset");
          const firstSrc = srcset?.split(",")[0].split(" ")[0];
          img.attr("src", firstSrc as string);
        }
        const pictureHtml = $.html($child);
        elements.push({ type: "IMG", content: pictureHtml });
        captured.add(child);
        return;
      }
      if (
        supportedTypes.includes(tagName.toUpperCase() as ParagraphType) &&
        !captured.has(child)
      ) {
        elements.push({
          type: tagName.toUpperCase() as ParagraphType,
          content: $.html($child),
          markups: this.parseMarkups($, $child),
        });
        captured.add(child);
      } else {
        this.processElement($, $child, captured, elements, supportedTypes);
      }
    });
  }

  public async processArticle(html: string): Promise<Article> {
    try {
      const $ = cheerio.load(html);

      const elements: ArticleElement[] = [];

      // Supported tags
      const supportedTypes: ElementsType[] = [
        "H3",
        "H4",
        "IMG",
        "P",
        "ULI",
        "OLI",
        "PRE",
        "BQ",
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

      // Identifiers for elements to strip from HTML
      const stripIdentifiers = [
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
      ];

      // Texts to remove from elements
      const textsToRemove = ["Member-only story", "Follow", "--"];

      // Initial empty set to keep track of captured elements
      const capturedElements = new Set<cheerio.Element>();

      // Start processing from the section level
      $("section").each((_, section) => {
        const sectionHtml = this.stripHTML(
          $.html(section),
          stripIdentifiers,
          textsToRemove
        );
        const $section = cheerio.load(sectionHtml);

        // processElement($(section), capturedElements);
        // processElement($section("section"), capturedElements);
        this.processElement(
          $,
          $section("section"),
          capturedElements,
          elements,
          supportedTypes
        );
      });

      // return { title, elements };
      const finalHtml = elements.map((el) => el.content).join("");
      const wrappedHtml = `<div class="main-content mt-8">${finalHtml}</div>`;

      return { html: wrappedHtml };
    } catch (error) {
      console.error("Error scraping article:", error);
      throw error;
    }
  }
}
