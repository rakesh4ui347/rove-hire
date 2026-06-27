import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  getAuthSecret,
  resolveAuthEnv,
  shouldUseSecureAuthCookies,
} from "@/lib/auth-env";

resolveAuthEnv();

const PUBLIC_PATHS = new Set(["/login"]);

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
} as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: getAuthSecret(),
    secureCookie: shouldUseSecureAuthCookies(),
  });

  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/apply") ||
    pathname.startsWith("/api/auth");

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  if (isPublic) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? ROUTES.DASHBOARD : ROUTES.LOGIN, request.url)
    );
  }

  if (!token) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|fonts|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)",
  ],
};