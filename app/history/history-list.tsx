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
    <div className="text-card-foreground flex flex-col border-0 lg:border relative w-full max-w-none min-h-[450px] lg:min-h-[34rem] lg:max-w-3xl rounded-none lg:rounded-xl mx-auto bg-background md:shadow-xl backdrop-blur-lg shadow-2xl">
      {deleteAllLogsError && (
        <Alert
          variant="destructive"
          className="fixed top-0 right-0 sm:top-4 sm:right-8 w-full sm:w-fit"
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
          className="fixed top-0 right-0 sm:top-4 sm:right-8 w-full sm:w-fit"
        >
          <Terminal className="h-4 w-4" />
          <AlertTitle>
            Uhoh, we couldn&apos;t delete the selected reading history
          </AlertTitle>
          <AlertDescription>{deleteByIdError.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex-1 flex flex-col p-0">
        <div
          data-expanded="true"
          className="flex items-center gap-3 p-3 border-b text-start w-full overflow-hidden focus-visible:outline-none"
        >
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                {isManaging && <Checkbox onClick={selectAll} />}
                <Balancer
                  as="h3"
                  className="text-lg text-dark font-semibold p-1"
                >
                  Article reading history
                </Balancer>
              </div>
              <div className="flex gap-3 items-center">
                {isManaging && (
                  <LoaderButton
                    className="rounded-full relative"
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
                          "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 ring-0 ring-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ringRing disabled:pointer-events-none disabled:opacity-50 bg-background/20 border border-light text-dark shadow-xs disabled:text-light hover:ring center p-0 h-9 w-9 rounded-full"
                        )}
                      >
                        {!isManaging ? (
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            className="w-4 h-4"
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
                            className="w-4 h-4"
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
        <ul className="flex-1 w-full h-full overflow-y-auto">
          {currentRecords.map((historyLog) => (
            <li
              key={historyLog.id}
              className="aria-selected:bg-gray-alpha-100 transition-colors duration-150 focus:outline-none cursor-pointer flex items-center py-2 px-3 gap-4"
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
        <div className="flex items-center p-3 gap-2 border-t border-light">
          <Balancer className="text-xs text-light font-normal px-2 uppercase">
            Page {currentPage}
          </Balancer>
          <div className="flex-1"></div>
          <Button
            variant="outline"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={cn(
              "relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ring-0 ring-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ringRing disabled:pointer-events-none disabled:opacity-50 border border-light text-dark shadow-xs disabled:text-light h-8 px-3.5 rounded-full text-xs hover:ring gap-1 pl-2.5"
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
              "relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ring-0 ring-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ringRing disabled:pointer-events-none disabled:opacity-50 bg-background/20 border border-light text-dark shadow-xs disabled:text-light h-8 px-3.5 rounded-full text-xs hover:ring gap-1 pr-2.5"
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
