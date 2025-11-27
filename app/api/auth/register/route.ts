import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

// TODO: Khi bạn tạo role "Student" trong Directus, lấy id đó gán vào đây
// ví dụ: const STUDENT_ROLE_ID = "7f9c8b3c-...";
// Nếu để undefined thì Directus sẽ dùng role mặc định (nếu có)
const STUDENT_ROLE_ID = undefined;

export async function POST(req: NextRequest) {
  try {
    if (!DIRECTUS_URL) {
      return NextResponse.json(
        { message: "Thiếu NEXT_PUBLIC_DIRECTUS_URL trong .env.local" },
        { status: 500 }
      );
    }

    const { full_name, email, password, confirm_password } = await req.json();

    if (!full_name || !email || !password || !confirm_password) {
      return NextResponse.json(
        { message: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    if (password !== confirm_password) {
      return NextResponse.json(
        { message: "Mật khẩu xác nhận không khớp" },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (ADMIN_TOKEN) {
      headers["Authorization"] = `Bearer ${ADMIN_TOKEN}`;
    }

    const payload: Record<string, any> = {
      first_name: full_name,
      email,
      password,
    };

    if (STUDENT_ROLE_ID) {
      payload["role"] = STUDENT_ROLE_ID;
    }

    const directusRes = await fetch(`${DIRECTUS_URL}/users`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const directusData = await directusRes.json().catch(() => null);

    if (!directusRes.ok) {
      console.error("Directus /users error:", {
        status: directusRes.status,
        data: directusData,
      });

      return NextResponse.json(
        {
          message:
            directusData?.errors?.[0]?.message ||
            "Đăng ký thất bại từ Directus",
          raw: directusData,
        },
        { status: directusRes.status }
      );
    }

    return NextResponse.json(
      {
        message: "Đăng ký thành công",
        user: directusData.data ?? directusData,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { message: "Lỗi server khi đăng ký" },
      { status: 500 }
    );
  }
}
