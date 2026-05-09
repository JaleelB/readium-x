import type { ArticleDetails } from "@/lib/article-content";

const ARTICLE_CACHE_KEY = "readiumx-session-articles";

function normalizeArticleUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.hash = "";
    return parsedUrl.toString();
  } catch {
    return url;
  }
}

function getArticleCache() {
  if (typeof window === "undefined") {
    return {};
  }

  const cachedValue = window.sessionStorage.getItem(ARTICLE_CACHE_KEY);
  if (!cachedValue) {
    return {};
  }

  try {
    return JSON.parse(cachedValue) as Record<
      string,
      ArticleDetails & { cachedAt: string }
    >;
  } catch {
    return {};
  }
}

export function cacheArticleInSession(url: string, article: ArticleDetails) {
  if (typeof window === "undefined") {
    return;
  }

  const cache = getArticleCache();
  cache[normalizeArticleUrl(url)] = {
    ...article,
    cachedAt: new Date().toISOString(),
  };
  window.sessionStorage.setItem(ARTICLE_CACHE_KEY, JSON.stringify(cache));
}
