import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest,res: NextResponse) {
  const publicPaths = ["/_next", "/favicon.ico", "/static"];
  if (publicPaths.some((path) => req.url.startsWith(path))) {
    return NextResponse.next();
  }
  const token = req.cookies.get("access_token");

  if (!token && !req.url.includes("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (token) {
    try {
      const response = await fetch(`http://localhost:8080/auth/validate/${token.value}`);

      if (response.status !== 200 && !req.url.includes("/auth")) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }

      if (response.status === 200 && req.url.includes("/auth")) {
        console.log("redirecting to /");
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    } catch (error) {
      const response= NextResponse.redirect(new URL("/auth/login", req.url));
      response.cookies.delete("access_token");
      return response;
    }
  }
}

export const config = {
  matcher: ["/", "/auth/:path*"],
};
