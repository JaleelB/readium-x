import { bookmarkSchema } from "@/schemas/article";
import { z } from "zod";
import { getBookmarksUseCase } from "@/use-cases/bookmarks";
import { Card } from "@/components/ui/card";
import BookmarksList from "./components/bookmark-list";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { User } from "@/server/db/schema";
import { BookmarkButton } from "./components/bookmark-button";
import Balancer from "react-wrap-balancer";

export type Bookmark = z.infer<typeof bookmarkSchema>;

function EmptyBookmarks() {
  return (
    <div className="flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Balancer as="h1" className="font-heading text-3xl font-bold">
            Bookmarks
          </Balancer>
          <Balancer className="text-muted-foreground">
            Manage your bookmarked articles
          </Balancer>
        </div>
        <Card
          className={cn(
            "mx-auto mt-12 w-full max-w-2xl space-y-4 border-2 bg-accent p-8 shadow-none",
          )}
        >
          <Image
            src="https://illustrations.popsy.co/white/abstract-art-4.svg"
            alt="Error"
            priority
            className="mx-auto"
            width={300}
            height={200}
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <h3 className="font-heading text-xl">No bookmarked articles</h3>
            <p className="max-w-md pb-2 text-center text-base text-muted-foreground">
              You haven&apos;t bookmarked any articles yet. Click the button
              below to start bookmarking.
            </p>
            <BookmarkButton text="Create a new bookmark" />
          </div>
        </Card>
      </div>
    </div>
  );
}

export async function BookmarkWrapper({ user }: { user: User }) {
  const bookmarks = await getBookmarksUseCase(user.id);

  if (bookmarks.length === 0) {
    return <EmptyBookmarks />;
  }

  return <BookmarksList bookmarks={bookmarks} userId={user.id} />;
}
