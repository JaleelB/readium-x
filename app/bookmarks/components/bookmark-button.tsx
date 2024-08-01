import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCurrentUser } from "@/lib/session";
import { getUser } from "@/data-access/users";
import { SparkleBg } from "@/components/sparkle-bg";
import { CreateBookmarkForm } from "./create-bookmark-form";
import { User } from "lucia";
import { ExisitingUser } from "./bookmark-wrapper";

export async function BookmarkButton() {
  const userSession = (await getCurrentUser()) as User;
  const user = (await getUser(userSession.id)) as ExisitingUser;

  return (
    <Dialog>
      <DialogTrigger className="rounded-full bg-[#141414] p-1 dark:border dark:border-input dark:bg-[#191919]">
        <Button
          className={cn(
            "relative h-12 items-center overflow-hidden rounded-full border border-input/25 bg-[#1d1c20] p-0 dark:border-white/15 dark:bg-[#1a1a1a] dark:text-white",
          )}
        >
          <div className="z-20 flex h-full items-center px-4 py-2 sm:gap-1.5">
            <span className="mr-1">New</span>
            <Icons.plus className="h-5 w-5 text-white" />
          </div>
          <SparkleBg />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new bookmark</DialogTitle>
          <DialogDescription>
            A bookmark is a way to save articles for later reading.
          </DialogDescription>
        </DialogHeader>
        <CreateBookmarkForm user={user} />
      </DialogContent>
    </Dialog>
  );
}
