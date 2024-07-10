import {
  ArticleDetails,
  scrapeArticleContent,
} from "@/app/article/actions/article";
import { headers } from "next/headers";
import { SuspenseIf } from "../../components/suspense-if";
import { Article } from "../../components/article";
import { unstable_cache } from "next/cache";
import { ArticleSkeleton } from "./article-skeleton";
import { ErrorCard } from "../../components/error-card";
import { getCurrentUser } from "@/lib/session";
import { getUser } from "@/data-access/users";
import { redirect } from "next/navigation";

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

  const userSession = await getCurrentUser();
  if (!userSession) {
    redirect("/signin");
  }

  const user = await getUser(userSession.id);
  if (!user) {
    redirect("/signin");
  }

  return <Article content={content} user={user} />;
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
