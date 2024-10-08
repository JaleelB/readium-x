import UrlForm from "@/components/url-form";
import { getCurrentUser } from "@/lib/session";
import { Balancer } from "react-wrap-balancer";

export default async function Home() {
  let userSession = await getCurrentUser();
  let user = true;

  if (!userSession) {
    user = false;
  }

  return (
    <section className="relative mb-4 flex w-full flex-col items-center justify-center gap-7 px-4 py-[22vh] pt-[18vh] sm:pt-[20vh] md:px-8">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 inset-x-0 inset-y-[0%] h-[calc(100vh-64px)] w-full skew-y-[300] fill-gray-400/30 stroke-gray-400/30 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
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
      <div className="hidden sm:flex">
        <Balancer
          as="h1"
          className="px-6 text-center font-sans text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl lg:font-heading lg:text-6xl lg:tracking-normal"
        >
          <p className="relative inline-block">
            <span className="z-0 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text pb-1 text-transparent dark:from-white dark:to-white">
              Read and Manage
            </span>
          </p>{" "}
          {""}
          Premium <br /> Medium Articles for {""}
          <span className="z-0 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text pb-1 text-transparent dark:from-white dark:to-white">
            Free
          </span>
        </Balancer>
      </div>
      <div className="sm:hidden">
        <Balancer
          as="h1"
          className="px-6 text-center font-sans text-4xl font-bold tracking-tight drop-shadow-sm sm:hidden sm:text-5xl lg:font-heading lg:text-6xl lg:tracking-normal"
        >
          Read and Manage Premium Medium Articles for Free
        </Balancer>{" "}
      </div>
      <Balancer className="max-w-[40rem] px-6 text-center leading-normal text-muted-foreground sm:leading-8">
        An open source tool for accessing premium Medium articles, bypassing
        paywalls, and managing your reading across devices.
      </Balancer>

      <UrlForm isUser={user} />
    </section>
  );
}
