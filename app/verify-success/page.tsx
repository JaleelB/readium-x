"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import { SparkleBg } from "@/components/sparkle-bg";

export default function VerifySuccess() {
  return (
    <main className="dark relative w-full h-full flex flex-col flex-1 items-center justify-center space-y-3 bg-background">
      <SparkleBg sparkleCount={100} />
      <div className="rounded-lg border shadow-sm w-full max-w-sm text-foreground p-6 space-y-6 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="w-full flex justify-center items-center">
          <div
            role="img"
            className="w-12 h-12 bg-primary dark:bg-white rounded-full flex items-center justify-center"
          >
            <Icons.logo className="text-white dark:text-background" />
          </div>
        </Link>
        <div className="flex flex-col space-y-1.5 pb-6">
          <Balancer
            as="h3"
            className="font-semibold tracking-tight text-2xl text-center"
          >
            Email Successfully Verified
          </Balancer>
          <Balancer className="text-sm text-muted-foreground text-center">
            Your email has been successfully verified. You can now sign in to
            your account.
          </Balancer>
        </div>
        <Link
          href="/signin"
          className={cn(
            buttonVariants({
              variant: "default",
            }),
            "w-full"
          )}
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
