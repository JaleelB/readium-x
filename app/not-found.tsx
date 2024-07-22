"use client";

import { SparkleBg } from "@/components/sparkle-bg";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";

export default function NotFound() {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown === 0) {
      router.push("/");
    }

    return () => clearInterval(interval);
  }, [countdown, router]);

  return (
    <div className="dark relative flex h-full w-full flex-1 flex-col items-center justify-center space-y-6 bg-background">
      <SparkleBg sparkleCount={300} sparkleSize={2} />
      <Balancer
        as="h1"
        className="px-6 text-center font-sans text-4xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:font-heading lg:text-6xl lg:tracking-normal xl:text-7xl"
      >
        Page not found
      </Balancer>
      <Balancer className="max-w-[40rem] px-6 text-center text-lg leading-normal text-muted-foreground sm:leading-8">
        The page you&apos;re searching for is not available.
      </Balancer>
      <Link
        href="/"
        className={cn(
          buttonVariants({
            variant: "default",
            size: "lg",
          }),
          "relative h-12 w-full min-w-[110px] max-w-[200px] items-center overflow-hidden rounded-full font-bold",
        )}
      >
        Go back home{" "}
        <span className="ml-2 font-bold text-purple-500">({countdown})</span>
      </Link>
    </div>
  );
}
