"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";

import { buttonVariants } from "./ui/button";
import { Icons } from "./icons";
import { cn } from "@/lib/utils";
import { OptionsMenu } from "./menu";
import { siteConfig } from "@/app-config";
import { User } from "@/server/db/schema";

export default function Nav({ user }: { user: User | undefined }) {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const lastScrollY = useRef(0);

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
          headerRef.current.style.transform = "translateY(0)";
          headerRef.current.style.transition = "transform 0.3s ease-in-out";
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
      className={`flex h-[64px] w-full px-4 md:px-8 fixed inset-0 justify-between items-center z-[1500]`}
    >
      {/* <div className={`flex h-items-center`}> */}
      <Link
        href="/"
        className={`flex items-center ${
          lastScrollY.current > 64
            ? "bg-background border rounded-full px-3 py-2"
            : ""
        }`}
      >
        <Icons.logo />
        <h4 className="ml-2 font-heading text-xl">{siteConfig.short_name}</h4>
      </Link>
      {/* </div> */}

      <div className={`flex h-full w-1/2 items-center justify-end gap-2`}>
        {!user && (
          <Link
            href="/signin"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full h-9 dark:border-white/20"
            )}
          >
            <Icons.user className="w-4 h-4 mr-2" />
            <span>Sign in</span>
          </Link>
        )}
        <OptionsMenu user={user} />
      </div>
    </header>
  );
}
