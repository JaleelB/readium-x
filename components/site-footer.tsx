"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

function SiteFooter() {
  return (
    <div className="container flex items-center justify-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
      <div className="flex flex-col items-center px-8 md:flex-row md:gap-2 md:px-0">
        <p className="text-center text-sm leading-loose md:text-left">
          Built by{" "}
          <Link
            href={siteConfig.creator.twitter}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            {siteConfig.creator.name}
          </Link>
          . Hosted on{" "}
          <Link
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Vercel
          </Link>
          . The source code is available on{" "}
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default SiteFooter;
