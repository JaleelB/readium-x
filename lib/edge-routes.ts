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
  ".yaml",
  ".yml",
  ".log",
  ".old",
  ".orig",
];

const PROBE_SEGMENTS = new Set([
  ".aws",
  ".git",
  ".hg",
  ".svn",
  "administrator",
  ".docker",
  ".vscode",
  ".ssh",
  ".ds_store",
  "actuator",
  "server-status",
  "server-info",
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
Disallow: /article/

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
  const segments = path.split("/");
  if (
    segments.some((segment) =>
      PROBE_EXTENSIONS.some((extension) => segment.endsWith(extension)),
    )
  ) {
    return true;
  }
  // Root admin endpoints are scanner targets, not application routes.
  if (path === "/admin" || path.startsWith("/admin/")) return true;

  return segments.some(
    (segment) =>
      PROBE_SEGMENTS.has(segment) ||
      segment.startsWith("wp-") ||
      segment === ".env" ||
      segment.startsWith(".env."),
  );
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
  return /(?:^|;\s*)(?:__session|__client_uat)(?:_[A-Za-z0-9_-]+)?=/.test(
    cookieHeader,
  );
}

/** Only bypass Next when there is no possible Clerk authentication to verify. */
export function shouldRedirectAnonymousArticle(
  url: URL,
  headers: Headers,
): boolean {
  if (url.pathname !== "/article" && !url.pathname.startsWith("/article/")) {
    return false;
  }
  if (requestHasSessionCookie(headers.get("cookie"))) return false;
  if (headers.has("authorization")) return false;
  // Clerk can complete a signed-in handshake before the session cookie exists.
  if ([...url.searchParams.keys()].some((key) => key.startsWith("__clerk_"))) {
    return false;
  }
  return true;
}

// Explicitly list public document shells; never cache callback/protected pages.
const PUBLIC_DOCUMENT_PATHS = new Set([
  "/",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
]);

/** Cookieless document GETs only. Query-dependent auth flows bypass caching. */
export function isCacheablePublicDocument(
  method: string,
  url: URL,
  headers: Headers,
): boolean {
  if (method !== "GET") return false;
  if (!PUBLIC_DOCUMENT_PATHS.has(url.pathname)) return false;
  if (url.search) return false;
  if (headers.has("cookie") || headers.has("authorization")) return false;
  if (headers.has("rsc")) return false;
  if (headers.has("next-router-state-tree")) return false;
  if (headers.has("next-url")) return false;
  if (headers.has("next-router-prefetch")) return false;
  if (headers.has("next-action")) return false;
  if (headers.get("purpose") === "prefetch") return false;
  if (headers.get("sec-purpose")?.includes("prefetch")) return false;
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
