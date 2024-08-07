"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { siteConfig } from "@/app-config";
import { UserInfo } from "./site-header";
import { Profile } from "@/server/db/schema";

export function OptionsMenu({
  user,
  profile,
}: {
  user: UserInfo;
  profile: Profile;
}) {
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  return (
    <DropdownMenu open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("rounded-full dark:border-white/20")}
        >
          <Icons.menu className="mr-2 h-4 w-4" />
          <Icons.chevronDown
            className={`h-4 w-4 text-muted-foreground transition duration-200 ${
              open ? "rotate-180 transform" : ""
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[550] w-60">
        <DropdownMenuLabel className="p-1 px-0">
          {!user && (
            <Link href="/signin">
              <DropdownMenuItem>
                <Icons.user className="mr-2 h-4 w-4" />
                <span>Login</span>
              </DropdownMenuItem>
            </Link>
          )}
          {user && (
            <DropdownMenuItem className="flex flex-col items-start py-0.5">
              <span className="truncate text-sm capitalize">
                {profile.displayName}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user && (
          <>
            <DropdownMenuGroup>
              <Link href="/bookmarks">
                <DropdownMenuItem>
                  <Icons.bookmark className="mr-2 h-4 w-4" />
                  <span>Bookmarks</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/history">
                <DropdownMenuItem>
                  <Icons.history className="mr-2 h-4 w-4" />
                  <span>Reading History</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <Link href="/">
          <DropdownMenuItem>
            <Icons.logo className="mr-2 h-4 w-4" />
            <span>Home</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/account/settings">
          <DropdownMenuItem>
            <Icons.settings className="mr-2 h-4 w-4" />
            <span>Preferences</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className={cn("z-[550]")}>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icons.theme className="mr-2 h-4 w-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Icons.sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Icons.moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Icons.system className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DropdownMenuItem>
            <Icons.github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem>
        </Link>
        <Link
          href={siteConfig.links.twitter}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DropdownMenuItem>
            <Icons.twitter className="mr-2 h-3 w-3" />
            <span>Twitter</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        {user && (
          <form action="/api/sign-out" method="POST">
            <Button
              className="flex h-fit cursor-pointer items-center p-0 px-2 py-1.5 hover:bg-transparent"
              variant="ghost"
            >
              <Icons.logout className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
