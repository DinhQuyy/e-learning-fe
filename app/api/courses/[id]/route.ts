// app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 nhận params là Promise
) {
  const { id } = await context.params;        // 👈 await để lấy id

  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/courses/${id}?fields=*,category.*`,
      {
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok || !json?.data) {
      console.error("Directus course detail error:", json);
      return NextResponse.json(
        { message: json?.errors?.[0]?.message || "Không lấy được chi tiết khóa học" },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json({ data: json.data });
  } catch (error) {
    console.error("Course detail API error:", error);
    return NextResponse.json(
      { message: "Lỗi server khi lấy chi tiết khóa học" },
      { status: 500 }
    );
  }
}
