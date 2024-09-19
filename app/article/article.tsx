"use client";

import { useState, useEffect, useCallback } from "react";
import { ArticleDetails } from "@/app/article/actions/article";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import Link from "next/link";
import {
  calculateReadTime,
  fetchFromLocalStorage,
  formatDate,
  setLocalStorageItem,
} from "@/lib/utils";
import { Button } from "../../components/ui/button";
import { Icons } from "../../components/icons";
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
import { usePathname } from "next/navigation";
import { useReadingProgress } from "@/hooks/use-reading-progress";
import { debounce } from "lodash";
import { TTS } from "@/components/tts-button";
import { useLocalStorage } from "@/hooks/use-local-storage";

import { translateArticleAction } from "./actions/translate";
import { DynamicToolbar } from "@/components/article-toolbar";
import {
  getReadingHistoryProgressAction,
  updateReadingHistoryProgressAction,
} from "@/app/history/history";
import { useServerAction } from "zsa-react";
import { summarizeArticleAction } from "./actions/summarize";
import {
  useTranslatedContent,
  useSelectedLanguage,
  useSetSummary,
  useSetTranslatedContent,
  useSetSelectedLanguage,
  // useSetReadingHistoryId,
} from "@/stores/article-store";

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
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  const [initialProgress, setInitialProgress] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  // Reading Progress
  const getArticleProgressFromLocalStorage = () => {
    const progressObj = fetchFromLocalStorage("readiumx-article-progress");
    return progressObj;
  };

  useEffect(() => {
    const progressObj = getArticleProgressFromLocalStorage();
    const savedProgress = progressObj[readingHistoryId];
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
          const newProgressObj = {
            ...progressObj,
            [readingHistoryId]: progress,
          };
          setLocalStorageItem(
            "readiumx-article-progress",
            JSON.stringify(newProgressObj),
          );
          setInitialProgress(parseFloat(progress));
        }
      });
    }
  }, [readingHistoryId, user.id]);

  const { progress, articleRef } = useReadingProgress(initialProgress);

  const updateLocalStorage = debounce((progress: number) => {
    const progressObj = getArticleProgressFromLocalStorage();
    const newProgressObj = {
      ...progressObj,
      [readingHistoryId]: progress.toString(),
    };
    setLocalStorageItem(
      "readiumx-article-progress",
      JSON.stringify(newProgressObj),
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

  // const [allSummaries, setAllSummaries] = useLocalStorage<
  //   Record<number, string>
  // >("readiumx-article-summaries", {});

  // const { execute: executeSummarize, isPending: isSummarizing } =
  //   useServerAction(summarizeArticleAction);

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
                onClick={async () => {
                  if (isBookmarked === false && !bookmarkId) {
                    const [_, err] = await createBookmarkAction({
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
