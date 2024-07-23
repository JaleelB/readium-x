"use client";

import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import Balancer from "react-wrap-balancer";
import { deleteBookmarkAction } from "./bookmark";
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
import { Bookmark } from "./bookmark-wrapper";
import { usePathname } from "next/navigation";

function extractFirstSentence(htmlContent: string): string {
  // Create a new DOMParser instance
  const parser = new DOMParser();

  // Parse the HTML content
  const doc = parser.parseFromString(htmlContent, "text/html");

  // Find the first paragraph element
  const firstParagraph = doc.querySelector("p");

  if (!firstParagraph || !firstParagraph.textContent) {
    return "No content available.";
  }

  // Regular expression to match sentences. Adjust according to language specifics.
  const sentenceRegex = /([^.!?]*[.!?])\s*/;
  const matches = firstParagraph.textContent.match(sentenceRegex);

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
  const pathname = usePathname();
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {bookmarks.map((bookmark) => (
        // border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]
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
                    {bookmark.publishDate && <span className="px-2">·</span>}
                    {bookmark.publishDate && formatDate(bookmark.publishDate)}
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
                          description: "Bookmark has been successfully deleted",
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
      ))}
    </div>
  );
}
