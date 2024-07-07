"use client";

import { useSparkle } from "@/hooks/use-sparkle";
import Balancer from "react-wrap-balancer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const sparkleContainerRef = useSparkle<HTMLDivElement>({
    color: "#fff",
    sparkleCount: 100,
    sparkleSize: 3,
  });
  const [countdown, setCountdown] = useState(15);
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
      <div ref={sparkleContainerRef} className="absolute w-full h-full" />
      <Balancer
        as="h1"
        className="px-6 text-white text-center font-sans text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl lg:font-heading lg:text-6xl xl:text-7xl lg:tracking-normal"
      >
        Oops! Something went wrong
      </Balancer>
      <Balancer className="max-w-[40rem] px-6 text-center leading-normal text-lg text-muted-foreground sm:leading-8">
        {error.message}
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
