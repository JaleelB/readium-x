import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getUrlWithoutPaywall } from "@/app/article/actions/url";
import { getCachedArticle, setCachedArticle } from "@/lib/article-cache";
import { rateLimitByIp } from "@/lib/limiter";
import { scrapeArticleContent } from "@/lib/article-content";
import type { UrlType } from "@/app/article/actions/url";

vi.mock("@/lib/article-cache", () => ({
  getCachedArticle: vi.fn(),
  setCachedArticle: vi.fn(),
}));

vi.mock("@/lib/limiter", () => ({
  rateLimitByIp: vi.fn(),
}));

vi.mock("@/app/article/actions/url", () => ({
  getUrlWithoutPaywall: vi.fn(),
}));

const cachedArticle = {
  title: "Cached",
  htmlContent: "<div>Cached</div>",
  textContent: "Cached",
  authorInformation: {
    authorName: "Author",
    authorImageURL: null,
    authorProfileURL: null,
  },
  publicationInformation: {
    publicationName: null,
    readTime: "1 min read",
    publishDate: null,
  },
};

const articleHtml = [
  "<article>",
  '<h1 data-testid="storyTitle">Fresh</h1>',
  '<a data-testid="authorName" href="/@author">Author</a>',
  '<span data-testid="storyReadTime">1 min read</span>',
  "<section><p>Fresh article.</p></section>",
  "</article>",
].join("");

const resolvedUrl = {
  url: "https://medium.com/example/story",
  type: "medium" as UrlType,
};

describe("scrapeArticleContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        text: async () => articleHtml,
      })),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("returns a KV cache hit without scraping", async () => {
    vi.mocked(getCachedArticle).mockResolvedValue(cachedArticle);

    await expect(
      scrapeArticleContent("https://medium.com/example/story"),
    ).resolves.toEqual(cachedArticle);

    expect(rateLimitByIp).not.toHaveBeenCalled();
    expect(getUrlWithoutPaywall).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
    expect(setCachedArticle).not.toHaveBeenCalled();
  });

  it("scrapes on cache miss and writes successful extraction to KV", async () => {
    vi.mocked(getCachedArticle).mockResolvedValue(null);
    vi.mocked(getUrlWithoutPaywall).mockResolvedValue([resolvedUrl]);

    const result = await scrapeArticleContent(
      "https://medium.com/example/story",
    );

    expect(result).toEqual(
      expect.objectContaining({
        title: "Fresh",
        textContent: "Fresh article.",
      }),
    );
    expect(setCachedArticle).toHaveBeenCalledWith(
      "https://medium.com/example/story",
      expect.objectContaining({ title: "Fresh" }),
    );
  });

  it("does not cache failed scrapes", async () => {
    vi.mocked(getCachedArticle).mockResolvedValue(null);
    vi.mocked(getUrlWithoutPaywall).mockResolvedValue([resolvedUrl]);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        text: async () => "<html><body></body></html>",
      })),
    );

    const result = await scrapeArticleContent(
      "https://medium.com/example/story",
    );

    expect(result).toEqual({
      error: "Unable to locate article content after trying all bypass methods",
    });
    expect(setCachedArticle).not.toHaveBeenCalled();
  });
});
