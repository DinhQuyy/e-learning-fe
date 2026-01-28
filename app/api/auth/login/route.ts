// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!;

export async function POST(req: Request) {
  try {
    const { email, password, remember } = await req.json();
    const rememberMe = Boolean(remember);

    if (!email || !password) {
      return NextResponse.json(
        { message: "Thiếu email hoặc mật khẩu" },
        { status: 400 }
      );
    }

    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Directus login error:", data);
      return NextResponse.json(
        {
          message: data?.errors?.[0]?.message || "Đăng nhập thất bại",
        },
        { status: 401 }
      );
    }

    const { access_token, refresh_token, expires } = data.data;

    const resNext = NextResponse.json({
      message: "Đăng nhập thành công",
    });

    resNext.cookies.set("directus_access_token", access_token, {
      httpOnly: true,
      sameSite: "lax",
      ...(rememberMe ? { maxAge: expires } : {}),
      path: "/",
    });

    resNext.cookies.set("directus_refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      ...(rememberMe ? { maxAge: 60 * 60 * 24 * 30 } : {}),
      path: "/",
    });

    return resNext;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Lỗi server khi đăng nhập" },
      { status: 500 }
    );
  }
}
