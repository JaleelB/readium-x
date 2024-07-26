"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LoaderButton } from "./loader-button";

export function OAuthButton({
  provider,
  children,
}: {
  provider: "google" | "github";
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/login/${provider}`);
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("OAuth initiation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoaderButton
      isLoading={isLoading}
      onClick={handleClick}
      className={cn(
        buttonVariants({
          variant: "outline",
          className: "text-white",
        }),
        "w-full",
      )}
      type="submit"
    >
      {children}
    </LoaderButton>
  );
}
