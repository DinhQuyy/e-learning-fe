import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

export async function POST(req: Request) {
  try {
    if (!DIRECTUS_URL) {
      return NextResponse.json(
        { message: "Missing NEXT_PUBLIC_DIRECTUS_URL in .env.local" },
        { status: 500 }
      );
    }

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Thieu token hoac mat khau moi." },
        { status: 400 }
      );
    }

    const res = await fetch(`${DIRECTUS_URL}/auth/password/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          message:
            data?.errors?.[0]?.message || "Khong the dat lai mat khau.",
        },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: "Dat lai mat khau thanh cong." });
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { message: "Khong the ket noi toi server." },
      { status: 500 }
    );
  }
}
