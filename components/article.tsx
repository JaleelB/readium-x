"use client";

import { ArticleDetails } from "@/app/article/actions/article";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { calculateReadTime, formatDate } from "@/lib/utils";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { ArticleViewer } from "./article-viewer";
import DOMPurify from "dompurify";
import Balancer from "react-wrap-balancer";
import {
  createBookmarkAction,
  deleteBookmarkAction,
  getBookmarkAction,
} from "@/app/bookmarks/bookmark";
import { generateRandomName } from "@/lib/names";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { useCallback, useEffect, useState } from "react";
import {
  getReadingHistoryProgressAction,
  updateReadingHistoryProgressAction,
} from "@/app/history/history";
import { debounce } from "lodash";

export function Article({
  content,
  user,
  readingHistoryId,
  url,
}: {
  content: ArticleDetails;
  user: {
    email: string | null;
    id: number;
    emailVerified: Date | null;
  };
  url: string;
  readingHistoryId: number;
}) {
  const safeHTMLContent = DOMPurify.sanitize(content?.content || "", {
    USE_PROFILES: { html: true },
    ALLOWED_ATTR: [
      "class",
      "style",
      "src",
      "alt",
      "title",
      "href",
      "target",
      "rel",
      "data-src",
      "data-href",
      "data-title",
      "data-alt",
      "data-target",
      "status",
      "data-status",
      "previewListener",
      "data-previewListener",
      "data-embed",
      "data-embed-type",
      "data-embed-id",
      "data-embed-url",
      "data-embed-provider",
      "data-embed-thumbnail",
      "data-embed-title",
      "data-bg",
      "data-ll-status",
    ],
  });

  const pathname = usePathname();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  const [initialProgress, setInitialProgress] = useState<number>(0);

  useEffect(() => {
    const localStorageKey = `article-progress-${readingHistoryId}`;
    const savedProgress = localStorage.getItem(localStorageKey);
    if (savedProgress) {
      setInitialProgress(parseFloat(savedProgress));
    } else {
      getReadingHistoryProgressAction({
        userId: user.id,
        readingHistoryId,
      }).then(([progress, error]) => {
        if (error) {
          toast.error("Failed to retrieve reading progress from database");
          return;
        }
        if (progress) {
          localStorage.setItem(localStorageKey, progress);
          setInitialProgress(parseFloat(progress));
        }
      });
    }
  }, [readingHistoryId, user.id]);

  const { progress, articleRef } = useReadingProgress(initialProgress);

  const updateLocalStorage = debounce((progress: number) => {
    localStorage.setItem(
      `article-progress-${readingHistoryId}`,
      progress.toString(),
    );
  }, 1000);

  const saveProgress = useCallback(async () => {
    const progressString = `${progress.toFixed(2)}%`;
    const [_, error] = await updateReadingHistoryProgressAction({
      readingHistoryId,
      userId: user.id,
      progress: progressString,
    });

    if (error) {
      toast.error("Failed to save reading progress");
    }
  }, [progress, readingHistoryId, user.id]);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const [data, error] = await getBookmarkAction({
        userId: user.id,
        title: content?.title as string,
        publishDate: content?.publicationInformation.publishDate as string,
      });

      if (error) {
        setIsBookmarked(false);
        return;
      }

      if (data) {
        setIsBookmarked(true);
        setBookmarkId(data.id);
      }
    };

    fetchBookmarkStatus();
  }, [
    user.id,
    readingHistoryId,
    content?.title,
    content?.publicationInformation.publishDate,
  ]);

  useEffect(() => {
    updateLocalStorage(progress);

    const handleUnload = () => {
      saveProgress();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        saveProgress();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [progress, readingHistoryId, saveProgress, updateLocalStorage, user.id]);

  return (
    <article className="w-full">
      <div
        style={{ width: `${progress}%` }}
        className="fixed left-0 top-0 z-[1000] h-1 bg-primary"
      />
      <section className="container flex flex-col items-center gap-12 px-0 md:px-8">
        <article
          ref={articleRef}
          className="container flex max-w-3xl flex-col gap-6 px-0 md:px-8"
        >
          <div className="flex w-full justify-between">
            <div className="flex w-full gap-3">
              <Avatar className="h-11 w-11">
                <AvatarImage
                  src={
                    content?.authorInformation.authorImageURL ||
                    "https://illustrations.popsy.co/white/genius.svg"
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <Link
                  href={
                    (content?.authorInformation.authorProfileURL as string) ||
                    "#"
                  }
                  className="font-medium"
                >
                  {content?.authorInformation?.authorName}
                </Link>
                <div className="text-sm text-muted-foreground">
                  {content?.publicationInformation?.readTime}
                  {content?.publicationInformation?.publishDate && (
                    <span className="px-2">·</span>
                  )}
                  {content?.publicationInformation?.publishDate &&
                    formatDate(content?.publicationInformation?.publishDate)}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={async () => {
                if (isBookmarked === false && !bookmarkId) {
                  const [_, err] = await createBookmarkAction({
                    path: pathname,
                    userId: user.id,
                    title: content?.title || generateRandomName(),
                    content: safeHTMLContent,
                    authorName: content?.authorInformation.authorName || "",
                    authorImageURL:
                      content?.authorInformation.authorImageURL || "",
                    authorProfileURL:
                      content?.authorInformation.authorProfileURL || "",
                    publicationName:
                      content?.publicationInformation.publicationName || "",
                    articleUrl: url,
                    readTime:
                      content?.publicationInformation.readTime ||
                      calculateReadTime(content?.content as string),
                    publishDate:
                      content?.publicationInformation.publishDate || "",
                  });

                  if (err) {
                    toast.error("Failed to bookmark article");
                    return;
                  }

                  toast.success("Article bookmarked");

                  window.location.reload();
                } else {
                  const [_, err] = await deleteBookmarkAction({
                    userId: user.id,
                    id: bookmarkId as number,
                    path: pathname,
                  });

                  if (err) {
                    toast.error("Failed to remove bookmark");
                    return;
                  }

                  toast.success("Bookmark removed");
                  // window.location.reload();
                }
              }}
            >
              <Icons.bookmark
                className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`}
              />
            </Button>
          </div>
          <Balancer
            as="h1"
            className="font-heading text-2xl md:text-3xl lg:text-4xl"
          >
            {content?.title}
          </Balancer>
          {safeHTMLContent && <ArticleViewer content={safeHTMLContent} />}
        </article>
      </section>
    </article>
  );
}
