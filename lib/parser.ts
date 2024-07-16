// import * as cheerio from "cheerio";
import { load, Cheerio, Element as CheerioElement, text } from "cheerio";
import ejs from "ejs";
import { Waypoints } from "lucide-react";

// Types
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
  | "PQ"
  | "MIXTAPE_EMBED"
  | "IFRAME";

type MarkupType =
  | "STRONG"
  | "EM"
  | "A"
  | "CODE"
  | "STRIKE"
  | "MARK"
  | "SUP"
  | "SUB"
  | "HIGHLIGHT";

interface Markup {
  type: string;
  start: number;
  end: number;
  href?: string;
}

interface Paragraph {
  type: ParagraphType;
  text: string;
  name?: string;
  markups: Markup[];
  layout?: string;
  metadata?: {
    id?: string;
    alt?: string;
  };
  codeBlockMetadata?: {
    lang?: string;
  };
  mixtapeMetadata?: {
    href?: string;
    thumbnailImageId?: string;
  };
  iframe?: {
    mediaResource: {
      href: string;
      // id: string;
    };
  };
}

interface HighlightParagraph {
  name: string;
  text: string;
}

// Main processing class
export class MediumArticleProcessor {
  //   private host_address: string;

  constructor() {
    // this.host_address = host_address;
  }

  private renderTemplate(templateString: string, context: object): string {
    return ejs.render(templateString, context);
  }

  private parseText(text: string, markups: Markup[]): string {
    if (!markups || markups.length === 0) {
      return text;
    }

    // // Sort markups by start index in descending order
    // // This ensures we process nested markups correctly
    // markups.sort((a, b) => b.start - a.start);
    markups.sort((a, b) => a.start - b.start); // Sort markups by start index in ascending order

    let result = text;
    let offset = 0;

    for (const markup of markups) {
      if (markup.start === markup.end) continue;

      const adjustedStart = markup.start + offset;
      const adjustedEnd = markup.end + offset;

      const prefix = result.slice(0, markup.start);
      const markedText = result.slice(markup.start, markup.end);
      const suffix = result.slice(markup.end);

      let wrapped = "";
      switch (markup.type) {
        case "STRONG":
          wrapped = `<strong>${markedText}</strong>`;
          break;
        case "EM":
          wrapped = `<em>${markedText}</em>`;
          break;
        case "A":
          if (markup.href) {
            wrapped = `<a href="${markup.href}" target="_blank" rel="noopener noreferrer">${markedText}</a>`;
          } else {
            console.warn("Anchor markup without href:", markup);
            wrapped = markedText;
          }
          break;
        // case "CODE":
        //   result = `${prefix}<code>${markedText}</code>${suffix}`;
        //   break;
        // case "STRIKE":
        //   result = `${prefix}<del>${markedText}</del>${suffix}`;
        //   break;
        // case "MARK":
        //   result = `${prefix}<mark class="bg-yellow-200">${markedText}</mark>${suffix}`;
        //   break;
        // case "SUP":
        //   result = `${prefix}<sup>${markedText}</sup>${suffix}`;
        //   break;
        // case "SUB":
        //   result = `${prefix}<sub>${markedText}</sub>${suffix}`;
        //   break;
        // case "HIGHLIGHT":
        //   // Assuming you want to use a custom class for highlights
        //   result = `${prefix}<span class="highlight">${markedText}</span>${suffix}`;
        //   break;
        case "CODE":
          wrapped = `<code>${markedText}</code>`;
          break;
        case "STRIKE":
          wrapped = `<del>${markedText}</del>`;
          break;
        case "MARK":
          wrapped = `<mark class="bg-yellow-200">${markedText}</mark>`;
          break;
        case "SUP":
          wrapped = `<sup>${markedText}</sup>`;
          break;
        case "SUB":
          wrapped = `<sub>${markedText}</sub>`;
          break;
        case "HIGHLIGHT":
          // Assuming you want to use a custom class for highlights
          wrapped = `<span class="highlight">${markedText}</span>`;
          break;
        default:
          console.warn(`Unhandled markup type: ${markup.type}`);
          // result = `${prefix}${markedText}${suffix}`;
          wrapped = markedText;
      }

      result = `${prefix}${wrapped}${suffix}`;
      offset += wrapped.length - markedText.length;
    }

    // console.log("parseText output:", result);

    return result;
  }

