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
    <div className="relative w-full h-full flex flex-col flex-1 items-center justify-center bg-background dark space-y-6">
      <SparkleBg sparkleCount={300} sparkleSize={2} />
      <Balancer
        as="h1"
        className="px-6 text-white text-center font-sans text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl lg:font-heading lg:text-6xl xl:text-7xl lg:tracking-normal"
      >
        Page not found
      </Balancer>
      <Balancer className="max-w-[40rem] px-6 text-center leading-normal text-lg text-muted-foreground sm:leading-8">
        The page you&apos;re searching for is not available.
      </Balancer>
      <Link
        href="/"
        className={cn(
          buttonVariants({
            variant: "default",
            size: "lg",
          }),
          "w-full max-w-[200px] h-12 rounded-full relative overflow-hidden min-w-[110px] font-bold items-center"
        )}
      >
        Go back home{" "}
        <span className="ml-2 font-bold text-purple-500">({countdown})</span>
      </Link>
    </div>
  );
}
