import { articleSchema } from "@/schemas/article";
import { z } from "zod";
import { headers } from "next/headers";
import { getBookmarksUseCase } from "@/use-cases/bookmarks";
import { SuspenseIf } from "@/components/suspense-if";
import { Card } from "@/components/ui/card";
import BookmarksList from "./components/bookmark-list";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { getBookmarksAction } from "./bookmark";
import { ErrorCard } from "@/components/error-card";
import { User } from "lucia";

export type Bookmark = {
  id: number;
} & z.infer<typeof articleSchema>;

function BookmarkSkeleton() {
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted"></div>
      </div>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <div className="inline-flex h-12 animate-pulse items-center rounded-full bg-muted">
          <span className="mr-1 text-muted">New</span>
          <Icons.plus className="h-5 w-5 text-muted" />
        </div>
      </div>
    </>
  );
}

async function BookmarkLoader({ user }: { user: User }) {
  const [data, err] = await getBookmarksAction({
    userId: user.id,
  });

  if (!data || data.length === 0) {
    return (
      <div className="flex-1">
        <Card
          className={cn(
            "mx-auto mt-12 w-full max-w-2xl space-y-4 border-none p-8",
          )}
        >
          <Image
            src="https://illustrations.popsy.co/white/abstract-art-4.svg"
            alt="Error"
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
          </div>
        </Card>
      </div>
    );
  }

  if (err) {
    return (
      <ErrorCard
        title="Error loading bookmarks"
        message="An error occurred while loading your bookmarks. Please try again later."
      />
    );
  }

  return <BookmarksList bookmarks={data} userId={user.id} />;
}

export async function BookmarkWrapper({ user }: { user: User }) {
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
