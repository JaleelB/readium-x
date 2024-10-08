import SiteHeader from "@/components/site-header";
import { ReactNode } from "react";
import SettingsLayout, { Tab } from "./setting-layout";

export default function PersonalSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tabs: Tab[] = [
    {
      name: "General",
      segment: "",
    },
    {
      name: "Appearance",
      segment: "appearances",
    },
    {
      name: "API Keys",
      segment: "tokens",
    },
    // {
    //   name: "Keyboard Shortcuts",
    //   segment: "keyboard-shortcuts",
    // },
    {
      name: "Text to Speech",
      segment: "text-to-speech",
    },
  ];

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="relative flex flex-1 px-4 py-8 sm:px-8">
          <SettingsLayout tabs={tabs}>{children}</SettingsLayout>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 inset-x-0 inset-y-[0%] h-[80%] w-full skew-y-[20deg] fill-gray-400/30 stroke-gray-400/30 [mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
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
        </div>
      </div>
    </>
  );
}
