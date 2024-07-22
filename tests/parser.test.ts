import { MediumArticleProcessor } from "../lib/parser";
import { describe, it, expect } from "vitest";

describe("MediumArticleProcessor", () => {
  const processor = new MediumArticleProcessor();

  describe("processArticle", () => {
    it("should process a simple article with correct classes and attributes", () => {
      const simpleHtml = `
        <section>
          <h2>Test Header</h2>
          <p>This is a test paragraph.</p>
        </section>
      `;
      const result = processor.processArticleContent(simpleHtml);
      expect(result).toContain(
        '<h2 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-1xl md:text-2xl pt-12">Test Header</h2>',
      );
      expect(result).toContain(
        '<p class="leading-8 mt-7">This is a test paragraph.</p>',
      );
    });

    it("should handle various paragraph types with correct attributes", () => {
      const complexHtml = `
        <section>
          <h2>Main Header</h2>
          <h3>Sub Header</h3>
          <p>Normal paragraph</p>
          <ul><li>List item</li></ul>
          <ol><li>Ordered list item</li></ol>
          <pre><code>Code block</code></pre>
          <blockquote>Blockquote</blockquote>
          <figure><img src="test.jpg" alt="Test image"></figure>
        </section>
      `;
      const result = processor.processArticleContent(complexHtml);
      expect(result).toContain(
        '<h2 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-1xl md:text-2xl pt-12">Main Header</h2>',
      );
      expect(result).toContain(
        '<h3 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-1xl md:text-2xl pt-12">Sub Header</h3>',
      );
      expect(result).toContain(
        '<p class="leading-8 mt-7">Normal paragraph</p>',
      );
      expect(result).toContain(
        '<ul class="list-disc pl-8 mt-2"><li class="mt-3">List item</li></ul>',
      );
      expect(result).toContain(
        '<ol class="list-decimal pl-8 mt-2"><li class="mt-3">Ordered list item</li></ol>',
      );
      expect(result).toContain(
        '<pre class="mt-7 flex flex-col justify-center border dark:border-gray-700"><code class="p-2 bg-gray-100 dark:bg-gray-900 overflow-x-auto nohighlight">Code block</code></pre>',
      );
      expect(result).toContain(
        '<blockquote style="box-shadow: inset 3px 0 0 0 rgb(209 207 239 / var(--tw-bg-opacity));" class="px-5 pt-3 pb-3 mt-5"><p class="font-italic">Blockquote</p></blockquote>',
      );
      expect(result).toContain(
        '<div class="mt-7"><img alt="Test image" class="pt-5 lazy m-auto" role="presentation" data-src="https://miro.medium.com/v2/resize:fit:700/default-placeholder"></div>',
      );
    });

    it("should handle text markups with correct tags and attributes", () => {
      const markupHtml = `
        <section>
          <p>This is <strong>bold</strong> and <em>italic</em> text with a <a href="https://example.com">link</a>.</p>
        </section>
      `;
      const result = processor.processArticleContent(markupHtml);
      expect(result).toContain("<strong>bold</strong>");
      expect(result).toContain("<em>italic</em>");
      expect(result).toContain(
        '<a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a>',
      );
    });

    it("should handle empty sections", () => {
      const emptyHtml = "<section></section>";
      const result = processor.processArticleContent(emptyHtml);
      expect(result).toBe("");
    });

    // it("should handle mixtape embeds with correct structure and classes", () => {
    //   const mixtapeHtml = `
    //     <section>
    //       <div class="mixtape-embed">
    //         <a href="https://example.com">
    //           <h2>Embed Title</h2>
    //           <p>Embed Description</p>
    //           <p>example.com</p>
    //         </a>
    //       </div>
    //     </section>
    //   `;
    //   const result = processor.processArticle(mixtapeHtml);
    //   expect(result).toContain(
    //     '<div class="border border-gray-300 p-2 mt-7 items-center overflow-hidden">'
    //   );
    //   expect(result).toContain(
    //     '<a rel="noopener follow" href="https://example.com" target="_blank">'
    //   );
    //   expect(result).toContain(
    //     '<h2 class="text-black dark:text-gray-100 text-base font-bold">Embed Title</h2>'
    //   );
    //   expect(result).toContain(
    //     '<h3 class="text-grey-darker text-sm">Embed Description</h3>'
    //   );
    //   expect(result).toContain(
    //     '<p class="text-grey-darker text-xs">example.com</p>'
    //   );
    // });

    // it("should handle iframes with correct attributes", () => {
    //   const iframeHtml = `
    //     <section>
    //       <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>
    //     </section>
    //   `;
    //   const result = processor.processArticle(iframeHtml);
    //   expect(result).toContain(
    //     '<div class="mt-7"><iframe class="w-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen="" frameborder="0" scrolling="no" style="min-height: 400px;"></iframe></div>'
    //   );
    // });
  });
});
