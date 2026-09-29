import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  classifyPath,
  isCacheablePublicDocument,
  productionClerkKeyWarning,
  requestHasSessionCookie,
  ROBOTS_TXT,
  SITEMAP_XML,
  WEB_MANIFEST,
} from "@/lib/edge-routes";

describe("classifyPath", () => {
  it("serves crawler metadata without treating the client as hostile", () => {
    expect(classifyPath("/robots.txt")).toMatchObject({
      type: "metadata",
      body: ROBOTS_TXT,
    });
    expect(classifyPath("/sitemap.xml").type).toBe("metadata");
    expect(classifyPath("/Robots.TXT").type).toBe("metadata");
    expect(classifyPath("/")).toEqual({ type: "app" });
    expect(classifyPath("/article/abc").type).toBe("app");
    expect(classifyPath("/signin").type).toBe("app");
  });

  it("rejects known scanner probes and still allows normal routes", () => {
    expect(classifyPath("/wp-login.php")).toEqual({ type: "probe" });
    expect(classifyPath("/wp-admin/install.php")).toEqual({ type: "probe" });
    expect(classifyPath("/.env")).toEqual({ type: "probe" });
    expect(classifyPath("/.env.local")).toEqual({ type: "probe" });
    expect(classifyPath("/.git/config")).toEqual({ type: "probe" });
    expect(classifyPath("/xmlrpc.php")).toEqual({ type: "probe" });
    expect(classifyPath("/vendor/phpunit/phpunit.xml")).toEqual({
      type: "probe",
    });
    expect(classifyPath("/%2eenv")).toEqual({ type: "probe" });
    expect(classifyPath("/api/bookmarks").type).toBe("app");
    expect(classifyPath("/_next/static/chunks/app.js").type).toBe("app");
  });

  it("classifies missing public files as static assets", () => {
    expect(classifyPath("/favicon.ico")).toEqual({ type: "static-asset" });
    expect(classifyPath("/android-chrome-192x192.png")).toEqual({
      type: "static-asset",
    });
  });
});

describe("isCacheablePublicDocument", () => {
  it("caches anonymous document GETs of the homepage, including a clerk handshake query", () => {
    const url = new URL("https://readiumx.com/?__clerk_handshake=token");
    expect(isCacheablePublicDocument("GET", url, new Headers())).toBe(true);
  });

  it("does not cache RSC, server actions, or signed-in requests", () => {
    const url = new URL("https://readiumx.com/");
    expect(
      isCacheablePublicDocument("GET", url, new Headers({ RSC: "1" })),
    ).toBe(false);
    expect(
      isCacheablePublicDocument(
        "POST",
        url,
        new Headers({ "Next-Action": "abc" }),
      ),
    ).toBe(false);
    expect(
      isCacheablePublicDocument(
        "GET",
        url,
        new Headers({ cookie: "__session=eyJ; __client_uat=1" }),
      ),
    ).toBe(false);
    expect(
      isCacheablePublicDocument(
        "GET",
        new URL("https://readiumx.com/article/1"),
        new Headers(),
      ),
    ).toBe(false);
  });
});

describe("requestHasSessionCookie", () => {
  it("detects clerk session cookies only", () => {
    expect(requestHasSessionCookie(null)).toBe(false);
    expect(requestHasSessionCookie("theme=dark")).toBe(false);
    expect(requestHasSessionCookie("__client_uat=0")).toBe(true);
  });
});

describe("productionClerkKeyWarning", () => {
  it("warns only for the production hosts using non-live keys", () => {
    expect(
      productionClerkKeyWarning({
        hostname: "readiumx.com",
        secretKey: "sk_test_abc",
        publishableKey: "pk_test_abc",
      }),
    ).toMatch(/pk_live_/);

    expect(
      productionClerkKeyWarning({
        hostname: "readiumx.com",
        secretKey: "sk_test_abc",
        publishableKey: "pk_live_abc",
      }),
    ).toMatch(/sk_live_/);

    expect(
      productionClerkKeyWarning({
        hostname: "localhost",
        secretKey: "sk_test_abc",
      }),
    ).toBeUndefined();

    expect(
      productionClerkKeyWarning({
        hostname: "www.readiumx.com",
        secretKey: "sk_live_abc",
        publishableKey: "pk_live_abc",
      }),
    ).toBeUndefined();
  });
});

describe("public metadata files", () => {
  it("matches the bodies the edge worker returns", () => {
    expect(readFileSync("public/robots.txt", "utf8")).toBe(ROBOTS_TXT);
    expect(readFileSync("public/sitemap.xml", "utf8")).toBe(SITEMAP_XML);
    expect(readFileSync("public/site.webmanifest", "utf8")).toBe(WEB_MANIFEST);
    expect(readFileSync("public/manifest.webmanifest", "utf8")).toBe(
      WEB_MANIFEST,
    );
  });
});

describe("clerk middleware scope", () => {
  it("does not use Clerk's default catch-all matcher", () => {
    const source = readFileSync("middleware.ts", "utf8");
    expect(source).not.toContain("html?|css|js");
    expect(source).toContain('"/account/:path*"');
    expect(source).not.toContain('"/((?!_next');
  });

  it("keeps the public homepage off server auth", () => {
    const page = readFileSync("app/(home)/page.tsx", "utf8");
    const layout = readFileSync("app/(home)/layout.tsx", "utf8");
    const root = readFileSync("app/layout.tsx", "utf8");

    expect(page).not.toContain("getCurrentUser");
    expect(layout).toContain("loadServerUser={false}");
    expect(root).not.toMatch(/<ClerkProvider[^>]*\bdynamic\b/);
  });
});
