"use client";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import Balancer from "react-wrap-balancer";
import { deleteBookmarkAction } from "../bookmark";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";
import Cookies from "js-cookie";
import { cn, formatDate, getLocalStorageItem } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Bookmark } from "../bookmark-wrapper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as cheerio from "cheerio";
import { useEffect, useMemo, useState } from "react";
import { BookmarksSearchBox } from "./bookmarks-search-box";
import { BookmarksDisplayMenu } from "./bookmarks-display";
import { BookmarkButton } from "./bookmark-button";
import Image from "next/image";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

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
  const id = uuidv4();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  // const [layout, setLayout] = useState<"grid" | "rows">(() => {
  //   return (localStorage.getItem("layout") as "grid" | "rows") || "grid";
  // });
  // const [orderBy, setOrderBy] = useState<OrderBy>(() => {
  //   return (localStorage.getItem("orderBy") as OrderBy) || "date";
  // });
  const [layout, setLayout] = useState<"grid" | "rows">("grid");
  const [orderBy, setOrderBy] = useState<OrderBy>("date");

  useEffect(() => {
    setLayout(getLocalStorageItem("layout", "grid") as "grid" | "rows");
    setOrderBy(getLocalStorageItem("orderBy", "date") as OrderBy);
  }, []);

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
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              userId={userId}
              pathname={pathname}
              articleId={id}
            />
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

function BookmarkCard({
  bookmark,
  userId,
  articleId,
  pathname,
}: {
  bookmark: Bookmark;
  userId: number;
  articleId: string;
  pathname: string;
}) {
  const [dialogState, setDialogState] = useState<
    "closed" | "dropdown" | "alert"
  >("closed");

  return (
    <Card
      className={cn(
        `relative flex w-full transform-gpu cursor-pointer flex-col gap-2 rounded-xl border bg-white p-2 shadow-sm transition-all duration-200 ease-in-out [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]`,
      )}
      // onClick={() => {
      //   Cookies.set(id, bookmark.articleUrl, {
      //     expires: 1 / 288, // Cookie expires in 5 minutes (1/288 of a day)
      //     secure: true,
      //     path: "/",
      //     sameSite: "strict", // Cookie is sent only when the request is coming from the same origin
      //   });
      // }}
    >
      {/* <Link href={`/article/${id}`} aria-label="article-link"> */}
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
                {bookmark.publishDate && <span className="px-2">·</span>}
                {bookmark.publishDate && formatDate(bookmark.publishDate)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <DropdownMenu
              open={dialogState === "dropdown"}
              onOpenChange={(open) =>
                setDialogState(open ? "dropdown" : "closed")
              }
            >
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
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
                    className="lucide lucide-ellipsis-vertical h-4 w-4 text-muted-foreground"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-full rounded-lg p-2 text-muted-foreground sm:w-52"
              >
                <DropdownMenuGroup className="grid gap-px pb-1">
                  <DropdownMenuItem
                    disabled
                    className="flex h-9 gap-3 rounded-md px-2"
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
                      className="lucide lucide-pen-line h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"></path>
                    </svg>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled
                    className="flex h-9 gap-3 rounded-md px-2"
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
                      className="lucide lucide-pen-line h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"></path>
                    </svg>
                    Add to folder
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled
                    className="flex h-9 gap-3 rounded-md px-2"
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
                      className="lucide lucide-pen-line h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"></path>
                    </svg>
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="h-9 rounded-md px-2"
                    onClick={() => {
                      Cookies.set(articleId, bookmark.articleUrl, {
                        expires: 1 / 288, // Cookie expires in 5 minutes (1/288 of a day)
                        secure: true,
                        path: "/",
                        sameSite: "strict", // Cookie is sent only when the request is coming from the same origin
                      });
                    }}
                  >
                    <Link
                      href={`/article/${articleId}`}
                      aria-label="article-link"
                      className="flex items-center gap-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-link-2 h-4 w-4"
                      >
                        <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
                        <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
                        <line x1="8" x2="16" y1="12" y2="12"></line>
                      </svg>
                      Read article
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className={cn("tb-1 grid gap-px")}>
                  <DropdownMenuItem
                    onSelect={() => setDialogState("alert")}
                    className={cn(
                      "flex h-9 gap-3 rounded-md px-2 text-red-500 hover:bg-red-600 hover:text-white",
                    )}
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
                      className="lucide lucide-delete h-4 w-4"
                    >
                      <path d="M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"></path>
                      <path d="m12 9 6 6"></path>
                      <path d="m18 9-6 6"></path>
                    </svg>
                    Delete bookmark
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog
              open={dialogState === "alert"}
              onOpenChange={(open) => setDialogState(open ? "alert" : "closed")}
            >
              <AlertDialogContent className="gap-0 p-0 sm:rounded-2xl">
                <AlertDialogHeader>
                  <div className="flex flex-col items-center justify-center space-y-3 border-b border-input px-4 py-7 pt-8 text-center sm:px-16">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center gap-2",
                      )}
                    >
                      <div
                        role="img"
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-white"
                      >
                        <Icons.logo className="text-white dark:text-background" />
                      </div>
                      <Balancer
                        as="h3"
                        className="font-urban text-2xl font-bold"
                      >
                        Delete bookmark
                      </Balancer>
                      <Balancer className="text-sm text-muted-foreground">
                        Warning: Deleting this bookmark will remove all of its
                        data. This action cannot be undone – proceed with
                        caution.
                      </Balancer>
                    </div>
                  </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="w-full rounded-2xl">
                  <div className="flex w-full flex-col space-y-3 bg-secondary/50 px-4 py-8 text-left sm:px-16">
                    <p className="block text-sm text-muted-foreground">
                      Are you sure you want to delete this bookmark?
                    </p>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={cn(
                        "border-red-500 bg-red-500 text-white ring-offset-red-100 hover:bg-red-600 hover:ring-4 hover:ring-red-100 focus:ring-red-100",
                      )}
                      onClick={async () => {
                        const [_, error] = await deleteBookmarkAction({
                          path: pathname,
                          id: bookmark.id,
                          userId: userId,
                        });

                        if (error) {
                          toast.error("Failed to delete bookmark");
                          return;
                        }

                        toast.success("Bookmark has been successfully deleted");
                        setDialogState("closed");
                      }}
                    >
                      Delete Bookmark
                    </AlertDialogAction>
                  </div>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <Balancer as="h3" className="pt-4 text-xl font-medium">
          {bookmark.title}
        </Balancer>
        <CardDescription className={cn("pt-2")}>
          {extractFirstSentence(bookmark.content)}
        </CardDescription>
      </CardContent>
      {/* </Link> */}
    </Card>
  );
}
