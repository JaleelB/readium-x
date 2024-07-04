import React from "react";
import Link from "next/link";

import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { OptionsMenu } from "./menu";
import { siteConfig } from "@/app-config";
import { getCurrentUser } from "@/lib/session";
import { getUser } from "@/data-access/users";

export type UserInfo =
  | { id: number; email: string | null; emailVerified: Date | null }
  | null
  | undefined;

async function SiteHeader() {
  let userSession = await getCurrentUser();
  let user = null;

  if (!userSession) {
    user = null;
  }

  if (userSession) {
    user = await getUser(userSession.id);
  }

  return (
    <header className={`flex h-[64px] w-full px-4 md:px-8`}>
      <div className={`flex h-full w-1/2 items-center`}>
        <Link href="/" className="flex items-center">
          <Icons.logo />
          <h4 className="ml-2 font-heading text-xl">{siteConfig.short_name}</h4>
        </Link>
      </div>

      <div className={`flex h-full w-1/2 items-center justify-end gap-2`}>
        <Link
          href="/bookmarks"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "rounded-full h-9 dark:border-white/20"
          )}
        >
          <span>Bookmarks</span>
          <Icons.bookmark className="w-4 h-4 ml-2" />
        </Link>

        <OptionsMenu user={user} />
      </div>
    </header>
  );
}

export default SiteHeader;
