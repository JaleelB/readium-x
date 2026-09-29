/**
 * Request classification for the Cloudflare entry worker.
 *
 * These checks stay dependency-free so `/robots.txt`, `/sitemap.xml`, and
 * scanner probes can be answered before the OpenNext/Next/Clerk bundle loads.
 * User-Agent is intentionally ignored: Googlebot and other crawlers must still
 * receive public content.
 */

export const PUBLIC_HTML_CACHE_SECONDS = 60 * 60;

const PROBE_EXTENSIONS = [
  ".php",
  ".php3",
  ".php4",
  ".php5",
  ".phtml",
  ".asp",
  ".aspx",
  ".jsp",
  ".cgi",
  ".pl",
  ".bak",
  ".sql",
  ".ini",
];

const PROBE_SEGMENTS = new Set([
  ".aws",
  ".git",
  ".hg",
  ".svn",
  "administrator",
  "boaform",
  "cgi-bin",
  "phpmyadmin",
  "phpunit",
  "pma",
  "wp-admin",
  "wp-content",
  "wp-includes",
  "wp-login",
  "xmlrpc",
]);

const STATIC_EXTENSIONS = [
  ".avif",
  ".bmp",
  ".css",
  ".csv",
  ".doc",
  ".docx",
  ".eot",
  ".gif",
  ".htm",
  ".html",
  ".ico",
  ".jpeg",
  ".jpg",
  ".js",
  ".map",
  ".mjs",
  ".otf",
  ".pdf",
  ".png",
  ".svg",
  ".ttf",
  ".txt",
  ".wasm",
  ".webmanifest",
  ".webp",
  ".woff",
  ".woff2",
  ".xls",
  ".xlsx",
  ".xml",
  ".zip",
];

export const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://readiumx.com/sitemap.xml
`;

export const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://readiumx.com/</loc>
  </url>
</urlset>
`;

export const WEB_MANIFEST = `{
  "name": "ReadiumX - Read and Manage Premium Medium Articles for Free",
  "short_name": "ReadiumX",
  "description": "An open source tool that provides access to premium Medium articles without the paywall, allowing you to bookmark, and manage your reading experience across any device.",
  "start_url": "/",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
`;

const METADATA_BODIES: Record<string, { body: string; contentType: string }> = {
  "/robots.txt": { body: ROBOTS_TXT, contentType: "text/plain; charset=utf-8" },
  "/sitemap.xml": {
    body: SITEMAP_XML,
    contentType: "application/xml; charset=utf-8",
  },
  "/manifest.webmanifest": {
    body: WEB_MANIFEST,
    contentType: "application/manifest+json; charset=utf-8",
  },
  "/site.webmanifest": {
    body: WEB_MANIFEST,
    contentType: "application/manifest+json; charset=utf-8",
  },
};

export interface MetadataResponse {
  body: string;
  contentType: string;
}

export type RouteClass =
  | { type: "metadata"; body: string; contentType: string }
  | { type: "probe" }
  | { type: "static-asset" }
  | { type: "app" };

export function normalizePath(pathname: string): string {
  let path = pathname;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    path = pathname;
  }

  path = path.toLowerCase();
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}

export function isScannerProbe(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (PROBE_EXTENSIONS.some((extension) => path.endsWith(extension))) {
    return true;
  }
  if (
    path === "/.env" ||
    path.startsWith("/.env.") ||
    path.includes("/.env/")
  ) {
    return true;
  }

  return path.split("/").some((segment) => PROBE_SEGMENTS.has(segment));
}

export function isStaticAssetPath(pathname: string): boolean {
  const path = normalizePath(pathname);
  if (path.startsWith("/_next/")) return false;
  return STATIC_EXTENSIONS.some((extension) => path.endsWith(extension));
}

export function classifyPath(pathname: string): RouteClass {
  const path = normalizePath(pathname);
  if (isScannerProbe(path)) return { type: "probe" };

  const metadata = METADATA_BODIES[path];
  if (metadata) return { type: "metadata", ...metadata };

  if (isStaticAssetPath(path)) return { type: "static-asset" };
  return { type: "app" };
}

export function requestHasSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return /(?:^|;\s*)(?:__session|__client_uat)=/.test(cookieHeader);
}

/**
 * True for anonymous document GETs of `/`, including a leftover
 * `?__clerk_handshake=` that Clerk appended. RSC, server actions, and
 * signed-in cookies stay on the Next server.
 */
export function isCacheablePublicDocument(
  method: string,
  url: URL,
  headers: Headers,
): boolean {
  if (method !== "GET") return false;
  if (normalizePath(url.pathname) !== "/") return false;
  if (headers.get("rsc") === "1") return false;
  if (headers.get("next-router-prefetch")) return false;
  if (headers.get("next-action")) return false;
  if (headers.get("purpose") === "prefetch") return false;
  if (url.searchParams.has("_rsc")) return false;
  if (requestHasSessionCookie(headers.get("cookie"))) return false;
  return true;
}

export function productionClerkKeyWarning(input: {
  hostname: string;
  secretKey?: string;
  publishableKey?: string;
}): string | undefined {
  const hostname = input.hostname.toLowerCase();
  if (hostname !== "readiumx.com" && hostname !== "www.readiumx.com") {
    return undefined;
  }

  if (!input.publishableKey?.startsWith("pk_live_")) {
    return "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not a Clerk live key (pk_live_). Clerk sets instanceType from this key, and anything else is a development instance: cookieless document GETs redirect into the handshake, then failed verification throws from handleTokenVerificationErrorInDevelopment (HTTP 500).";
  }

  if (!input.secretKey?.startsWith("sk_live_")) {
    return "CLERK_SECRET_KEY is not a Clerk live key (sk_live_). It has to be the secret from the same instance as the pk_live_ publishable key, or handshake signature checks fail.";
  }

  return undefined;
}
