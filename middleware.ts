import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Clerk's default matcher runs `authenticateRequest` on almost every path,
 * including `/`, `/robots.txt`, and scanner 404s. A development publishable
 * key (`pk_test_`) sets instanceType to "development", which redirects
 * cookieless document GETs into `?__clerk_handshake=` and can 500 via
 * `handleTokenVerificationErrorInDevelopment`.
 *
 * `config.matcher` has to be an inline literal so Next can analyze it at build
 * time. Keep it aligned with the protected list below. Public pages are absent
 * on purpose — they must not call `auth()`.
 */
const isProtectedRoute = createRouteMatcher([
  "/account(.*)",
  "/article(.*)",
  "/bookmarks(.*)",
  "/history(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/account/:path*",
    "/article/:path*",
    "/bookmarks/:path*",
    "/history/:path*",
    "/signin/:path*",
    "/signup/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/sso-callback/:path*",
    "/api/auth/:path*",
    "/api/bookmarks/:path*",
    "/api/history/:path*",
  ],
};
