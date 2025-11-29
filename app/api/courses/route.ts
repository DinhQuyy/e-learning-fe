// app/api/courses/route.ts
import { NextResponse } from "next/server";

const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

export async function GET() {
  try {
    // Gọi đúng endpoint items/courses của Directus
    const res = await fetch(
      `${DIRECTUS_URL}/items/courses?fields=id,title,slug,description,level,price,image,category.id,category.name`,
      {
        // tránh cache để thấy data mới
        cache: "no-store",
      }
    );

    const text = await res.text();
    let json: any = null;

    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error("Không parse được JSON từ Directus:", text);
      return NextResponse.json(
        { message: "Dữ liệu Directus trả về không hợp lệ" },
        { status: 500 }
      );
    }

    if (!res.ok) {
      console.error("Directus error:", res.status, json);
      return NextResponse.json(
        {
          message:
            json?.errors?.[0]?.message ||
            `Không lấy được dữ liệu từ Directus (status ${res.status})`,
        },
        { status: 500 }
      );
    }

    // Trả data đúng format cho FE
    return NextResponse.json({ data: json.data ?? [] }, { status: 200 });
  } catch (error) {
    console.error("API /api/courses bị lỗi:", error);
    return NextResponse.json(
      { message: "Lỗi server khi lấy danh sách khoá học" },
      { status: 500 }
    );
  }
}
