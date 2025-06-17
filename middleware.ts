import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que exigem autenticação
const protectedRoutes = [
  "/join",
  "/lobby",
  "/room",
  // adicione outras rotas privadas aqui
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Busca o token nos cookies (SSR) ou pode usar Authorization header se usar JWT HttpOnly
  const token = request.cookies.get("token")?.value || "";

  if (isProtected && !token) {
    // Loga no terminal do servidor
    console.log(
      `[MIDDLEWARE] Bloqueio de acesso não autenticado em ${pathname} - ${new Date().toISOString()}`
    );
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configuração para rodar o middleware apenas nas rotas desejadas
export const config = {
  matcher: ["/join/:path*", "/lobby/:path*", "/room/:path*"],
};