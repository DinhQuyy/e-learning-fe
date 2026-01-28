import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ message: "Logout success" });

  res.cookies.set("directus_access_token", "", {
    path: "/",
    maxAge: 0,
  });
  res.cookies.set("directus_refresh_token", "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
