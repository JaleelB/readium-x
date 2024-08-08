import {
  ArticleDetails,
  scrapeArticleContent,
} from "@/app/article/actions/article";
import { headers } from "next/headers";
import { SuspenseIf } from "../../components/suspense-if";
import { Article } from "./article";
import { unstable_cache } from "next/cache";
import { ArticleSkeleton } from "./article-skeleton";
import { ErrorCard } from "../../components/error-card";
import { getCurrentUser } from "@/lib/session";
import { getUser } from "@/data-access/users";
import { notFound, redirect } from "next/navigation";
import { createReadingHistoryLogAction } from "../history/history";
import { getUrlWithoutPaywall } from "./actions/url";

export const getCachedArticle = unstable_cache(
  async (url) => scrapeArticleContent(url),
  ["url"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

async function ArticleLoader({
  url,
  urlWithoutPaywall,
}: {
  url: string;
  urlWithoutPaywall: string;
}) {
  // const content = await getCachedArticle(urlWithoutPaywall);
  const content = await scrapeArticleContent(urlWithoutPaywall);

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

  const [data, err] = await createReadingHistoryLogAction({
    userId: user.id,
    articleDetails: {
      title: content.title,
      authorName: content.authorInformation.authorName as string,
      articleURL: url,
      authorImageURL: content.authorInformation.authorImageURL as string,
      authorProfileURL: content.authorInformation.authorProfileURL as string,
      readTime: content.publicationInformation.readTime as string,
      accessTime: new Date(),
      progress: "0%",
    },
  });

  console.log("data: ", data);
  console.log("err: ", err);

  if (err) {
    return (
      <ErrorCard
        title="Failed to create reading history log"
        message="Please try again later"
      />
    );
  }

  return (
    <Article
      content={content}
      user={user}
      readingHistoryId={data.id}
      url={url}
    />
  );
}

export async function ArticleWrapper({ url }: { url: string }) {
  let article: ArticleDetails | null = null;

  const urlWithoutPaywall = await getUrlWithoutPaywall(url);
  if (urlWithoutPaywall instanceof Error) {
    notFound();
  }

  // if browser is requesting html it means it's the first page load
  if (headers().get("accept")?.includes("text/html")) {
    // article = await getCachedArticle(url);
    article = await scrapeArticleContent(urlWithoutPaywall);
  }

  return (
    <SuspenseIf condition={!article} fallback={<ArticleSkeleton />}>
      <ArticleLoader url={url} urlWithoutPaywall={urlWithoutPaywall} />
    </SuspenseIf>
  );
}
