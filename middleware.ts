import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  const origin = request.headers.get("origin");
  const allowedOrigins = ["https://www.readiumx.com", "https://readiumx.com"];

  if (request.method === "OPTIONS") {
    res.headers.append("Access-Control-Allow-Origin", origin!);
    res.headers.append("Access-Control-Allow-Credentials", "true");
    res.headers.append(
      "Access-Control-Allow-Methods",
      "GET,DELETE,PATCH,POST,PUT,OPTIONS",
    );
    res.headers.append(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );

    return res;
  }

  if (origin && !allowedOrigins.includes(origin)) {
    res.headers.append("Access-Control-Allow-Origin", origin);
  }

  res.headers.append("Access-Control-Allow-Credentials", "true");
  res.headers.append(
    "Access-Control-Allow-Methods",
    "GET,DELETE,PATCH,POST,PUT,OPTIONS",
  );
  res.headers.append(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  );

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
