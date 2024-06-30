"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Balancer } from "react-wrap-balancer";

export default function Home() {
  return (
    <section className="px-4 md:px-8 flex w-full flex-col gap-7 items-center">
      <Balancer
        as="h1"
        className="mt-20 px-6  text-center font-sans text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl lg:font-heading lg:text-6xl lg:tracking-normal"
      >
        <p className="relative inline-block">
          <span className="z-0 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text pb-1 text-transparent dark:from-white dark:to-white">
            Read and Manage
          </span>
        </p>{" "}
        {""}
        Premium <br /> Medium Articles for {""}
        <span className="z-0 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text pb-1 text-transparent dark:from-white dark:to-white">
          Free
        </span>
      </Balancer>
      <Balancer className="max-w-[47rem] px-6 text-center leading-normal text-muted-foreground sm:leading-8">
        An open source tool for accessing premium Medium articles, bypassing
        paywalls, and managing your reading across devices.
      </Balancer>
      <form
        action=""
        className="relative z-10 h-14 w-full min-w-0 max-w-xl bg-neutral-900 rounded-full p-2 md:pl-4 mt-2"
      >
        <div className="h-full rounded-full flex items-center justify-between relative">
          <Icons.sun className="text-white w-6 h-6" />
          <Input
            type="url"
            className={cn(
              "w-full mx-4 h-5 p-0 bg-transparent text-neutral-100 placeholder-neutral-300 border-none focus-visible:ring-0 focus:placeholder-neutral-400"
            )}
            placeholder="Paste Medium Article URL"
          />
          <Button
            type="submit"
            className={cn("rounded-full border border-accent")}
          >
            <div
              style={{
                backgroundImage:
                  "radial-gradient(circle farthest-side at 50% 150%,#fff,rgba(255,255,255,.54) 0%,rgba(255,255,255,0) 67%)",
              }}
            ></div>
            Generate
          </Button>
        </div>
      </form>
    </section>
  );
}
