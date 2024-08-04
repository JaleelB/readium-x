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
import { SparkleBg } from "@/components/sparkle-bg";
import { CreateBookmarkForm } from "./create-bookmark-form";

export async function BookmarkButton({ text = "New" }: { text?: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          className={cn(
            "relative h-10 w-full items-center overflow-hidden rounded-[0.5rem] border border-input/25 bg-[#1d1c20] p-0 dark:border-white/15 dark:bg-[#1a1a1a] dark:text-white md:w-fit",
          )}
        >
          <div className="z-20 flex h-full items-center px-4 py-2 sm:gap-1.5">
            <span className="mr-1">{text}</span>
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
        <CreateBookmarkForm />
      </DialogContent>
    </Dialog>
  );
}
