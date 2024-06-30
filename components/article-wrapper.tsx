import { ArticleDetails, scrapeArticleContent } from "@/app/_actions/article";
import { headers } from "next/headers";
import { SuspenseIf } from "./suspense-if";
import { Article } from "./article";
import { unstable_cache } from "next/cache";
import { ArticleSkeleton } from "./article-skeleton";
import { ErrorCard } from "./error-card";

export const getCachedArticle = unstable_cache(
  async (url) => scrapeArticleContent(url),
  ["url"]
);

async function ArticleLoader({ url }: { url: string }) {
  // const content = await getCachedArticle(url);
  const content = await scrapeArticleContent(url);
  if (!content) {
    return <ErrorCard />;
  }

  return <Article content={content} />;
}

export async function ArticleWrapper({ url }: { url: string }) {
  let article: ArticleDetails | null = null;

  // if browser is requesting html it means it's the first page load
  if (headers().get("accept")?.includes("text/html")) {
    // article = await getCachedArticle(url);
    article = await scrapeArticleContent(url);
  }

  return (
    <SuspenseIf condition={!article} fallback={<ArticleSkeleton />}>
      <ArticleLoader url={url} />
    </SuspenseIf>
  );
}
