"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

export type ReadingHistory = {
  authorName: string;
  authorImageURL: string | null;
  authorProfileURL: string | null;
  readTime: string;
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date | null;
  articleUrl: string;
  articleTitle: string;
  accessTime: Date;
  progress: string | null;
};

export function HistoryList({ historyLog }: { historyLog: ReadingHistory[] }) {
  const id = uuidv4();

  return (
    <ul className="flex-1 w-full h-full overflow-y-auto">
      {historyLog.map((historyLog) => (
        <li
          key={historyLog.id}
          className="aria-selected:bg-gray-alpha-100 transition-colors duration-150 focus:outline-none cursor-pointer data-[disabled='true']:cursor-default flex items-center py-2 px-3 gap-4"
          role="option"
          aria-disabled="false"
          aria-selected="false"
          data-disabled="false"
          data-selected="false"
        >
          <div className="h-10 w-10 center bg-gray-alpha-100 rounded-lg">
            <Avatar className="w-11 h-11 rounded-md">
              <AvatarImage
                src={
                  historyLog.authorImageURL ||
                  "https://illustrations.popsy.co/white/genius.svg"
                }
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="relative flex-1 min-w-0">
            <div className="group relative w-fit h-fit mr-8">
              <div className="relative w-fit line-clamp-1">
                <Balancer className="text-sm text-dark font-medium break-all">
                  {historyLog.articleTitle}
                </Balancer>
              </div>
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-150 items-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-full p-1">
                <Button
                  variant="outline"
                  aria-label="Copy text"
                  size="icon"
                  className={cn(
                    "relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ring-0 ring-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ringRing disabled:pointer-events-none disabled:opacity-50 bg-background/20 border border-light text-dark shadow-xs disabled:text-light text-2xs center p-0 h-5 w-5 rounded-md hover:ring-2"
                  )}
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    className="w-2.5 h-2.5"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      width="336"
                      height="336"
                      x="128"
                      y="128"
                      fill="none"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      rx="57"
                      ry="57"
                    ></rect>
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24"
                    ></path>
                  </svg>
                </Button>
              </div>
            </div>
            <Balancer
              as="p"
              className="text-xs text-muted-foreground font-normal line-clamp-1 items-center"
            >
              {historyLog.authorName} • <span>{historyLog.readTime}</span>
            </Balancer>
          </div>
          <div className="flex gap-2 items-center w-fit">
            <div
              onClick={() => {
                Cookies.set(id, historyLog.articleUrl, {
                  expires: 1 / 288, // Cookie expires in 5 minutes (1/288 of a day)
                  secure: true,
                  path: "/",
                  sameSite: "strict", // Cookie is sent only when the request is coming from the same origin
                });
              }}
            >
              <Link
                href={`/article/${id}`}
                aria-label="article-link"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ring-0 ring-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ringRing disabled:pointer-events-none disabled:opacity-50 bg-background border border-light text-dark shadow-xs disabled:text-light hover:ring center p-0 h-9 w-9 rounded-full relative text-lg hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-link-2 w-[18px] h-[18px]"
                  >
                    <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
                    <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
                    <line x1="8" x2="16" y1="12" y2="12"></line>
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
