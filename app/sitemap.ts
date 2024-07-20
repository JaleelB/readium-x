import { type MetadataRoute } from "next";
import { siteConfig } from "@/app-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/bookmarks`,
      lastModified: new Date(),
    },
    {
      url: `${siteConfig.url}/history`,
      lastModified: new Date(),
    },
  ];
}
