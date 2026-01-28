// app/api/courses/route.ts
import { NextResponse } from "next/server";
import { directusRequest } from "@/lib/directus";

// GET /api/courses
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const limitParam = searchParams.get("limit");
    const limitValue = Number(limitParam);
    const limit = Number.isFinite(limitValue) && limitValue > 0 ? String(limitValue) : "-1";

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

    const query = new URLSearchParams();
    query.set("limit", limit);
    query.set("fields", fields);
    if (search) {
      query.set("filter[_or][0][title][_icontains]", search);
      query.set("filter[_or][1][description][_icontains]", search);
      query.set("filter[_or][2][teacher_name][_icontains]", search);
    }

    const json = await directusRequest<{ data: any[] }>(
      `/items/courses?${query.toString()}`
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
