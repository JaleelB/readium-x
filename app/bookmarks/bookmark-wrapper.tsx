import { articleSchema } from "@/schemas/article";
import { z } from "zod";
import { headers } from "next/headers";
import { getBookmarksUseCase } from "@/use-cases/bookmarks";
import { SuspenseIf } from "@/components/suspense-if";
import { BookmarkSkeleton } from "./page";
import { Card } from "@/components/ui/card";
import BookmarksList from "./bookmark-list";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type Bookmark = {
  id: number;
} & z.infer<typeof articleSchema>;

export type ExisitingUser = {
  email: string | null;
  id: number;
  emailVerified: Date | null;
};

async function BookmarkLoader({ user }: { user: ExisitingUser }) {
  const bookmarks = await getBookmarksUseCase(user.id);

  if (bookmarks.length === 0) {
    return (
      <div className="flex-1">
        <Card
          className={cn(
            "mt-12 p-8 w-full max-w-2xl space-y-4 border-none mx-auto"
          )}
        >
          <Image
            src="https://illustrations.popsy.co/white/abstract-art-4.svg"
            alt="Error"
            className="mx-auto"
            width={300}
            height={200}
          />
          <form
            className="flex flex-col items-center space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
          >
            <h3 className="font-heading text-xl">No bookmarked articles</h3>
            <p className="text-muted-foreground text-base max-w-md text-center pb-2">
              You haven&apos;t bookmarked any articles yet. Click the button
              below to start bookmarking.
            </p>
          </form>
        </Card>
      </div>
    );
  }

  return <BookmarksList bookmarks={bookmarks} />;
}

export async function BookmarkWrapper({
  user,
}: {
  user: {
    email: string | null;
    id: number;
    emailVerified: Date | null;
  };
}) {
  let bookmarks: Bookmark[] | null = null;

  // if browser is requesting html it means it's the first page load
  if (headers().get("accept")?.includes("text/html")) {
    bookmarks = await getBookmarksUseCase(user.id);
  }

  return (
    <SuspenseIf condition={!bookmarks} fallback={<BookmarkSkeleton />}>
      <BookmarkLoader user={user} />
    </SuspenseIf>
  );
}
