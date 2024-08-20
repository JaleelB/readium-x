"use client";

import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { redirect, usePathname } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Balancer } from "react-wrap-balancer";
import { toast } from "sonner";
import { deleteUserAction } from "../actions";

export default function DeleteAccount({ id }: { id: number }) {
  const { setShowDeleteAccountModal, DeleteAccountModal } =
    useDeleteAccountModal(id);

  return (
    <div className="rounded-lg border border-destructive bg-background">
      <DeleteAccountModal />
      <div className="flex flex-col space-y-3 p-5 sm:p-10">
        <h2 className="text-xl font-medium">Delete Account</h2>
        <p className="text-sm text-muted-foreground">
          Permanently delete your {env.NEXT_PUBLIC_APP_NAME} account, all of
          your bookmarks, and reading lists. This action cannot be undone -
          please proceed with caution.
        </p>
      </div>
      <div className="border-b border-destructive" />

      <div className="flex items-center justify-end p-6">
        <div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteAccountModal(true)}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeleteAccountModal({
  showDeleteAccountModal,
  setShowDeleteAccountModal,
  userId,
}: {
  showDeleteAccountModal: boolean;
  setShowDeleteAccountModal: Dispatch<SetStateAction<boolean>>;
  userId: number;
}) {
  const pathname = usePathname();

  return (
    <AlertDialog
      open={showDeleteAccountModal}
      onOpenChange={(open) => setShowDeleteAccountModal(open)}
    >
      <AlertDialogContent className="gap-0 p-0 sm:rounded-2xl">
        <AlertDialogHeader>
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-input px-4 py-7 pt-8 text-center sm:px-16">
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
                Delete your account
              </Balancer>
              <Balancer className="text-sm text-muted-foreground">
                Warning: This action cannot be undone. This will permanently
                delete your account and remove your data from our servers.
              </Balancer>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full rounded-2xl">
          <div className="flex w-full flex-col space-y-3 bg-secondary/50 px-4 py-8 text-left sm:px-16">
            <p className="block text-sm text-muted-foreground">
              Are you sure you want to delete your account?
            </p>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "border-red-500 bg-red-500 text-white ring-offset-red-100 hover:bg-red-600 hover:ring-4 hover:ring-red-100 focus:ring-red-100",
              )}
              onClick={async () => {
                const [_, error] = await deleteUserAction({
                  path: pathname,
                  userId: userId,
                });

                if (error) {
                  toast.error("Failed to delete account");
                  return;
                }

                toast.success("Account has been successfully deleted");
                redirect("/signup");
              }}
            >
              Delete Account
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function useDeleteAccountModal(userId: number) {
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const DeleteAccountModalCallback = useCallback(() => {
    return (
      <DeleteAccountModal
        showDeleteAccountModal={showDeleteAccountModal}
        setShowDeleteAccountModal={setShowDeleteAccountModal}
        userId={userId}
      />
    );
  }, [showDeleteAccountModal, userId]);

  return useMemo(
    () => ({
      setShowDeleteAccountModal,
      DeleteAccountModal: DeleteAccountModalCallback,
    }),
    [setShowDeleteAccountModal, DeleteAccountModalCallback],
  );
}
