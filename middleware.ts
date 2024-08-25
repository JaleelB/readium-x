import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateRequest } from "./server/auth";

export async function middleware(request: NextRequest) {
  const { session } = await validateRequest();

  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/history", "/bookmarks"],
};
