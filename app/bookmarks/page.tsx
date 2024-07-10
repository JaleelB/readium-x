import { getUser } from "@/data-access/users";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { BookmarkWrapper } from "./bookmark-wrapper";
import Balancer from "react-wrap-balancer";
import { BookmarkButton } from "./bookmark-button";

export default async function BookmarkPage() {
  const userSession = await getCurrentUser();
  if (!userSession) {
    redirect("/signin");
  }

  const user = await getUser(userSession.id);
  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="relative container px-4 sm:px-8 flex h-[calc(100vh-60px)] bg-background py-10">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full fill-gray-400/30 stroke-gray-400/30 [mask-image:radial-gradient(700px_circle_at_center,white,transparent)] inset-x-0 inset-y-[0%] h-[90%] skew-y-12"
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
            stroke-width="0"
            opacity="0.04989013679733034"
          ></rect>
          <rect
            width="39"
            height="39"
            x="41"
            y="41"
            fill="currentColor"
            stroke-width="0"
            opacity="0.06194469735200983"
          ></rect>
          <rect
            width="39"
            height="39"
            x="241"
            y="241"
            fill="currentColor"
            stroke-width="0"
            opacity="0.07250919713696931"
          ></rect>
          <rect
            width="39"
            height="39"
            x="1"
            y="481"
            fill="currentColor"
            stroke-width="0"
            opacity="0.08180376562231687"
          ></rect>
          <rect
            width="39"
            height="39"
            x="81"
            y="201"
            fill="currentColor"
            stroke-width="0"
            opacity="0.08969824802770746"
          ></rect>
          <rect
            width="39"
            height="39"
            x="241"
            y="321"
            fill="currentColor"
            stroke-width="0"
            opacity="0.09539389073324855"
          ></rect>
          <rect
            width="39"
            height="39"
            x="121"
            y="121"
            fill="currentColor"
            stroke-width="0"
            opacity="0.0990972326049814"
          ></rect>
          <rect
            width="39"
            height="39"
            x="241"
            y="41"
            fill="currentColor"
            stroke-width="0"
            opacity="0.09984111571393442"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="1"
            fill="currentColor"
            stroke-width="0"
            opacity="0.09680011153395754"
          ></rect>
          <rect
            width="39"
            height="39"
            x="281"
            y="881"
            fill="currentColor"
            stroke-width="0"
            opacity="0.09140917787735817"
          ></rect>
          <rect
            width="39"
            height="39"
            x="241"
            y="161"
            fill="currentColor"
            stroke-width="0"
            opacity="0.08423744774481748"
          ></rect>
          <rect
            width="39"
            height="39"
            x="121"
            y="521"
            fill="currentColor"
            stroke-width="0"
            opacity="0.07524879169941415"
          ></rect>
          <rect
            width="39"
            height="39"
            x="281"
            y="801"
            fill="currentColor"
            stroke-width="0"
            opacity="0.06520031216496136"
          ></rect>
          <rect
            width="39"
            height="39"
            x="281"
            y="561"
            fill="currentColor"
            stroke-width="0"
            opacity="0.05362266433949117"
          ></rect>
          <rect
            width="39"
            height="39"
            x="281"
            y="881"
            fill="currentColor"
            stroke-width="0"
            opacity="0.03955854726664257"
          ></rect>
          <rect
            width="39"
            height="39"
            x="1"
            y="561"
            fill="currentColor"
            stroke-width="0"
            opacity="0.025525362344342287"
          ></rect>
          <rect
            width="39"
            height="39"
            x="81"
            y="41"
            fill="currentColor"
            stroke-width="0"
            opacity="0.01030175197229255"
          ></rect>
          <rect
            width="39"
            height="39"
            x="41"
            y="201"
            fill="currentColor"
            stroke-width="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="121"
            y="201"
            fill="currentColor"
            stroke-width="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="281"
            y="561"
            fill="currentColor"
            stroke-width="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="201"
            y="481"
            fill="currentColor"
            stroke-width="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="841"
            fill="currentColor"
            stroke-width="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="161"
            fill="currentColor"
            stroke-width="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="241"
            y="641"
            fill="currentColor"
            stroke-width="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="121"
            fill="currentColor"
            stroke-width="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="241"
            fill="currentColor"
            stroke-width="0"
            opacity="0"
          ></rect>
          <rect
            width="39"
            height="39"
            x="81"
            y="321"
            fill="currentColor"
            stroke-width="0"
            opacity="0.009072852387907915"
          ></rect>
          <rect
            width="39"
            height="39"
            x="161"
            y="601"
            fill="currentColor"
            stroke-width="0"
            opacity="0.02093282386485953"
          ></rect>
          <rect
            width="39"
            height="39"
            x="321"
            y="121"
            fill="currentColor"
            stroke-width="0"
            opacity="0.0303765981370816"
          ></rect>
          <rect
            width="39"
            height="39"
            x="1"
            y="721"
            fill="currentColor"
            stroke-width="0"
            opacity="0.03941497987543699"
          ></rect>
        </svg>
      </svg>
      <div className="flex-1 flex flex-col gap-12">
        <div className="flex flex-col gap-1">
          <Balancer as="h1" className="text-3xl font-bold font-heading">
            Bookmarks
          </Balancer>
          <Balancer className="text-muted-foreground">
            Manage your bookmarked articles
          </Balancer>
        </div>
        <BookmarkWrapper user={user} />
      </div>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ">
        <BookmarkButton />
      </div>
    </div>
  );
}
