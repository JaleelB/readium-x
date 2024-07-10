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
import { calculateReadTime, cn, formatDate } from "@/lib/utils";
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
}: {
  bookmarks: Bookmark[];
}) {
  const { toast } = useToast();
  return (
    <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 overflow-y-auto">
      {bookmarks.map((bookmark) => (
        <Card
          key={bookmark.id}
          className="flex flex-col gap-2 w-full border rounded-md p-2 shadow-sm transition-shadow"
        >
          <CardContent className="p-2">
            <div className="w-full flex justify-between">
              <div className="w-full flex gap-3">
                <Avatar className="w-11 h-11 rounded-md">
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
                  <div className="text-muted-foreground text-sm">
                    {calculateReadTime(bookmark.content)}
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
                    className="rounded-full w-10 h-10"
                  >
                    <Icons.bookmark className={`w-5 h-5 fill-current`} />
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
                        const [data, error] = await deleteBookmarkAction({
                          id: bookmark.id,
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
            <Balancer as="h3" className="text-xl font-medium pt-4">
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