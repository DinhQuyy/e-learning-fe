import { NextRequest, NextResponse } from "next/server";

// E-learning routes
const ELEARNING_AUTH_ROUTES = ["/login", "/register"];
const ELEARNING_PROTECTED_ROUTES = ["/my-learning", "/profile"];

// Admin routes
const ADMIN_AUTH_ROUTES = ["/admin-login"];
const ADMIN_PROTECTED_ROUTES = ["/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Lấy token từ cookie
  const studentToken = req.cookies.get("access_token")?.value; // E-learning token
  const adminToken = req.cookies.get("admin_token")?.value;     // Admin token

  // Check routes
  const isAdminRoute = ADMIN_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminAuthRoute = ADMIN_AUTH_ROUTES.includes(pathname);
  
  const isStudentProtectedRoute = ELEARNING_PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isStudentAuthRoute = ELEARNING_AUTH_ROUTES.includes(pathname);

  // ADMIN ROUTES PROTECTION
  
  // Access /dashboard mà không có token → redirect về /admin-login
  if (isAdminRoute && !adminToken) {
    const adminLoginUrl = new URL("/admin-login", req.url);
    console.log("🚫 Chưa thể xác thực người dùng, tự động chuyển về trang Đăng nhập");
    return NextResponse.redirect(adminLoginUrl);
  }

  // Admin đã đăng nhập và access /admin-login → redirect về /dashboard
  if (isAdminAuthRoute && adminToken) {
    const dashboardUrl = new URL("/dashboard", req.url);
    console.log("✅ Xác thực thành công, tự động chuyển về trang Quản trị");
    return NextResponse.redirect(dashboardUrl);
  }

  // STUDENT ROUTES PROTECTION (E-LEARNING)
  
  // Access mà không có token → redirect về /login của page E-learning
  if (isStudentProtectedRoute && !studentToken) {
    const loginUrl = new URL("/login", req.url);
    console.log("🚫 Chưa thể xác thực người dùng, tự động chuyển về trang Đăng nhập");
    return NextResponse.redirect(loginUrl);
  }

  // Đã đăng nhập và access /login or /register → redirect về /my-learning
  if (isStudentAuthRoute && studentToken) {
    const myLearningUrl = new URL("/my-learning", req.url);
    console.log("✅ Xác thực học viên thành công");
    return NextResponse.redirect(myLearningUrl);
  }

  // ALLOW ACCESS
  
  console.log(`✅ Access granted to ${pathname}`);
  return NextResponse.next();
}

// MIDDLEWARE MATCHER CONFIG

export const config = {
  matcher: [
    // Admin routes
    "/dashboard/:path*",
    "/admin-login",
    
    // Student routes (E-learning)
    "/login",
    "/register",
    "/my-learning/:path*",
    "/profile/:path*",
  ],
};
