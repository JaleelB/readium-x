"use client";

import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import Balancer from "react-wrap-balancer";
import { deleteBookmarkAction } from "../bookmark";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bookmark } from "../bookmark-wrapper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as cheerio from "cheerio";
import { useEffect, useMemo, useState } from "react";
import { BookmarksSearchBox } from "./bookmarks-search-box";
import { BookmarksDisplayMenu } from "./bookmarks-display";
import { BookmarkButton } from "./bookmark-button";
import Image from "next/image";

export type Layout = "grid" | "rows";
export type OrderBy = "date" | "readTime" | "title";

function extractFirstSentence(htmlContent: string): string {
  const $ = cheerio.load(htmlContent);

  const firstParagraph = $("p").first().text();
  if (!firstParagraph) {
    return "No content available.";
  }

  // Regular expression to match sentences. Adjust according to language specifics.
  const sentenceRegex = /([^.!?]*[.!?])\s*/;
  const matches = firstParagraph.match(sentenceRegex);

  // Return the first sentence or a default message if no sentence found
  return matches ? matches[0].trim() : "No complete sentence found.";
}

export default function BookmarksList({
  bookmarks,
  userId,
}: {
  bookmarks: Bookmark[];
  userId: number;
}) {
  const { toast } = useToast();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [layout, setLayout] = useState<"grid" | "rows">(() => {
    return (localStorage.getItem("layout") as "grid" | "rows") || "grid";
  });
  const [orderBy, setOrderBy] = useState<OrderBy>(() => {
    return (localStorage.getItem("orderBy") as OrderBy) || "date";
  });

  useEffect(() => {
    localStorage.setItem("layout", layout);
  }, [layout]);

  useEffect(() => {
    localStorage.setItem("orderBy", orderBy);
  }, [orderBy]);

  const sortedAndFilteredBookmarks = useMemo(() => {
    let filtered = bookmarks;
    if (searchTerm) {
      filtered = bookmarks.filter((bookmark) =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered.sort((a, b) => {
      switch (orderBy) {
        case "date":
          return b.createdAt && a.createdAt
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : 0;
        case "readTime":
          return parseInt(a.readTime || "0") - parseInt(b.readTime || "0");
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [bookmarks, searchTerm, orderBy]);

  return (
    <div className="flex flex-1 flex-col gap-12">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div className="flex flex-col gap-1">
          <Balancer as="h1" className="font-heading text-3xl font-bold">
            Bookmarks
          </Balancer>
          <Balancer className="text-muted-foreground">
            Manage your bookmarked articles
          </Balancer>
        </div>
        <div className="mr-1 flex items-center gap-2">
          <BookmarksSearchBox />
          <BookmarksDisplayMenu
            layout={layout}
            setLayout={setLayout}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
          />
          <BookmarkButton />
        </div>
      </div>

      <div
        className={cn(
          "relative grid h-fit w-full gap-3",
          layout === "grid"
            ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1 gap-2",

          sortedAndFilteredBookmarks.length === 0 &&
            "h-full items-center justify-center",
        )}
      >
        {sortedAndFilteredBookmarks.length > 0 ? (
          sortedAndFilteredBookmarks.map((bookmark) => (
            <Card
              key={bookmark.id}
              className={cn(
                `relative flex w-full transform-gpu cursor-pointer flex-col gap-2 rounded-xl border bg-white p-2 shadow-sm transition-all duration-200 ease-in-out [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] hover:scale-[103%] dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]`,
              )}
            >
              <CardContent className="p-2">
                <div className="flex w-full justify-between">
                  <div className="flex w-full gap-3">
                    <Avatar className="h-11 w-11 rounded-md">
                      <AvatarImage
                        src={
                          bookmark.authorImageURL ||
                          "https://illustrations.popsy.co/white/genius.svg"
                        }
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <Link
                        href={(bookmark.authorProfileURL as string) || "#"}
                        className="font-medium"
                      >
                        {bookmark.authorName}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {bookmark.readTime}
                        {bookmark.publishDate && (
                          <span className="px-2">·</span>
                        )}
                        {bookmark.publishDate &&
                          formatDate(bookmark.publishDate)}
                      </div>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                      >
                        <Icons.bookmark className={`h-5 w-5 fill-current`} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will remove the bookmark from your list.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            const [_, error] = await deleteBookmarkAction({
                              path: pathname,
                              id: bookmark.id,
                              userId: userId,
                            });

                            if (error) {
                              toast({
                                title: "Error",
                                description: "Failed to delete bookmark",
                                variant: "destructive",
                              });
                              return;
                            }

                            toast({
                              title: "Bookmark deleted",
                              description:
                                "Bookmark has been successfully deleted",
                            });
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Balancer as="h3" className="pt-4 text-xl font-medium">
                  {bookmark.title}
                </Balancer>
                <CardDescription className={cn("pt-2")}>
                  {extractFirstSentence(bookmark.content)}
                </CardDescription>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card
            className={cn(
              "absolute inset-0 m-auto h-fit w-full max-w-2xl space-y-4 border-2 bg-accent p-8",
            )}
          >
            <Image
              src="https://illustrations.popsy.co/white/abstract-art-4.svg"
              alt="Error"
              className="mx-auto"
              width={300}
              height={200}
            />
            <div className="flex flex-col items-center space-y-2">
              <h3 className="font-heading text-xl">Bookmark not found!</h3>
              <p className="max-w-md pb-2 text-center text-base text-muted-foreground">
                Bummer! The bookmark you are looking for does not exist. You
                either typed in the wrong article name or you didn&apos;t
                bookmark the article.
              </p>
              <Button
                className="w-full max-w-[180px] px-10 font-bold"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete("search");
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
              >
                Back to my bookmarks
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
