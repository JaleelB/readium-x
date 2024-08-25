"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { OptionsMenu } from "./menu";
import { siteConfig } from "@/app-config";
import { Profile, User } from "@/server/db/schema";
import { usePathname } from "next/navigation";

export default function Nav({
  user,
  profile,
}: {
  user: User | undefined;
  profile: Profile | undefined;
}) {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const lastScrollY = useRef(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (headerRef.current) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 64) {
          // Scroll down
          headerRef.current.style.transform = "translateY(-64px)";
          headerRef.current.style.transition = "transform 0.3s ease-in-out";
        } else {
          // Scroll up or at the top
          if (currentScrollY > 64) {
            setIsScrolled(currentScrollY > 64);
          }

          headerRef.current.style.transform = "translateY(0)";
          headerRef.current.style.transition = "transform 0.3s ease-in-out";
        }

        if (currentScrollY === 0) {
          setIsScrolled(false);
        }
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`${isScrolled && pathname.includes("article") ? "fixed border-b border-border bg-background" : "relative"} inset-0 z-[500] h-[64px] w-full`}
    >
      <div className="container relative flex h-full w-full flex-1 px-4 sm:px-8">
        <div className="mx-auto flex h-full w-full max-w-screen-xl flex-1 items-center justify-between lg:px-20 xl:px-[60px]">
          <Link href="/" className={`flex items-center`}>
            <Icons.logo />
            <h4 className="ml-2 font-heading text-xl">
              {siteConfig.short_name}
            </h4>
          </Link>

          <div className={`flex h-full w-1/2 items-center justify-end gap-2`}>
            {!user && (
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-9 rounded-full dark:border-white/20",
                )}
              >
                <Icons.user className="mr-2 h-4 w-4" />
                <span>Sign in</span>
              </Link>
            )}
            <OptionsMenu user={user} profile={profile} />
          </div>
        </div>
      </div>
    </header>
  );
}
