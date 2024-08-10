"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import NavLink from "@/components/settings-nav-link";

export interface Tab {
  name: string;
  segment: string | null;
}

interface SettingsLayoutProps {
  tabs: Tab[];
  children: ReactNode;
}

export default function SettingsLayout({
  tabs,
  children,
}: SettingsLayoutProps) {
  return (
    <div className="z-[100] mx-auto flex h-full w-full max-w-screen-2xl flex-1 flex-col gap-6 lg:px-20">
      <nav className={cn("py-4")}>
        <ul className="scrollbar-hide flex space-x-6 overflow-x-auto text-sm">
          {tabs.map((tab) => (
            <li key={tab.segment}>
              <NavLink key={tab.segment} segment={tab.segment}>
                {tab.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="grid gap-5 lg:col-span-4">{children}</div>
    </div>
  );
}
