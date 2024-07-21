import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { fontHeading, fontMono, fontSans } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/app-config";
import Script from "next/script";

export const metadata = {
  title: {
    default: siteConfig.name,
    template: "%s | " + siteConfig.name,
  },
  description: siteConfig.description,
  keywords: [
    "ReadiumX",
    "readium-x",
    "free medium articles",
    "Medium content organizer",
    "open-source medium article reading app",
    "Medium article manager",
    "bookmark Medium posts",
    "read premium articles for free",
    "medium article reading progress tracker",
  ],
  authors: [
    {
      name: "jaleelb",
      url: "https://jaleelbennett.com",
    },
  ],
  creator: "jaleelb",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/web-shot.png`,
        width: 1200,
        height: 715,
        alt: "Callsquare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/web-shot.png`],
    creator: "@jal_eelll",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen flex flex-col bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Script
          async
          src={process.env.UMAMI_URL}
          data-website-id={process.env.UMAMI_DATA_WEBSITE_ID}
        />
      </body>
    </html>
  );
}
