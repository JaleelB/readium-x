import { Icons } from "@/components/icons";
import { getUser } from "@/data-access/users";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { BookmarkWrapper } from "./bookmark-wrapper";
import Balancer from "react-wrap-balancer";
import { BookmarkButton } from "./bookmark-button";

export async function BookmarkSkeleton() {
  return (
    <>
      <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="w-full h-[200px] bg-muted animate-pulse rounded-lg"></div>
        <div className="w-full h-[200px] bg-muted animate-pulse rounded-lg"></div>
        <div className="w-full h-[200px] bg-muted animate-pulse rounded-lg"></div>
      </div>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
        <div className="bg-muted animate-pulse rounded-full inline-flex items-center h-12">
          <span className="mr-1 text-muted">New</span>
          <Icons.plus className="text-muted w-5 h-5" />
        </div>
      </div>
    </>
  );
}

export default async function BookmarkPage() {
  const userSession = await getCurrentUser();
  if (!userSession) {
    redirect("/signin");
  }

  const user = await getUser(userSession.id);
  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="container px-4 sm:px-8 flex h-[calc(100vh-60px)] py-10">
      <div className="flex-1 flex flex-col gap-12">
        <div className="flex flex-col gap-1">
          <Balancer as="h1" className="text-3xl font-bold font-heading">
            Bookmarks
          </Balancer>
          <Balancer className="text-muted-foreground">
            Manage your bookmarked articles
          </Balancer>
        </div>
        <BookmarkWrapper user={user} />
      </div>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ">
        <BookmarkButton />
      </div>
    </div>
  );
}
