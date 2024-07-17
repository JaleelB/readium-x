import * as cheerio from "cheerio";
import ejs from "ejs";

type ParagraphType =
  | "H2"
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
  | "H2"
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

  public async processArticle(html: string): Promise<Article> {
    try {
      const $ = cheerio.load(html);

      const elements: ArticleElement[] = [];

      // Supported tags
      const supportedTypes: ElementsType[] = [
        "H2",
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

      const processElement = (
        element: cheerio.Cheerio,
        captured: Set<cheerio.Element>
      ) => {
        element.children().each((_, child) => {
          if (child.type !== "tag") return;

          const $child = $(child);
          const tagName = child.tagName.toLowerCase();
          if (tagName === "figcaption") console.log("Processing figcaption");

          // Check if the child is an important type and not already captured
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

            // Since this is an important element, do not process its children further
            return;
          }

          // Recursively process all children if not captured
          processElement($child, captured);
        });
      };

      // Initial empty set to keep track of captured elements
      const capturedElements = new Set<cheerio.Element>();

      // Start processing from the section level
      $("section").each((_, section) => {
        processElement($(section), capturedElements);
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
