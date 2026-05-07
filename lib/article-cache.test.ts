import { getCloudflareContext } from "@opennextjs/cloudflare";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ARTICLE_CACHE_TTL_SECONDS,
  ARTICLE_CACHE_VERSION,
  getArticleCacheKey,
  getCachedArticle,
  normalizeArticleUrl,
  setCachedArticle,
} from "@/lib/article-cache";
import type { ArticleDetails } from "@/lib/article-content";

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(),
}));

const article: ArticleDetails = {
  title: "A cached article",
  htmlContent: "<div>Article</div>",
  textContent: "Article",
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

function mockKv() {
  const store = new Map<string, string>();

  return {
    store,
    namespace: {
      get: vi.fn(async (key: string) => {
        const value = store.get(key);
        return value ? JSON.parse(value) : null;
      }),
      put: vi.fn(async (key: string, value: string) => {
        store.set(key, value);
      }),
    },
  };
}

describe("article cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("normalizes URLs before deriving cache keys", async () => {
    expect(
      normalizeArticleUrl("https://example.com/story?b=2&a=1#comments"),
    ).toBe("https://example.com/story?a=1&b=2");

    await expect(
      getArticleCacheKey("https://example.com/story?b=2&a=1#comments"),
    ).resolves.toBe(
      await getArticleCacheKey("https://example.com/story?a=1&b=2"),
    );
  });

  it("returns null when the Cloudflare KV binding is unavailable", async () => {
    vi.mocked(getCloudflareContext).mockRejectedValueOnce(
      new Error("No Cloudflare context"),
    );

    await expect(getCachedArticle("https://example.com/story")).resolves.toBe(
      null,
    );
  });

  it("writes successful article payloads to KV with a 24-hour TTL", async () => {
    const { namespace } = mockKv();
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: { READIUMX_ARTICLE_CACHE: namespace } as unknown as CloudflareEnv,
      cf: undefined,
      ctx: {} as never,
    });

    await setCachedArticle("https://example.com/story", article);

    expect(namespace.put).toHaveBeenCalledWith(
      await getArticleCacheKey("https://example.com/story"),
      expect.stringContaining('"title":"A cached article"'),
      expect.objectContaining({
        expirationTtl: ARTICLE_CACHE_TTL_SECONDS,
        metadata: expect.objectContaining({
          version: ARTICLE_CACHE_VERSION,
          sourceUrl: "https://example.com/story",
        }),
      }),
    );
  });

  it("reads valid cached article payloads from KV", async () => {
    const { namespace, store } = mockKv();
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: { READIUMX_ARTICLE_CACHE: namespace } as unknown as CloudflareEnv,
      cf: undefined,
      ctx: {} as never,
    });
    store.set(
      await getArticleCacheKey("https://example.com/story"),
      JSON.stringify({
        version: ARTICLE_CACHE_VERSION,
        sourceUrl: "https://example.com/story",
        cachedAt: new Date().toISOString(),
        article,
      }),
    );

    await expect(
      getCachedArticle("https://example.com/story"),
    ).resolves.toEqual(article);
  });

  it("ignores malformed cached payloads", async () => {
    const { namespace, store } = mockKv();
    vi.mocked(getCloudflareContext).mockResolvedValue({
      env: { READIUMX_ARTICLE_CACHE: namespace } as unknown as CloudflareEnv,
      cf: undefined,
      ctx: {} as never,
    });
    store.set(
      await getArticleCacheKey("https://example.com/story"),
      JSON.stringify({ title: "not the cache envelope" }),
    );

    await expect(getCachedArticle("https://example.com/story")).resolves.toBe(
      null,
    );
  });
});
