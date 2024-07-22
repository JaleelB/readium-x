"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Icons } from "./icons";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function SignInAction({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  //   return (
  //     <>
  //       <div className="hidden sm:block">
  // <Dialog open={open} onOpenChange={onOpenChange}>
  //   <DialogContent className={cn("w-full p-0 gap-0 rounded-2xl")}>
  //     <DialogHeader
  //       className={cn(
  //         "flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16"
  //       )}
  //     >
  //       <DialogTitle
  //         className={cn(
  //           "flex flex-col gap-2 justify-center items-center"
  //         )}
  //       >
  //         <div
  //           role="img"
  //           className="w-12 h-12 bg-primary dark:bg-white rounded-full flex items-center justify-center"
  //         >
  //           <Icons.logo className="text-white dark:text-background" />
  //         </div>
  //         <Balancer as="h3" className="font-urban text-2xl font-bold">
  //           Sign in
  //         </Balancer>
  //       </DialogTitle>
  //       <DialogDescription className={cn("text-center")}>
  //         Join our community and unlock the full potential of ReadiumX.
  //         Sign in and begin accessing and managing your Medium articles.
  //       </DialogDescription>
  //     </DialogHeader>
  //     <DialogFooter
  //       className={cn(
  //         "flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16"
  //       )}
  //     >
  //       <Link
  //         href="/signin"
  //         className={cn(
  //           buttonVariants({
  //             variant: "default",
  //           }),
  //           "w-full"
  //         )}
  //       >
  //         Sign in and get started
  //       </Link>
  //     </DialogFooter>
  //   </DialogContent>
  // </Dialog>
  //       </div>
  //       <div className="sm:hidden">

  //       </div>
  //     </>
  //   );
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("w-full gap-0 rounded-2xl p-0")}>
          <DialogHeader
            className={cn(
              "flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16",
            )}
          >
            <DialogTitle
              className={cn("flex flex-col items-center justify-center gap-2")}
            >
              <div
                role="img"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-white"
              >
                <Icons.logo className="text-white dark:text-background" />
              </div>
              <Balancer as="h3" className="font-urban text-2xl font-bold">
                Sign in
              </Balancer>
            </DialogTitle>
            <DialogDescription className={cn("text-center")}>
              Join our community and unlock the full potential of ReadiumX. Sign
              in and begin accessing and managing your Medium articles.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter
            className={cn(
              "flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16",
            )}
          >
            <Link
              href="/signin"
              className={cn(
                buttonVariants({
                  variant: "default",
                }),
                "w-full",
              )}
            >
              Sign in and get started
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader
          className={cn(
            "flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16",
          )}
        >
          <div
            className={cn("flex flex-col items-center justify-center gap-2")}
          >
            <div
              role="img"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-white"
            >
              <Icons.logo className="text-white dark:text-background" />
            </div>
            <Balancer as="h3" className="font-urban text-2xl font-bold">
              Sign in
            </Balancer>
          </div>
          <DrawerDescription>
            Join our community and unlock the full potential of ReadiumX. Sign
            in and begin accessing and managing your Medium articles.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          <Link
            href="/signin"
            className={cn(
              buttonVariants({
                variant: "default",
              }),
              "w-full",
            )}
          >
            Sign in and get started
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
