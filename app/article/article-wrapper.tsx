import { ArticleDetails, scrapeArticleContent } from "@/lib/article-content";
import { Article } from "./article";
import { ErrorCard } from "../../components/error-card";
import { getCurrentUser } from "@/lib/session";
import { getUser } from "@/data-access/users";
import { redirect } from "next/navigation";
import { createReadingHistoryLogAction } from "../history/history";
import { bookmarkSchema } from "@/schemas/article";
import { getBookmarkByIdUseCase } from "@/use-cases/bookmarks";
import type { BookmarkStatus } from "@/lib/client-types";

function mapBookmarkToArticle(bookmark: unknown): ArticleDetails {
  const bookmarkContent = bookmarkSchema.parse(bookmark);

  return {
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
}

export async function ArticleWrapper({
  url,
  bookmarkId,
}: {
  url: string;
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
  let initialBookmarkStatus: BookmarkStatus | undefined;

  if (bookmarkId) {
    const bookmark = await getBookmarkByIdUseCase(user.id, Number(bookmarkId));
    if (bookmark) {
      content = mapBookmarkToArticle(bookmark);
      initialBookmarkStatus = {
        isBookmarked: true,
        bookmarkId: bookmark.id,
      };
    }
  } else {
    content = await scrapeArticleContent(url);
  }

  if (!content) {
    return <ErrorCard />;
  }

  if ("error" in content) {
    return (
      <ErrorCard title="Failed to fetch article" message={content.error} />
    );
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
      initialBookmarkStatus={initialBookmarkStatus}
    />
  );
}
