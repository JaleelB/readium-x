export const applicationName = "ReadiumX";

export const afterLoginUrl = "/";

export const siteConfig = {
  name: `${applicationName} - Read and Manage Premium Medium Articles for Free`,
  short_name: applicationName,
  description:
    "An open source tool that provides access to premium Medium articles without the paywall, allowing you to bookmark, and manage your reading experience across any device.",
  url: "https://readiumx.com",
  ogImage: "https://readiumx.com/web-shot.png",
  links: {
    twitter: "https://twitter.com/jal_eelll",
    github: "https://github.com/JaleelB/readium-x",
  },
  creator: {
    name: "Jaleel Bennett",
    twitter: "https://twitter.com/jal_eelll",
    twitterId: "@jal_eelll",
    github: "https://github.com/JaleelB",
    website: "https://jaleelbennett.com",
    mail: "jaleelcodes@gmail.com",
  },
};

export type SiteConfig = typeof siteConfig;
