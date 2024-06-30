"use client";

import React from "react";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ErrorCardProps {
  title?: string;
  message?: string;
}

export function ErrorCard({
  title = "Couldn't load this article.",
  message = "Looks like we ran into an issue while loading the article. Don't worry. Hitting reload should fix the issue.",
}: ErrorCardProps) {
  return (
    <Card className={cn("p-8 w-full max-w-2xl border-2 bg-accent space-y-4")}>
      <Image
        src="https://illustrations.popsy.co/white/abstract-art-4.svg"
        alt="Error"
        className="mx-auto"
        width={300}
        height={200}
      />
      <form
        className="flex flex-col items-center space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          window.location.reload();
        }}
      >
        <h3 className="font-heading text-xl">{title}</h3>
        <p className="text-muted-foreground text-base max-w-md text-center pb-2">
          {message}
        </p>
        <Button className="w-full max-w-[180px] font-bold" type="submit">
          <Icons.retry size={14} className="mr-2 font-semibold" />
          Reload
        </Button>
      </form>
    </Card>
  );
}
