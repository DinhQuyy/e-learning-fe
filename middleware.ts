import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PROTECTED_ROUTES = ["/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("access_token")?.value;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtected = PROTECTED_ROUTES.some((p) =>
    pathname.startsWith(p)
  );

  // Chưa login mà vào /dashboard -> đẩy về /login
  if (isProtected && !accessToken) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Đã login mà vẫn vào /login hoặc /register -> đẩy về /dashboard
  if (isAuthRoute && accessToken) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Áp dụng middleware cho các route này
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
