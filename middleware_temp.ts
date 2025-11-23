import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value; // 'student' | 'instructor' | 'admin'

  //Nếu không có token → redirect login
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

//   //Phân quyền
//   if (req.nextUrl.pathname.startsWith("/dashboard")) {
//     if (role === "student" && req.nextUrl.pathname.startsWith("/dashboard/student"))
//       return NextResponse.next();

//     if (role === "instructor" && req.nextUrl.pathname.startsWith("/dashboard/instructor"))
//       return NextResponse.next();

//     if (role === "admin" && req.nextUrl.pathname.startsWith("/dashboard/admin"))
//       return NextResponse.next();

//     //Nếu truy cập sai khu vực
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }
}