  public stripHTML(html: string) {
    let $ = load(html);

    //remove unecessary tags
    $("header, footer, iframe, .section-divider, script").remove();

    //clean attributes
    $("*").each(function () {
      let element = Object.keys(($(this).get(0) as CheerioElement)?.attribs);
      let attributes = element.map((key) => {
        if (key != "href" && key != "src") {
          $(this).removeAttr(key);
        }
      });
    });

    //remove empty tags
    $("*")
      .not("img")
      .not("section")
      .filter(function () {
        return (
          $(this).text().trim().length == 0 && $(this).find("img").length === 0
        );
      })
      .remove();

    //return body html
    let newHTML = $("article").html();

    return {
      strippedArticleContent: newHTML,
    };
  }

  private processParagraph(
    paragraph: Paragraph,
    highlight_paragraph: HighlightParagraph | null,
    out_paragraphs: string[]
  ): string {
    let result = "";
    const css_class: string[] = [];

    switch (paragraph.type) {
      case "H2":
      case "H3":
      case "H4":
        css_class.push(paragraph.type === "H4" ? "pt-8" : "pt-12");
        const headerTemplate = this.renderTemplate(
          `<<%= type.toLowerCase() %> class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-<%= type === 'H4' ? 'l' : '1xl' %> md:text-<%= type === 'H4' ? 'xl' : '2xl' %> <%= css_class %>"><%- text %></<%= type.toLowerCase() %>>`,
          {
            type: paragraph.type,
            css_class: css_class.join(" "),
            text: this.parseText(paragraph.text, paragraph.markups),
          }
        );
        result = headerTemplate;
        break;

      case "IMG":
        const imageTemplate = this.renderTemplate(
          '<div class="mt-7"><img alt="<%= alt %>" class="pt-5 lazy m-auto" role="presentation" data-src="https://miro.medium.com/v2/resize:fit:700/<%= id %>"></div>',
          {
            alt: paragraph.metadata?.alt || "Article photo",
            id: paragraph.metadata?.id || "default-placeholder",
          }
        );
        result = imageTemplate;
        if (paragraph.text) {
          const captionTemplate = this.renderTemplate(
            "<figcaption class='mt-3 text-sm text-center text-gray-500 dark:text-gray-200'><%= text.trim() %></figcaption>",
            { text: this.parseText(paragraph.text, paragraph.markups) }
          );
          result += captionTemplate;
        }
        break;

      case "P":
        css_class.push("leading-8");
        css_class.push(
          out_paragraphs.length > 0 &&
            ["H4", "H3"].includes(
              out_paragraphs[out_paragraphs.length - 1].substring(1, 3)
            )
            ? "mt-3"
            : "mt-7"
        );
        const paragraphTemplate = this.renderTemplate(
          '<p class="<%= css_class %>"><%- text %></p>',
          {
            css_class: css_class.join(" "),
            text: this.parseText(paragraph.text, paragraph.markups),
          }
        );
        result = paragraphTemplate;
        break;

      case "ULI":
        const uliTemplate = this.renderTemplate(
          '<ul class="list-disc pl-8 mt-2"><%- li %></ul>',
          { li: this.processListItems(paragraph) }
        );
        result = uliTemplate;
        break;

      case "OLI":
        const oliTemplate = this.renderTemplate(
          '<ol class="list-decimal pl-8 mt-2"><%- li %></ol>',
          { li: this.processListItems(paragraph) }
        );
        result = oliTemplate;
        break;

      case "PRE":
        const preTemplate = this.renderTemplate(
          '<pre class="mt-7 flex flex-col justify-center border dark:border-gray-700"><%- code_block %></pre>',
          { code_block: this.processCodeBlock(paragraph) }
        );
        result = preTemplate;
        break;

      case "BQ":
        const bqTemplate = this.renderTemplate(
          '<blockquote style="box-shadow: inset 3px 0 0 0 rgb(209 207 239 / var(--tw-bg-opacity));" class="px-5 pt-3 pb-3 mt-5"><p class="font-italic"><%= text %></p></blockquote>',
          { text: this.parseText(paragraph.text, paragraph.markups) }
        );
        result = bqTemplate;
        break;

      case "PQ":
        const pqTemplate = this.renderTemplate(
          '<blockquote class="mt-7 text-2xl ml-5 text-gray-600 dark:text-gray-300"><p><%= text %></p></blockquote>',
          { text: this.parseText(paragraph.text, paragraph.markups) }
        );
        result = pqTemplate;
        break;

      case "MIXTAPE_EMBED":
        if (paragraph.mixtapeMetadata?.href) {
          const embedTemplate = this.renderTemplate(
            '<div class="border border-gray-300 p-2 mt-7 items-center overflow-hidden"><a rel="noopener follow" href="<%= url %>" target="_blank"> <div class="flex flex-row justify-between p-2 overflow-hidden"><div class="flex flex-col justify-center p-2"><h2 class="text-black dark:text-gray-100 text-base font-bold"><%= embed_title %></h2><div class="mt-2 block"><h3 class="text-grey-darker text-sm"><%= embed_description %></h3></div><div class="mt-5"><p class="text-grey-darker text-xs"><%= embed_site %></p></div></div><div class="relative flex flew-row h-40 w-60"><div class="lazy absolute inset-0 bg-cover bg-center" data-bg="https://miro.medium.com/v2/resize:fit:320/<%= thumbnailImageId %>"></div></div></div> </a></div>',
            {
              url: paragraph.mixtapeMetadata.href,
              embed_title: paragraph.text.split("\n")[0],
              embed_description: paragraph.text.split("\n")[1],
              embed_site: paragraph.text.split("\n")[2],
              thumbnailImageId: paragraph.mixtapeMetadata.thumbnailImageId,
            }
          );
          result = embedTemplate;
        }
        break;

      case "IFRAME":
        if (paragraph.iframe?.mediaResource) {
          const iframeTemplate = this.renderTemplate(
            '<div class="mt-7"><iframe class="w-full" src="<%= src %>" allowfullscreen="" frameborder="0" scrolling="no" style="min-height: 400px;"></iframe></div>',
            {
              src: paragraph.iframe.mediaResource.href || "",
            }
          );
          result = iframeTemplate;
        }
        break;

      default:
        console.warn(`Unhandled paragraph type: ${paragraph.type}`);
    }

    return result;
  }

