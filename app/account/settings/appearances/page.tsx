"use client";

import { Icons } from "@/components/icons";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { env } from "@/env";
import { useTheme } from "next-themes";
import Balancer from "react-wrap-balancer";
import { useEffect, useState } from "react";

const themes = [
  {
    name: "Light theme",
    value: "light",
    description:
      "This theme will be active when your system is set to “light mode”",
    icon: "sun",
  },
  {
    name: "Dark theme",
    value: "dark",
    description:
      "This theme will be active when your system is set to “dark mode”",
    icon: "moon",
  },
  {
    name: "System theme",
    value: "system",
    description: "This theme will be set to your system's theme",
    icon: "system",
  },
];

export default function AppearancesPage() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme: currentTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // prevent hydration error/mismatch
  if (!mounted) return <ThemeSkeleton />;

  const isActiveTheme = themes.find((theme) => theme.value === currentTheme);

  return (
    <div className="z-20 h-full w-full flex-1 pb-8">
      <main className="flex-1 space-y-12">
        <div className="flex flex-col space-y-2">
          <Balancer as="h1" className="font-heading text-3xl font-bold">
            Theme preferences
          </Balancer>
          <Balancer as="p" className="text-muted-foreground">
            Choose how {env.NEXT_PUBLIC_APP_NAME} looks to you. Select a single
            theme, or sync with your system and automatically switch between day
            and night themes. Selections are applied immediately and saved
            automatically.
          </Balancer>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {themes.map((theme) => {
            const Icon = Icons[theme.icon as keyof typeof Icons];

            return (
              <Card
                key={theme.value}
                onClick={() => setTheme(theme.value)}
                className={`cursor-pointer border-[1.5px] transition-colors ${
                  isActiveTheme?.value === theme.value
                    ? "border-primary"
                    : "border-input"
                }`}
              >
                <div
                  className={`flex flex-row items-center justify-between gap-2 rounded-t-lg border-b ${isActiveTheme?.value === theme.value ? "border-primary bg-primary/10" : "border-input bg-accent/70"} p-4`}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Icon className="stroke-3 h-4 w-4" />
                    <Balancer as="h3" className="mt-0 text-sm font-semibold">
                      {theme.name}
                    </Balancer>
                  </div>
                  {isActiveTheme?.value === theme.value && (
                    <span
                      title="Active Mode"
                      data-target="appearance-preview.activeLabel"
                      data-view-component="true"
                      className="rounded-full border border-primary px-2 py-1 text-xs font-medium text-primary"
                    >
                      Active
                    </span>
                  )}
                </div>
                <CardContent className="relative space-y-4 pt-6">
                  <CardDescription>{theme.description}</CardDescription>
                  <div className="relative h-40 w-full xl:h-60">
                    <Image
                      src={`/${theme.value}-mode.png`}
                      alt={theme.name}
                      fill
                      loading="lazy"
                      style={{
                        background: `linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0)) content-box exclude, linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0))`,
                      }}
                      className="rounded-md border object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function ThemeSkeleton() {
  return (
    <div className="z-20 h-full w-full flex-1 pb-8">
      <main className="flex-1 space-y-12">
        <div className="flex flex-col space-y-2">
          <Balancer as="h1" className="font-heading text-3xl font-bold">
            Theme preferences
          </Balancer>
          <Balancer as="p" className="text-muted-foreground">
            Choose how {env.NEXT_PUBLIC_APP_NAME} looks to you. Select a single
            theme, or sync with your system and automatically switch between day
            and night themes. Selections are applied immediately and saved
            automatically.
          </Balancer>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {themes.map((theme) => {
            const Icon = Icons[theme.icon as keyof typeof Icons];

            return (
              <Card key={theme.value} className="animate-pulse bg-muted">
                <div className={`flex flex-row items-center gap-2 bg-muted`}>
                  <Icon className="stroke-3 h-4 w-4 text-muted" />
                  <Balancer
                    as="h3"
                    className="mt-0 text-sm font-semibold text-muted"
                  >
                    {theme.name}
                  </Balancer>
                </div>
                <CardContent className="relative space-y-4 pt-6">
                  <CardDescription className="text-muted">
                    {theme.description}
                  </CardDescription>
                  <div className="relative h-40 w-full xl:h-60">
                    <div className="h-full w-full bg-muted" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
