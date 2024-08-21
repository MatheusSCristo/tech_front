import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const publicPaths = ["/_next", "/favicon.ico", "/static"];
  if (publicPaths.some((path) => req.url.startsWith(path))) {
    return NextResponse.next();
  }
  const token = req.cookies.get("access_token");

  if (!token && !req.url.includes("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (token) {
    const response = await fetch(
      `http://localhost:8080/auth/validate/${token.value}`
    );

    if (response.status !== 200 && !req.url.includes("/auth")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (response.status === 200 && req.url.includes("/auth")) {
      console.log("redirecting to /");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*"],
};