  private processListItems(paragraph: Paragraph): string {
    const liTemplate = '<li class="mt-3"><%- text %></li>';
    const processedText = this.parseText(paragraph.text, paragraph.markups);

    console.log("Processed LI text:", processedText);
    return this.renderTemplate(liTemplate, {
      text: processedText,
    });
  }

  private processCodeBlock(paragraph: Paragraph): string {
    const codeBlockTemplate =
      '<code class="p-2 bg-gray-100 dark:bg-gray-900 overflow-x-auto <%= code_css_class %>"><%- text %></code>';
    const code_css_class = paragraph.codeBlockMetadata?.lang
      ? `language-${paragraph.codeBlockMetadata.lang}`
      : "nohighlight";
    return this.renderTemplate(codeBlockTemplate, {
      code_css_class,
      // text: this.parseText(paragraph.text, paragraph.markups),
      text: paragraph.text,
    });
  }

  public processArticle(html: string | null): string | null {
    if (!html) {
      return null;
    }

    console.log("html:", html);

    const $ = load(html);
    const articleContent = $("section").first();
    console.log("articleContent:", articleContent.html());
    const paragraphs: Paragraph[] = [];

    // Extract paragraphs from the article content
    articleContent.children().each((_, element) => {
      const $element = $(element);
      const type = this.getParagraphType($element);
      const text = $element.text();
      const markups = this.extractMarkups($element);
      console.log("paragraph:", { type, text, markups });
      paragraphs.push({ type, text, markups });
    });

    // Process paragraphs
    const processedParagraphs: string[] = [];
    paragraphs.forEach((paragraph, index) => {
      const highlight_paragraph = null; // Implement highlight logic if needed
      const result = this.processParagraph(
        paragraph,
        highlight_paragraph,
        processedParagraphs
      );
      processedParagraphs.push(result);
    });

    return processedParagraphs.join("\n");
  }

