import { articleSchema, bookmarkSchema } from "@/schemas/article";
import { z } from "zod";
import { headers } from "next/headers";
import { getBookmarksUseCase } from "@/use-cases/bookmarks";
import { SuspenseIf } from "@/components/suspense-if";
import { Card } from "@/components/ui/card";
import BookmarksList from "./components/bookmark-list";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getBookmarksAction } from "./bookmark";
import { ErrorCard } from "@/components/error-card";
import { User } from "lucia";
import { BookmarkButton } from "./components/bookmark-button";
import Balancer from "react-wrap-balancer";

export type Bookmark = z.infer<typeof bookmarkSchema>;

function BookmarkSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-12 lg:px-20">
      <div className="flex flex-col justify-between gap-4 md:flex-row lg:items-center lg:gap-0">
        <div className="flex flex-col gap-1">
          <Balancer as="h1" className="font-heading text-3xl font-bold">
            Bookmarks
          </Balancer>
        </div>
        <div className="mr-1 flex flex-col items-center gap-2 md:flex-row md:justify-end">
          <div className="w-full md:w-56 lg:w-64" />
          <div className="flex w-full gap-2 md:w-fit">
            <div className="w-full md:w-[130px]" />
            <div className="w-full md:w-[94px]" />
          </div>
        </div>
      </div>
      <div className="relative grid h-fit w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-[200px] w-full animate-pulse rounded-lg bg-muted"></div>
      </div>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <div className="inline-flex h-12 w-10 animate-pulse items-center rounded-full bg-muted">
          <span className="mr-1 text-muted">New</span>
        </div>
      </div>
    </div>
  );
}

async function BookmarkLoader({ user }: { user: User }) {
  const [data, err] = await getBookmarksAction({
    userId: user.id,
  });

  if (!data || data.length === 0) {
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
