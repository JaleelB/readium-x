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
      <DialogTrigger className="bg-[#141414] dark:bg-[#191919] rounded-full p-1 dark:border dark:border-input">
        <Button
          className={cn(
            "overflow-hidden relative rounded-full items-center h-12 border border-input/25 bg-[#1d1c20] dark:bg-[#1a1a1a] dark:text-white dark:border-white/15 p-0"
          )}
        >
          <div className="h-full flex items-center sm:gap-1.5 px-4 py-2 z-20">
            <span className="mr-1">New</span>
            <Icons.plus className="text-white w-5 h-5" />
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
