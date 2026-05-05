"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { LoaderButton } from "./loader-button";
import { Icons } from "./icons";
import { useSignIn } from "@clerk/nextjs";
import { afterLoginUrl } from "@/app-config";

export function OAuthButton({
  provider,
  children,
}: {
  provider: "google" | "github";
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useSignIn();

  const handleClick = async () => {
    if (!signIn) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn.sso({
        strategy: `oauth_${provider}`,
        redirectCallbackUrl: "/sso-callback",
        redirectUrl: afterLoginUrl,
      });

      if (error) {
        console.error("OAuth initiation failed", error);
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
      type="button"
    >
      {provider === "google" && !isLoading && (
        <Icons.google className="mr-2 h-4 w-4" />
      )}
      {provider === "github" && !isLoading && (
        <Icons.github className="mr-2 h-4 w-4" />
      )}
      {children}
    </LoaderButton>
  );
}
