"use client";

import { useState, useEffect } from "react";
import type { ArticleDetails } from "@/lib/article-content";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import Link from "next/link";
import { calculateReadTime, formatDate } from "@/lib/utils";
import { Button } from "../../components/ui/button";
import { Icons } from "../../components/icons";
import { ArticleViewer } from "./article-viewer";
import DOMPurify from "dompurify";
import Balancer from "react-wrap-balancer";
import { generateRandomName } from "@/lib/names";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { TTS } from "@/components/tts-button";
import { useLocalStorage } from "@/hooks/use-local-storage";

import { translateArticleAction } from "./actions/translate";
import { DynamicToolbar } from "@/components/article-toolbar";
import { useServerAction } from "zsa-react";
import { summarizeArticleAction } from "./actions/summarize";
import {
  useTranslatedContent,
  useSelectedLanguage,
  useSetSummary,
  useSetTranslatedContent,
  useSetSelectedLanguage,
} from "@/stores/article-store";
import type { BookmarkStatus } from "@/lib/client-types";
import { useArticleBookmark } from "@/hooks/use-bookmarks-query";
import { useReadingProgressSync } from "@/hooks/use-reading-progress-sync";
import { cacheArticleInSession } from "@/lib/article-session-cache";

export function Article({
  content,
  user,
  readingHistoryId,
  url,
  initialBookmarkStatus,
}: {
  content: ArticleDetails;
  user: {
    email: string | null;
    id: string;
  };
  url: string;
  readingHistoryId: number;
  initialBookmarkStatus?: BookmarkStatus;
}) {
  const translatedContent = useTranslatedContent();
  const selectedLanguage = useSelectedLanguage();
  const setSummary = useSetSummary();
  const setTranslatedContent = useSetTranslatedContent();
  const setSelectedLanguage = useSetSelectedLanguage();

  const safeHTMLContent = DOMPurify.sanitize(content?.htmlContent || "", {
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { statusQuery, createBookmark, deleteBookmark, isPending } =
    useArticleBookmark(url, initialBookmarkStatus);
  const isBookmarked = statusQuery.data?.isBookmarked ?? false;
  const bookmarkId = statusQuery.data?.bookmarkId ?? null;

  // Translation
  const [allTranslations, setAllTranslations] = useLocalStorage<
    Record<number, Record<string, string>>
  >("readiumx-article-translations", {});

  const { execute: executeTranslation, isPending: isTranslating } =
    useServerAction(translateArticleAction, {});

  // Summaries
  const [allSummaries, setAllSummaries] = useLocalStorage<
    Record<number, string>
  >("readiumx-article-summaries", {});

  const { execute: executeSummarize, isPending: isSummarizing } =
    useServerAction(summarizeArticleAction);

  useEffect(() => {
    if (allSummaries[readingHistoryId]) {
      const storedSummary = allSummaries[readingHistoryId];
      setSummary(storedSummary); // setting summary in the store on initial render
    }
  }, [allSummaries, readingHistoryId, setSummary]);

  const { progress, articleRef } = useReadingProgressSync({
    readingHistoryId,
    userId: user.id,
  });

  useEffect(() => {
    cacheArticleInSession(url, content);
  }, [content, url]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTranslate = async (targetLanguage: string) => {
    if (targetLanguage === "en") {
      setTranslatedContent(null);
      setSelectedLanguage("en");
      return;
    }

    if (allTranslations[readingHistoryId]?.[targetLanguage]) {
      setTranslatedContent(allTranslations[readingHistoryId][targetLanguage]);
      setSelectedLanguage(targetLanguage);
      return;
    }

    toast.promise(
      executeTranslation({
        userId: user.id,
        content: content.htmlContent,
        targetLanguage,
      }),
      {
        loading: "Translating article...",
        success: ([result]) => {
          if (result) {
            const newTranslatedContent = result.translatedContent;
            setTranslatedContent(newTranslatedContent);
            setSelectedLanguage(targetLanguage);
            setAllTranslations((prev) => ({
              ...prev,
              [readingHistoryId]: {
                ...prev[readingHistoryId],
                [targetLanguage]: newTranslatedContent,
              },
            }));
            return "Article translated successfully";
          }
          return "Translation completed";
        },
        error: (error) => {
          console.error("Translation error:", error);
          return "An error occurred during translation";
        },
      },
    );
  };

  const handleSummarize = async () => {
    if (allSummaries[readingHistoryId]) {
      setSummary(allSummaries[readingHistoryId]);
      return;
    }

    toast.promise(
      executeSummarize({
        userId: user.id,
        content: content.textContent,
      }),
      {
        loading: "Generating summary...",
        success: ([result]) => {
          if (result) {
            const newSummary = result.summary;
            setSummary(newSummary);
            setAllSummaries((prev) => ({
              ...prev,
              [readingHistoryId]: newSummary,
            }));
            return "Summary generated successfully";
          }
          return "Summary generation completed";
        },
        error: (error) => {
          console.error("Summary generation error:", error);
          return "An error occurred during summary generation";
        },
      },
    );
  };

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
                <AvatarFallback>
                  {content?.authorInformation?.authorName?.[0] ?? "AN"}
                </AvatarFallback>
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
            <div className="flex items-center gap-3">
              <TTS
                text={content?.textContent as string}
                userId={user.id}
                useIcon
              />
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={isPending}
                onClick={async () => {
                  if (isBookmarked === false && !bookmarkId) {
                    try {
                      await createBookmark({
                        path: pathname,
                        userId: user.id,
                        title: content?.title || generateRandomName(),
                        htmlContent: safeHTMLContent,
                        textContent: content?.textContent as string,
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
                          calculateReadTime(content?.htmlContent as string),
                        publishDate:
                          content?.publicationInformation.publishDate || "",
                      });
                      toast.success("Article bookmarked");
                    } catch {
                      toast.error("Failed to bookmark article");
                    }
                  } else {
                    try {
                      await deleteBookmark({
                        userId: user.id,
                        id: bookmarkId as number,
                        path: pathname,
                      });
                      toast.success("Bookmark removed");
                    } catch {
                      toast.error("Failed to remove bookmark");
                    }
                  }
                }}
              >
                <Icons.bookmark
                  className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
          <Balancer
            as="h1"
            className="font-heading text-2xl md:text-3xl lg:text-4xl"
          >
            {content?.title}
          </Balancer>

          <ArticleViewer
            content={safeHTMLContent}
            translatedContent={translatedContent}
            readingHistoryId={readingHistoryId}
          />
        </article>
      </section>
      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 left-6 z-50 rounded-full border border-input p-1.5 shadow-md transition-opacity duration-300 dark:bg-[#191919]"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-a-arrow-up h-5 w-5"
          >
            <path d="M3.5 13h6"></path>
            <path d="m2 16 4.5-9 4.5 9"></path>
            <path d="M18 16V7"></path>
            <path d="m14 11 4-4 4 4"></path>
          </svg>
          <span className="sr-only">Scroll to top</span>
        </Button>
      )}
      <DynamicToolbar
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleTranslate}
        isTranslating={isTranslating}
        onSummarize={handleSummarize}
        isSummarizing={isSummarizing}
        readingHistoryId={readingHistoryId}
      />
    </article>
  );
}
