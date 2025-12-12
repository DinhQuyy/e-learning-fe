// app/api/courses/route.ts
import { NextResponse } from "next/server";
import { directusRequest } from "@/lib/directus";

// GET /api/courses
export async function GET() {
  try {
    // chỉ lấy field chắc chắn có
    const fields = [
       "id",
      "title",
      "slug",
      "description",
      "price",
      "level",
      "thumbnail",
      "category",
      "teacher_name",
      "status",
      "students",
      "rating",
      "lessons",
      "duration",
      "created_at",
      "updated_at",
    ].join(",");

    const json = await directusRequest<{ data: any[] }>(
      `/items/courses?limit=-1&fields=${encodeURIComponent(fields)}`
    );

    return NextResponse.json({ courses: json?.data ?? [] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Không lấy được danh sách khoá học" },
      { status: 500 }
    );
  }
}

// POST /api/courses
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload: any = {
      title: body.title,
      slug: body.slug,
      description: body.description,
      price: body.price,
      level: body.level,
      thumbnail: body.thumbnail,
      category: body.category,
      teacher_name: body.teacher_name,
      status: body.status,
      students: body.students,
      rating: body.rating,
      lessons: body.lessons,
      duration: body.duration,
    };

    const json = await directusRequest<{ data: any }>(`/items/courses`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ course: json?.data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message || "Không tạo được khoá học" },
      { status: 500 }
    );
  }
}
