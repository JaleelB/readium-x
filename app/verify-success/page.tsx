"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import { SparkleBg } from "@/components/sparkle-bg";

export default function VerifySuccess() {
  return (
    <main className="dark relative flex h-full w-full flex-1 flex-col items-center justify-center space-y-3 bg-background">
      <SparkleBg sparkleCount={300} sparkleSize={2} />
      <div className="z-20 w-full max-w-sm space-y-6 rounded-lg border bg-background/95 p-6 text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/" className="flex w-full items-center justify-center">
          <div
            role="img"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary dark:bg-white"
          >
            <Icons.logo className="text-white dark:text-background" />
          </div>
        </Link>
        <div className="flex flex-col space-y-1.5 pb-6">
          <Balancer
            as="h3"
            className="text-center text-2xl font-semibold tracking-tight"
          >
            Email Successfully Verified
          </Balancer>
          <Balancer className="text-center text-sm text-muted-foreground">
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
            "w-full",
          )}
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
