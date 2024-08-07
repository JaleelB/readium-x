"use client";

import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function NavLink({
  segment,
  children,
}: {
  segment: string | null;
  children: ReactNode;
}) {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  const { slug } = useParams() as {
    slug?: string;
  };

  const href = `${slug ? `/${slug}` : "/account"}/settings${
    segment ? `/${segment}` : ""
  }`;

  const isSelected = selectedLayoutSegment === segment;

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        "whitespace-nowrap text-sm text-muted-foreground outline-none transition-all duration-75",
        "ring-black/50 focus-visible:ring-2",
        isSelected
          ? "font-semibold text-primary"
          : "hover:text-primary active:text-primary",
      )}
    >
      {children}
    </Link>
  );
}
