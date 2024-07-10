import { getUser } from "@/data-access/users";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getReadingHistoryAction } from "./history";
import Link from "next/link";
import { SparkleBg } from "@/components/sparkle-bg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";

export default async function HistoryPage() {
  const userSession = await getCurrentUser();
  if (!userSession) {
    redirect("/signin");
  }

  const user = await getUser(userSession.id);
  if (!user) {
    redirect("/signin");
  }

  const [data, err] = await getReadingHistoryAction({
    userId: user.id,
  });

  return (
    <div className="container relative flex justify-center items-center px-4 sm:px-8 h-[calc(100vh-60px)]">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full fill-gray-400/30 stroke-gray-400/30 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)] inset-x-0 inset-y-[0%] h-[90%] skew-y-[300]"
      >
        <defs>
          <pattern
            id=":rt2:"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            x="-1"
            y="-1"
          >
            <path d="M.5 40V.5H40" fill="none" stroke-dasharray="0"></path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#:rt2:)"></rect>
        <svg x="-1" y="-1" className="overflow-visible">
          <rect
            width="39"
            height="39"
            x="241"
            y="1"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.04989013679733034"
          ></rect>
          <rect
            width="39"
            height="39"
            x="41"
            y="41"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.06194469735200983"
          ></rect>
          <rect
            width="39"
            height="39"
            x="241"
            y="241"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.07250919713696931"
          ></rect>
          <rect
            width="39"
            height="39"
            x="1"
            y="481"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.08180376562231687"
          ></rect>
          <rect
            width="39"
            height="39"
            x="81"
            y="201"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.08969824802770746"
          ></rect>
          <rect
            width="39"
            height="39"
            x="241"
            y="321"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.09539389073324855"
          ></rect>
          <rect
            width="39"
            height="39"
            x="121"
            y="121"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.0990972326049814"
          ></rect>
          <rect
            width="39"
            height="39"
            x="241"
            y="41"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.09984111571393442"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="1"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.09680011153395754"
          ></rect>
          <rect
            width="39"
            height="39"
            x="281"
            y="881"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.09140917787735817"
          ></rect>
          <rect
            width="39"
            height="39"
            x="241"
            y="161"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.08423744774481748"
          ></rect>
          <rect
            width="39"
            height="39"
            x="121"
            y="521"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.07524879169941415"
          ></rect>
          <rect
            width="39"
            height="39"
            x="281"
            y="801"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.06520031216496136"
          ></rect>
          <rect
            width="39"
            height="39"
            x="281"
            y="561"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.05362266433949117"
          ></rect>
          <rect
            width="39"
            height="39"
            x="281"
            y="881"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.03955854726664257"
          ></rect>
          <rect
            width="39"
            height="39"
            x="1"
            y="561"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.025525362344342287"
          ></rect>
          <rect
            width="39"
            height="39"
            x="81"
            y="41"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.01030175197229255"
          ></rect>
          <rect
            width="39"
            height="39"
            x="41"
            y="201"
            fill="currentColor"
            strokeWidth="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="121"
            y="201"
            fill="currentColor"
            strokeWidth="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="281"
            y="561"
            fill="currentColor"
            strokeWidth="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="201"
            y="481"
            fill="currentColor"
            strokeWidth="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="841"
            fill="currentColor"
            strokeWidth="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="161"
            fill="currentColor"
            strokeWidth="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="241"
            y="641"
            fill="currentColor"
            strokeWidth="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="121"
            fill="currentColor"
            strokeWidth="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="241"
            fill="currentColor"
            strokeWidth="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="81"
            y="321"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.009072852387907915"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="601"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.02093282386485953"
          ></rect>
          <rect
            width="39"
            height="39"
            x="321"
            y="121"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.0303765981370816"
          ></rect>
          <rect
            width="39"
            height="39"
            x="1"
            y="721"
            fill="currentColor"
            strokeWidth="0"
            opacity="0.03941497987543699"
          ></rect>
        </svg>
      </svg>
      <div className="text-card-foreground flex flex-col border-0 lg:border relative w-full max-w-none min-h-[90%] lg:min-h-[34rem] lg:max-w-3xl rounded-none lg:rounded-xl mx-auto bg-background md:shadow-xl backdrop-blur-lg shadow-2xl">
        <div className="flex-1 flex flex-col p-0">
          <div
            data-expanded="true"
            className="flex items-center gap-3 p-3 border-b text-start w-full overflow-hidden focus-visible:outline-none"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <Balancer
                  as="h3"
                  className="text-lg text-dark font-semibold p-1"
                >
                  Article reading history
                </Balancer>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          aria-label="Manage history"
                          variant="outline"
                          className={cn(
                            "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 ring-0 ring-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ringRing disabled:pointer-events-none disabled:opacity-50 bg-background/20 border border-light text-dark shadow-xs disabled:text-light hover:ring center p-0 h-9 w-9 rounded-full"
                          )}
                        >
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
          {data ? (
            <ul className="flex-1 w-full h-full overflow-y-auto">
              {data.map((historyLog) => (
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
                      {historyLog.authorName} •{" "}
                      <span>{historyLog.readTime}</span>
                    </Balancer>
                  </div>
                  <div className="flex gap-2 items-center w-fit">
                    <Link
                      href={historyLog.articleUrl}
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
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-4 items-center">
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
                <Button className="relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 ring-0 ring-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ringRing disabled:pointer-events-none disabled:opacity-50 bg-true-black text-white shadow-xs hover:ring-gray-alpha-200 active:ring-gray-alpha-300 disabled:text-true-white/60 h-9 px-4 py-2 rounded-full hover:ring">
                  Read some articles
                  <SparkleBg />
                </Button>
              </Link>
            </div>
          )}
          <div className="flex items-center p-3 gap-2 border-t border-light">
            <p className="text-xs text-light font-normal px-2 uppercase">
              Page 1
            </p>
            <div className="flex-1"></div>
            <Button
              variant="outline"
              className={cn(
                "relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ring-0 ring-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ringRing disabled:pointer-events-none disabled:opacity-50 border border-light text-dark shadow-xs disabled:text-light h-8 px-3.5 rounded-full text-xs hover:ring gap-1 pl-2.5"
              )}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="48"
                  d="M244 400L100 256l144-144M120 256h292"
                ></path>
              </svg>
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 ring-0 ring-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ringRing disabled:pointer-events-none disabled:opacity-50 bg-background/20 border border-light text-dark shadow-xs disabled:text-light h-8 px-3.5 rounded-full text-xs hover:ring gap-1 pr-2.5"
              )}
            >
              <span>Next</span>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="48"
                  d="M268 112l144 144-144 144m124-144H100"
                ></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
