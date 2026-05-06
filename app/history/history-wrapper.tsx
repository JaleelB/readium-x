import { HistoryList } from "./history-list";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SparkleBg } from "@/components/sparkle-bg";
import { User } from "@/server/db/schema";
import { getReadingHistoryUseCase } from "@/use-cases/article";

function EmptyHistory() {
  return (
    <div className="relative mx-auto flex min-h-[450px] w-full max-w-none flex-col rounded-none border-0 bg-background text-card-foreground shadow-2xl backdrop-blur-lg md:shadow-xl lg:min-h-[34rem] lg:max-w-3xl lg:rounded-xl lg:border">
      <div className="flex flex-1 flex-col p-0">
        <div
          data-expanded="true"
          className="flex w-full items-center gap-3 overflow-hidden border-b p-3 text-start focus-visible:outline-none"
        >
          <div className="flex-1">
            <Balancer as="h3" className="text-dark p-1 text-lg font-semibold">
              Article reading history
            </Balancer>
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
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.3873 8.41975C18.7078 8.15731 19.1803 8.20435 19.4427 8.52482C20.8842 10.285 21.75 12.542 21.75 15C21.75 17.458 20.8842 19.715 19.4427 21.4752C19.1803 21.7957 18.7078 21.8427 18.3873 21.5803C18.0668 21.3178 18.0198 20.8453 18.2822 20.5248C19.5115 19.0237 20.25 17.1001 20.25 15C20.25 12.8999 19.5115 10.9763 18.2822 9.47519C18.0198 9.15473 18.0668 8.68219 18.3873 8.41975Z"
              fill="currentColor"
            />
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
        <div className="flex-1" />
        <Button
          variant="outline"
          disabled
          className={cn(
            "focus-visible:ringRing border-light text-dark shadow-xs disabled:text-light relative inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-3.5 pl-2.5 text-xs font-medium ring-0 ring-transparent transition-all duration-200 hover:ring focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled
          className={cn(
            "focus-visible:ringRing border-light text-dark shadow-xs disabled:text-light relative inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-full border bg-background/20 px-3.5 pr-2.5 text-xs font-medium ring-0 ring-transparent transition-all duration-200 hover:ring focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default async function HistoryWrapper({ user }: { user: User }) {
  const historyLog = await getReadingHistoryUseCase(user.id);

  if (historyLog.length === 0) {
    return <EmptyHistory />;
  }

  return <HistoryList historyLog={historyLog} />;
}
