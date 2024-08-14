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
import { bookmarkSchema } from "@/schemas/article";
import { getBookmarkByIdUseCase } from "@/use-cases/bookmarks";

export const getCachedArticle = unstable_cache(
  async (url) => scrapeArticleContent(url),
  ["url"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

async function ArticleLoader({
  url,
  // urlWithoutPaywall,
  bookmarkId,
}: {
  url: string;
  // urlWithoutPaywall: string;
  bookmarkId?: string;
}) {
  const userSession = await getCurrentUser();
  if (!userSession) {
    redirect("/signin");
  }

  const user = await getUser(userSession.id);
  if (!user) {
    redirect("/signin");
  }

  let content: ArticleDetails | { error: string } | null = null;

  // if article is bookmarked, get the bookmark content from the database
  if (!bookmarkId) {
    content = await scrapeArticleContent(url);
    if ("error" in content) {
      return (
        <ErrorCard title="Failed to fetch article" message={content.error} />
      );
    }
  } else {
    const bookmark = await getBookmarkByIdUseCase(user.id, Number(bookmarkId));
    if (bookmark) {
      const { createdAt, updatedAt, ...bookmarkWithoutTimestamps } = bookmark;
      const bookmarkContent = bookmarkSchema.parse(bookmarkWithoutTimestamps);
      content = {
        title: bookmarkContent.title,
        htmlContent: bookmarkContent.htmlContent,
        textContent: bookmarkContent.textContent,
        authorInformation: {
          authorName: bookmarkContent.authorName,
          authorImageURL: bookmarkContent.authorImageURL,
          authorProfileURL: bookmarkContent.authorProfileURL,
        },
        publicationInformation: {
          publicationName: bookmarkContent.publicationName,
          readTime: bookmarkContent.readTime,
          publishDate: bookmarkContent.publishDate,
        },
      };
    } else {
      content = null;
    }
  }

  if (!content) {
    return <ErrorCard />;
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

export async function ArticleWrapper({
  url,
  bookmarkId,
}: {
  url: string;
  bookmarkId?: string;
}) {
  let article: ArticleDetails | { error: string } | null = null;

  // if browser is requesting html it means it's the first page load
  if (headers().get("accept")?.includes("text/html")) {
    // article = await getCachedArticle(url);
    article = await scrapeArticleContent(url);
    if ("error" in article) {
      return (
        <ErrorCard title="Failed to scrape article" message={article.error} />
      );
    }
  }

  return (
    <SuspenseIf condition={!article} fallback={<ArticleSkeleton />}>
      <ArticleLoader
        url={url}
        // urlWithoutPaywall={urlWithoutPaywall}
        bookmarkId={bookmarkId}
      />
    </SuspenseIf>
  );
}
