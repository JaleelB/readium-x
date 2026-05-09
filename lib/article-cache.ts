import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ArticleDetails } from "@/lib/article-content";

export const ARTICLE_CACHE_TTL_SECONDS = 60 * 60 * 24;
export const ARTICLE_CACHE_VERSION = "v1";

type ArticleCacheNamespace = {
  get<T = unknown>(key: string, type: "json"): Promise<T | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number; metadata?: Record<string, unknown> },
  ): Promise<void>;
};

type CachedArticlePayload = {
  version: typeof ARTICLE_CACHE_VERSION;
  sourceUrl: string;
  cachedAt: string;
  article: ArticleDetails;
};

export function normalizeArticleUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.hash = "";
    parsedUrl.searchParams.sort();
    return parsedUrl.toString();
  } catch {
    return url;
  }
}

async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function getArticleCacheKey(url: string) {
  return `article:${ARTICLE_CACHE_VERSION}:${await sha256Hex(
    normalizeArticleUrl(url),
  )}`;
}

async function getArticleCacheNamespace() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (
      ((env as CloudflareEnv & Record<string, unknown>)
        .READIUMX_ARTICLE_CACHE as ArticleCacheNamespace | undefined) ?? null
    );
  } catch {
    return null;
  }
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isArticleDetails(value: unknown): value is ArticleDetails {
  if (!value || typeof value !== "object") return false;

  const article = value as ArticleDetails;
  return (
    typeof article.title === "string" &&
    typeof article.htmlContent === "string" &&
    typeof article.textContent === "string" &&
    !!article.authorInformation &&
    typeof article.authorInformation === "object" &&
    isNullableString(article.authorInformation.authorName) &&
    isNullableString(article.authorInformation.authorImageURL) &&
    isNullableString(article.authorInformation.authorProfileURL) &&
    !!article.publicationInformation &&
    typeof article.publicationInformation === "object" &&
    isNullableString(article.publicationInformation.publicationName) &&
    isNullableString(article.publicationInformation.readTime) &&
    isNullableString(article.publicationInformation.publishDate)
  );
}

function isCachedArticlePayload(value: unknown): value is CachedArticlePayload {
  if (!value || typeof value !== "object") return false;

  const payload = value as CachedArticlePayload;
  return (
    payload.version === ARTICLE_CACHE_VERSION &&
    typeof payload.sourceUrl === "string" &&
    typeof payload.cachedAt === "string" &&
    isArticleDetails(payload.article)
  );
}

export async function getCachedArticle(url: string) {
  const namespace = await getArticleCacheNamespace();
  if (!namespace) return null;

  try {
    const payload = await namespace.get<CachedArticlePayload>(
      await getArticleCacheKey(url),
      "json",
    );
    return isCachedArticlePayload(payload) ? payload.article : null;
  } catch (error) {
    console.warn("Unable to read article cache:", error);
    return null;
  }
}

export async function setCachedArticle(url: string, article: ArticleDetails) {
  const namespace = await getArticleCacheNamespace();
  if (!namespace) return;

  const payload: CachedArticlePayload = {
    version: ARTICLE_CACHE_VERSION,
    sourceUrl: normalizeArticleUrl(url),
    cachedAt: new Date().toISOString(),
    article,
  };

  try {
    await namespace.put(
      await getArticleCacheKey(url),
      JSON.stringify(payload),
      {
        expirationTtl: ARTICLE_CACHE_TTL_SECONDS,
        metadata: {
          version: ARTICLE_CACHE_VERSION,
          sourceUrl: payload.sourceUrl,
        },
      },
    );
  } catch (error) {
    console.warn("Unable to write article cache:", error);
  }
}
