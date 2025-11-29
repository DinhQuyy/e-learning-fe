// app/api/categories/route.ts
import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!;

export async function GET() {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/categories?fields[]=id&fields[]=name&fields[]=slug`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Directus categories error:", data);
      return NextResponse.json(
        { message: "Không lấy được danh mục" },
        { status: 500 }
      );
    }

    return NextResponse.json(data.data ?? []);
  } catch (err) {
    console.error("Categories API error:", err);
    return NextResponse.json(
      { message: "Lỗi server khi lấy danh mục" },
      { status: 500 }
    );
  }
}
