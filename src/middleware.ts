import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const publicPaths = ["/_next", "/favicon.ico", "/static"];
  if (publicPaths.some((path) => req.url.startsWith(path))) {
    return NextResponse.next();
  }
  const token = req.cookies.get("access_token");

  // Se não houver token e o usuário não está em uma rota de autenticação, redirecione para a página de login
  if (!token && !req.url.includes("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Se o token existir, valide-o
  if (token) {
    const response = await fetch(
      `http://localhost:8080/auth/validate/${token.value}`
    );

    // Se o token não for válido e o usuário não está em uma rota de autenticação, redirecione para login
    if (response.status !== 200 && !req.url.includes("/auth")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Se o token for válido e o usuário está em uma rota de autenticação, redirecione para a página principal
    if (response.status === 200 && req.url.includes("/auth")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Se o token for válido ou o usuário já está em uma rota de autenticação permitida
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*"],
};
