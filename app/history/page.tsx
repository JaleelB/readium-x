import { getUser } from "@/data-access/users";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
// import Balancer from "react-wrap-balancer";
// import { Button } from "@/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { cn } from "@/lib/utils";
import HistoryWrapper from "./history-wrapper";

export default async function HistoryPage() {
  const userSession = await getCurrentUser();
  if (!userSession) {
    redirect("/signin");
  }

  const user = await getUser(userSession.id);
  if (!user) {
    redirect("/signin");
  }

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
            <path d="M.5 40V.5H40" fill="none" strokeDasharray="0"></path>
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
      {/* <div className="text-card-foreground flex flex-col border-0 lg:border relative w-full max-w-none min-h-[450px] lg:min-h-[34rem] lg:max-w-3xl rounded-none lg:rounded-xl mx-auto bg-background md:shadow-xl backdrop-blur-lg shadow-2xl">
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
          </div> */}
      <HistoryWrapper user={user} />
      {/* </div> */}
      {/* </div> */}
    </div>
  );
}
