import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("access_token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: data.data });
}
