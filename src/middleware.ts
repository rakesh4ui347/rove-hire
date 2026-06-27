import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = new Set(["/login"]);

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
} as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/apply") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Root route
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? ROUTES.DASHBOARD : ROUTES.LOGIN, request.url)
    );
  }

  // Protected routes
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