  private getParagraphType($element: Cheerio<CheerioElement>): ParagraphType {
    const tagName = $element.prop("tagName").toLowerCase();

    switch (tagName) {
      case "h1":
        return "H2"; // Medium typically uses H1 for article title, so we'll treat H1 as H2
      case "h2":
        return "H2";
      case "h3":
        return "H3";
      case "h4":
      case "h5":
      case "h6":
        return "H4"; // Treating H5 and H6 as H4 for simplicity
      case "figure":
        if ($element.find("img").length > 0) {
          return "IMG";
        }
        break;
      case "pre":
        return "PRE";
      case "blockquote":
        // Check if it's a pull quote or a regular blockquote
        if (
          $element.hasClass("pullquote") ||
          $element.find(".pullquote").length > 0
        ) {
          return "PQ";
        } else {
          return "BQ";
        }
      case "ul":
        return "ULI";
      case "ol":
        return "OLI";
      case "iframe":
        return "IFRAME";
      case "div":
        // Check for special div types
        if (
          $element.hasClass("mixtape-embed") ||
          $element.find(".mixtape-embed").length > 0
        ) {
          return "MIXTAPE_EMBED";
        }
        break;
    }

    // Default to paragraph if no specific type is determined
    return "P";
  }

  private extractMarkups($element: Cheerio<CheerioElement>): Markup[] {
    const markups: Markup[] = [];
    const text = $element.text();

    // Helper function to add markup
    const addMarkup = (
      type: string,
      $el: Cheerio<CheerioElement>,
      href?: string
    ) => {
      const innerText = $el.text();
      const start = text.indexOf(innerText);
      if (start !== -1) {
        markups.push({
          type,
          start,
          end: start + innerText.length,
          ...(href && { href }),
        });
      }
    };

    // Extract strong (bold) text
    $element.find("strong").each((_, el) => {
      addMarkup("STRONG", $element.find(el));
    });

    // Extract emphasized (italic) text
    $element.find("em").each((_, el) => {
      addMarkup("EM", $element.find(el));
    });

    // Extract links
    $element.find("a").each((_, el) => {
      const $link = $element.find(el);
      addMarkup("A", $link, $link.attr("href"));
    });

    // Extract inline code
    $element.find("code").each((_, el) => {
      addMarkup("CODE", $element.find(el));
    });

    // Extract strikethrough text
    $element.find("del, s").each((_, el) => {
      addMarkup("STRIKE", $element.find(el));
    });

    // Extract marked (highlighted) text
    $element.find("mark").each((_, el) => {
      addMarkup("MARK", $element.find(el));
    });

    // Extract superscript
    $element.find("sup").each((_, el) => {
      addMarkup("SUP", $element.find(el));
    });

    // Extract subscript
    $element.find("sub").each((_, el) => {
      addMarkup("SUB", $element.find(el));
    });

    // Extract custom highlights (assuming they use a specific class)
    $element.find(".highlight").each((_, el) => {
      addMarkup("HIGHLIGHT", $element.find(el));
    });

    // Sort markups by start index
    markups.sort((a, b) => a.start - b.start);

    return markups;
  }
}
