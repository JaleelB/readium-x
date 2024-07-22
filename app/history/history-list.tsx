"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  deleteAllReadingHistoryAction,
  deleteReadingHistoryByIdAction,
} from "./history";
import { useToast } from "@/components/ui/use-toast";
import { useServerAction } from "zsa-react";
import { LoaderButton } from "@/components/loader-button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { SparkleBg } from "@/components/sparkle-bg";

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
  const { toast } = useToast();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(8);

  const lastRecordIndex = currentPage * recordsPerPage;
  const firstRecordIndex = lastRecordIndex - recordsPerPage;
  const currentRecords = historyLog.slice(firstRecordIndex, lastRecordIndex);

  const totalPages = Math.ceil(historyLog.length / recordsPerPage);

  const goToNextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  // Manage reading history
  const [isManaging, setIsManaging] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set<number>());

  const {
    execute: deleteByIdExecute,
    isPending: isDeleteBYIdPending,
    error: deleteByIdError,
    reset: deleteByIdReset,
  } = useServerAction(deleteReadingHistoryByIdAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess() {
      toast({
        description: "Successfully deleted reading history log",
      });
    },
  });

  const {
    execute: deleteAllLogsExecute,
    isPending: isDeleteAllLogsPending,
    error: deleteAllLogsError,
    reset: deleteAllLogsReset,
  } = useServerAction(deleteAllReadingHistoryAction, {
    onError({ err }) {
      toast({
        description: err.message,
        variant: "destructive",
      });
    },
    onSuccess() {
      toast({
        description: "Successfully deleted reading history logs",
      });
    },
  });

  const toggleManaging = () => setIsManaging(!isManaging);
  const toggleSelection = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };
  const selectAll = () => {
    if (selectedIds.size === historyLog.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(historyLog.map((item) => item.id)));
    }
  };
  const deleteSelected = async () => {
    if (selectedIds.size === historyLog.length) {
      deleteAllLogsExecute({
        userId: historyLog[0].userId,
      });
    } else {
      // Delete selected
      for (const id of selectedIds) {
        deleteByIdExecute({
          userId: historyLog[0].userId,
          readingHistoryId: id,
        });
      }
    }
  };

  return (
    <div className="relative mx-auto flex min-h-[450px] w-full max-w-none flex-col rounded-none border-0 bg-background text-card-foreground shadow-2xl backdrop-blur-lg md:shadow-xl lg:min-h-[34rem] lg:max-w-3xl lg:rounded-xl lg:border">
      {deleteAllLogsError && (
        <Alert
          variant="destructive"
          className="fixed right-0 top-0 w-full sm:right-8 sm:top-4 sm:w-fit"
        >
          <Terminal className="h-4 w-4" />
          <AlertTitle>
            Uhoh, we couldn&apos;t delete all your reading history
          </AlertTitle>
          <AlertDescription>{deleteAllLogsError.message}</AlertDescription>
        </Alert>
      )}
      {deleteByIdError && (
        <Alert
          variant="destructive"
          className="fixed right-0 top-0 w-full sm:right-8 sm:top-4 sm:w-fit"
        >
          <Terminal className="h-4 w-4" />
          <AlertTitle>
            Uhoh, we couldn&apos;t delete the selected reading history
          </AlertTitle>
          <AlertDescription>{deleteByIdError.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-1 flex-col p-0">
        <div
          data-expanded="true"
          className="flex w-full items-center gap-3 overflow-hidden border-b p-3 text-start focus-visible:outline-none"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isManaging && <Checkbox onClick={selectAll} />}
                <Balancer
                  as="h3"
                  className="text-dark p-1 text-lg font-semibold"
                >
                  Article reading history
                </Balancer>
              </div>
              <div className="flex items-center gap-3">
                {isManaging && (
                  <LoaderButton
                    className="relative rounded-full"
                    size="sm"
                    isLoading={isDeleteBYIdPending || isDeleteAllLogsPending}
                    onClick={deleteSelected}
                    disabled={selectedIds.size === 0}
                  >
                    Delete ({selectedIds.size})
                    <SparkleBg />
                  </LoaderButton>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        aria-label="Manage history"
                        variant="outline"
                        onClick={() => {
                          toggleManaging();
                          setSelectedIds(new Set());
                        }}
                        className={cn(
                          "focus-visible:ringRing border-light text-dark shadow-xs disabled:text-light center relative inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-full border bg-background/20 p-0 text-sm font-medium ring-0 ring-transparent transition-all duration-200 hover:ring focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
                        )}
                      >
                        {!isManaging ? (
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
                        ) : (
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
                            <path d="M14 10H3v2h11v-2zm0-4H3v2h11V6zM3 16h7v-2H3v2zm11.41 6L17 19.41 19.59 22 21 20.59 18.41 18 21 15.41 19.59 14 17 16.59 14.41 14 13 15.41 15.59 18 13 20.59 14.41 22z"></path>
                          </svg>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!isManaging ? (
                        <Balancer>Manage reading history</Balancer>
                      ) : (
                        <Balancer>Stop managing</Balancer>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
        <ul className="h-full w-full flex-1 overflow-y-auto">
          {currentRecords.map((historyLog) => (
            <li
              key={historyLog.id}
              className="aria-selected:bg-gray-alpha-100 flex cursor-pointer items-center gap-4 px-3 py-2 transition-colors duration-150 focus:outline-none"
              role="option"
              aria-disabled="false"
              aria-selected="false"
              data-disabled="false"
              data-selected="false"
            >
              {isManaging && (
                <div onClick={() => toggleSelection(historyLog.id)}>
                  <Checkbox
                    checked={selectedIds.has(historyLog.id)}
                    onChange={() => toggleSelection(historyLog.id)}
                    className="mr-2"
                  />
                </div>
              )}
              <div className="center bg-gray-alpha-100 h-10 w-10 rounded-lg">
                <Avatar className="h-11 w-11 rounded-md">
                  <AvatarImage
                    src={
                      historyLog.authorImageURL ||
                      "https://illustrations.popsy.co/white/genius.svg"
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="group relative mr-8 h-fit w-fit">
                  <div className="relative line-clamp-1 w-fit">
                    <Balancer className="text-dark break-all text-sm font-medium">
                      {historyLog.articleTitle}
                    </Balancer>
                  </div>
                  <div className="invisible absolute right-0 top-1/2 -translate-y-1/2 translate-x-full items-center p-1 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
                    <Button
                      variant="outline"
                      aria-label="Copy text"
                      size="icon"
                      className={cn(
                        "focus-visible:ringRing border-light text-dark shadow-xs disabled:text-light text-2xs center relative inline-flex h-5 w-5 items-center justify-center whitespace-nowrap rounded-md border bg-background/20 p-0 font-medium ring-0 ring-transparent transition-all duration-200 hover:ring-2 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
                      )}
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        className="h-2.5 w-2.5"
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
                  className="line-clamp-1 items-center text-xs font-normal text-muted-foreground"
                >
                  {historyLog.authorName} • <span>{historyLog.readTime}</span>
                </Balancer>
              </div>
              <div className="flex w-fit items-center gap-2">
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
                      "focus-visible:ringRing border-light text-dark shadow-xs disabled:text-light center relative inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-full border bg-background p-0 text-lg font-medium ring-0 ring-transparent transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:ring focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
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
                        className="lucide lucide-link-2 h-[18px] w-[18px]"
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
        <div className="border-light flex items-center gap-2 border-t p-3">
          <Balancer className="text-light px-2 text-xs font-normal uppercase">
            Page {currentPage}
          </Balancer>
          <div className="flex-1"></div>
          <Button
            variant="outline"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
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
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
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
    </div>
  );
}
