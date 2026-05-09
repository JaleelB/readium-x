import { describe, expect, it } from "vitest";
import { MediumArticleProcessor } from "@/lib/parser";

describe("MediumArticleProcessor", () => {
  it("returns null instead of passing missing article HTML into cheerio", async () => {
    const processor = new MediumArticleProcessor();

    await expect(
      processor.extractArticleMetadata("<html><body></body></html>", "medium"),
    ).resolves.toBeNull();
  });

  it("throws a clean extraction error when an article has no usable body", async () => {
    const processor = new MediumArticleProcessor();

    await expect(
      processor.extractArticleMetadata(
        "<article><div>Header without content sections</div></article>",
        "medium",
      ),
    ).rejects.toThrow("Unable to locate article content");
  });

  it("extracts article content once a usable section exists", async () => {
    const processor = new MediumArticleProcessor();

    const result = await processor.extractArticleMetadata(
      [
        "<article>",
        '<h1 data-testid="storyTitle">Title</h1>',
        "<section><p>Hello world.</p></section>",
        "</article>",
      ].join(""),
      "medium",
    );

    expect(result).toEqual(
      expect.objectContaining({
        title: "Title",
        htmlContent: expect.stringContaining("Hello world."),
        textContent: "Hello world.",
      }),
    );
  });
});
