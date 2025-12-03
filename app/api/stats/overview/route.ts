// app/api/stats/overview/route.ts
import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL!;
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN!;
const STUDENT_ROLE_ID = process.env.STUDENT_ROLE_ID!;

// Hàm gọi Directus, tự gắn header Authorization (admin)
async function directusFetch(path: string) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    // tránh cache khi dev
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("Directus error:", res.status, json);
    throw new Error(json?.errors?.[0]?.message || "Directus request failed");
  }

  return json;
}

export async function GET() {
  try {
    // 1. Tổng số học viên (role = Student)
    const studentsJson = await directusFetch(
      `/users?filter[role][_eq]=${STUDENT_ROLE_ID}&meta=total_count&limit=0`
    );
    const totalStudents = studentsJson?.meta?.total_count ?? 0;

    // 2. Tổng số khóa học
    const coursesJson = await directusFetch(
      `/items/courses?meta=total_count&limit=0`
    );
    const totalCourses = coursesJson?.meta?.total_count ?? 0;

    // 3. Khóa học đang hoạt động
    // Nếu chưa có field status thì tạm cho = totalCourses
    const activeCourses = totalCourses;

    // 4. Thống kê enrollments (bảng ghi danh / tiến độ)
    // LƯU Ý: bạn phải đặt tên collection trong Directus là "enrollments"
    // hoặc đổi lại path dưới cho đúng tên bạn dùng
    const enrollmentsJson = await directusFetch(
      `/items/enrollments?fields=progress,status&limit=-1`
    );

    const enrollments =
      (enrollmentsJson?.data as { progress?: number; status?: string }[]) ||
      [];

    const totalEnrollments = enrollments.length;

    let inProgressCount = 0;
    let completedCount = 0;
    let sumProgress = 0;

    for (const e of enrollments) {
      if (e.status === "in_progress") inProgressCount++;
      if (e.status === "completed") completedCount++;
      if (typeof e.progress === "number") {
        sumProgress += e.progress;
      }
    }

    const averageProgress =
      totalEnrollments > 0 ? sumProgress / totalEnrollments : 0;

    return NextResponse.json({
      totalStudents,
      totalCourses,
      activeCourses,
      totalEnrollments,
      inProgressCount,
      completedCount,
      averageProgress,
    });
  } catch (error: any) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { message: error?.message || "Lỗi server khi lấy thống kê" },
      { status: 500 }
    );
  }
}
