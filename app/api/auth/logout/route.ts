import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ message: "Đã đăng xuất" });

  res.cookies.set("access_token", "", {
    path: "/",
    maxAge: 0,
  });
  res.cookies.set("refresh_token", "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
