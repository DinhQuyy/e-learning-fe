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

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Vui long nhap email." },
        { status: 400 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.APP_URL;
    const origin = appUrl?.replace(/\/+$/, "") || new URL(req.url).origin;
    const resetUrl = `${origin}/reset-password`;

    const res = await fetch(`${DIRECTUS_URL}/auth/password/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, reset_url: resetUrl }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          message:
            data?.errors?.[0]?.message || "Khong the gui yeu cau quen mat khau.",
        },
        { status: res.status }
      );
    }

    return NextResponse.json({
      message: "Da gui yeu cau quen mat khau.",
    });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { message: "Khong the ket noi toi server." },
      { status: 500 }
    );
  }
}
