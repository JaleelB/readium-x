import { articleSchema } from "@/schemas/article";
import { z } from "zod";
import { headers } from "next/headers";
import { getBookmarksUseCase } from "@/use-cases/bookmarks";
import { SuspenseIf } from "@/components/suspense-if";
import { HistoryList } from "./history-list";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SparkleBg } from "@/components/sparkle-bg";
import { getReadingHistoryAction } from "./history";
import { notFound } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Bookmark = {
  id: number;
} & z.infer<typeof articleSchema>;

export type ExisitingUser = {
  email: string | null;
  id: number;
  emailVerified: Date | null;
};

function HistorySkeleton() {
  return (
    <div className="relative mx-auto flex min-h-[90%] w-full max-w-none flex-col rounded-none border-0 bg-background text-card-foreground shadow-2xl backdrop-blur-lg md:shadow-xl lg:min-h-[34rem] lg:max-w-3xl lg:rounded-xl lg:border">
      <div className="flex flex-col gap-4 p-4">
        <div className="h-[64px] w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-[64px] w-full animate-pulse rounded-lg bg-muted"></div>
        <div className="h-[64px] w-full animate-pulse rounded-lg bg-muted"></div>
      </div>
      <div className="border-light flex items-center gap-2 border-t p-3">
        <p className="text-light px-2 text-xs font-normal uppercase">Page 1</p>
        <div className="flex-1"></div>
        <div
          className={cn(
            "focus-visible:ringRing border-light text-dark shadow-xs disabled:text-light relative inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full border bg-accent px-3.5 pl-2.5 text-xs font-medium text-accent ring-0 ring-transparent transition-all duration-200 hover:ring focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="48"
              d="M244 400L100 256l144-144M120 256h292"
            ></path>
          </svg>
          <span className="text-accent">Previous</span>
        </div>
        <div
          className={cn(
            "focus-visible:ringRing border-light text-dark shadow-xs disabled:text-light relative inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full border bg-accent px-3.5 pr-2.5 text-xs font-medium text-accent ring-0 ring-transparent transition-all duration-200 hover:ring focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <span className="text-accent">Next</span>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="48"
              d="M268 112l144 144-144 144m124-144H100"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

async function HistoryLoader({ user }: { user: ExisitingUser }) {
  const [data, err] = await getReadingHistoryAction({
    userId: user.id,
  });

  if (!data || data.length === 0) {
    return (
      <div className="relative mx-auto flex min-h-[450px] w-full max-w-none flex-col rounded-none border-0 bg-background text-card-foreground shadow-2xl backdrop-blur-lg md:shadow-xl lg:min-h-[34rem] lg:max-w-3xl lg:rounded-xl lg:border">
        <div className="flex flex-1 flex-col p-0">
          <div
            data-expanded="true"
            className="flex w-full items-center gap-3 overflow-hidden border-b p-3 text-start focus-visible:outline-none"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Balancer
                    as="h3"
                    className="text-dark p-1 text-lg font-semibold"
                  >
                    Article reading history
                  </Balancer>
                </div>
                <div className="flex items-center gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          aria-label="Manage history"
                          variant="outline"
                          disabled
                          className={cn(
                            "focus-visible:ringRing border-light text-dark shadow-xs disabled:text-light center relative inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-full border bg-background/20 p-0 text-sm font-medium ring-0 ring-transparent transition-all duration-200 hover:ring focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
                          )}
                        >
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M3 10h11v2H3v-2zm0-2h11V6H3v2zm0 8h7v-2H3v2zm15.01-3.13l.71-.71a.996.996 0 011.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71-2.12-2.12zm-.71.71l-5.3 5.3V21h2.12l5.3-5.3-2.12-2.12z"></path>
                          </svg>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <Balancer>Manage reading history</Balancer>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <svg
              width="1.5rem"
              height="1.5rem"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              color="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.5 3.75C1.5 2.50736 2.50736 1.5 3.75 1.5H13.5C14.7426 1.5 15.75 2.50736 15.75 3.75V8.26875C15.75 8.68296 15.4142 9.01875 15 9.01875C14.5858 9.01875 14.25 8.68296 14.25 8.26875V3.75C14.25 3.33579 13.9142 3 13.5 3H3.75C3.33579 3 3 3.33579 3 3.75V13.5C3 13.9142 3.33579 14.25 3.75 14.25H8.25C8.66421 14.25 9 14.5858 9 15C9 15.4142 8.66421 15.75 8.25 15.75H3.75C2.50736 15.75 1.5 14.7426 1.5 13.5V3.75Z"
                fill="currentColor"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.86566 6.75H6.375C6.16789 6.75 6 6.58211 6 6.375V5.625C6 5.41789 6.16789 5.25 6.375 5.25H10.875C11.0821 5.25 11.25 5.41789 11.25 5.625V6.375C11.25 6.58211 11.0821 6.75 10.875 6.75H9.36566V10.875C9.36566 11.0821 9.19777 11.25 8.99066 11.25H8.24066C8.03355 11.25 7.86566 11.0821 7.86566 10.875V6.75Z"
                fill="currentColor"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.3873 8.41975C18.7078 8.15731 19.1803 8.20435 19.4427 8.52482C20.8842 10.285 21.75 12.542 21.75 15C21.75 17.458 20.8842 19.715 19.4427 21.4752C19.1803 21.7957 18.7078 21.8427 18.3873 21.5803C18.0668 21.3178 18.0198 20.8453 18.2822 20.5248C19.5115 19.0237 20.25 17.1001 20.25 15C20.25 12.8999 19.5115 10.9763 18.2822 9.47519C18.0198 9.15473 18.0668 8.68219 18.3873 8.41975Z"
                fill="currentColor"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.9501 9.99454C16.2706 9.73224 16.7432 9.77949 17.0054 10.1001C18.0954 11.4322 18.75 13.1404 18.75 15C18.75 16.8596 18.0954 18.5678 17.0054 19.8999C16.7432 20.2205 16.2706 20.2678 15.9501 20.0055C15.6295 19.7432 15.5822 19.2707 15.8445 18.9501C16.7225 17.877 17.25 16.502 17.25 15C17.25 13.498 16.7225 12.123 15.8445 11.0499C15.5822 10.7294 15.6295 10.2568 15.9501 9.99454Z"
                fill="currentColor"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.4763 11.4561C13.7974 11.1944 14.2698 11.2427 14.5314 11.5638C15.293 12.4985 15.75 13.6968 15.75 15C15.75 16.3032 15.293 17.5015 14.5314 18.4362C14.2698 18.7574 13.7974 18.8056 13.4763 18.544C13.1551 18.2823 13.1069 17.8099 13.3685 17.4888C13.9189 16.8133 14.25 15.9474 14.25 15C14.25 14.0526 13.9189 13.1867 13.3685 12.5112C13.1069 12.1901 13.1551 11.7177 13.4763 11.4561Z"
                fill="currentColor"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.0412 13.029C11.3635 12.7688 11.8357 12.819 12.096 13.1413C12.5053 13.6481 12.75 14.2968 12.75 15C12.75 15.7032 12.5053 16.3519 12.096 16.8588C11.8357 17.181 11.3635 17.2312 11.0412 16.971C10.719 16.7107 10.6688 16.2385 10.929 15.9163C11.1288 15.669 11.25 15.3509 11.25 15C11.25 14.6491 11.1288 14.3311 10.929 14.0838C10.6688 13.7615 10.719 13.2893 11.0412 13.029Z"
                fill="currentColor"
              ></path>
            </svg>
            <Balancer as="h4" className="text-md text-dark font-semibold">
              Your reading history is empty
            </Balancer>
            <Link href="/">
              <Button className="relative rounded-full">
                Read some articles
                <SparkleBg />
              </Button>
            </Link>
          </div>
        </div>
        <div className="border-light flex items-center gap-2 border-t p-3">
          <Balancer className="text-light px-2 text-xs font-normal uppercase">
            Page 1
          </Balancer>
          <div className="flex-1"></div>
          <Button
            variant="outline"
            disabled
            className={cn(
              "focus-visible:ringRing border-light text-dark shadow-xs disabled:text-light relative inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-3.5 pl-2.5 text-xs font-medium ring-0 ring-transparent transition-all duration-200 hover:ring focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="48"
                d="M244 400L100 256l144-144M120 256h292"
              ></path>
            </svg>
            <span>Previous</span>
          </Button>
          <Button
            variant="outline"
            disabled
            className={cn(
              "focus-visible:ringRing border-light text-dark shadow-xs disabled:text-light relative inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full border bg-background/20 px-3.5 pr-2.5 text-xs font-medium ring-0 ring-transparent transition-all duration-200 hover:ring focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            <span>Next</span>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="48"
                d="M268 112l144 144-144 144m124-144H100"
              ></path>
            </svg>
          </Button>
        </div>
      </div>
    );
  }

  if (err) {
    notFound();
  }

  return <HistoryList historyLog={data} />;
}

export default async function HistoryWrapper({
  user,
}: {
  user: {
    email: string | null;
    id: number;
    emailVerified: Date | null;
  };
}) {
  let historyLog = null;

  // if browser is requesting html it means it's the first page load
  if (headers().get("accept")?.includes("text/html")) {
    historyLog = await getBookmarksUseCase(user.id);
  }

  return (
    <SuspenseIf condition={!historyLog} fallback={<HistorySkeleton />}>
      <HistoryLoader user={user} />
    </SuspenseIf>
  );
}
