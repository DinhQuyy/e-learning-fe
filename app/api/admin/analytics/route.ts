// app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

type DirectusEnrollment = {
  id: number;
  student: string | null;
  course: number | null;
  progress: number | null;
  status: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type DirectusCourse = {
  id: number;
  title: string;
  price: number | null;
};

async function directusFetch<T>(path: string): Promise<T> {
  if (!DIRECTUS_URL || !ADMIN_TOKEN) {
    throw new Error("Thiếu DIRECTUS_URL hoặc ADMIN_TOKEN");
  }

  const res = await fetch(`${DIRECTUS_URL}/${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("Directus error:", path, json);
    throw new Error(
      json?.errors?.[0]?.message || `Directus request failed: ${path}`
    );
  }

  return (json as any).data ?? json;
}

function getLastNMonthsLabels(n: number) {
  const now = new Date();
  const months: { key: string; label: string }[] = [];

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const label = d.toLocaleString("en-US", { month: "short" }); // Jan, Feb,...
    months.push({ key, label });
  }

  return months;
}

export async function GET() {
  try {
    // 1) Users
    const users = await directusFetch<any[]>("users?limit=-1");
    const totalUsers = users.length;

    // 2) Courses
    const courses = await directusFetch<DirectusCourse[]>(
      "items/courses?limit=-1&fields=id,title,price"
    );
    const totalCourses = courses.length;
    const courseMap = new Map<number, DirectusCourse>();
    courses.forEach((c) => courseMap.set(c.id, c));

    // 3) Enrollments
    const enrollments = await directusFetch<DirectusEnrollment[]>(
      "items/enrollments?limit=-1&fields=id,student,course,progress,status,started_at,completed_at,created_at,updated_at"
    );

    // ===== Tổng quan (all time) =====
    const progressValues = enrollments
      .map((e) => e.progress ?? 0)
      .filter((v) => v >= 0);

    const avgCompletion =
      progressValues.length > 0
        ? progressValues.reduce((s, v) => s + v, 0) / progressValues.length
        : 0;

    // Học viên đang hoạt động = distinct student có progress > 0
    const activeStudentSet = new Set<string>();
    enrollments.forEach((e) => {
      if ((e.progress ?? 0) > 0 && e.student) {
        activeStudentSet.add(e.student);
      }
    });
    const activeStudents = activeStudentSet.size;

    // ===== Thống kê "trong tháng hiện tại" =====
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    let totalEnrollments = enrollments.length;
    let monthlyEnrollments = 0;
    let monthlyCompletedEnrollments = 0;
    let monthlyCompletionSum = 0;
    let monthlyCompletionCount = 0;

    enrollments.forEach((e) => {
      const dateStr = e.started_at || e.created_at;
      if (!dateStr) return;

      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;

      if (d >= startOfMonth && d < startOfNextMonth) {
        monthlyEnrollments += 1;

        const progress = e.progress ?? 0;
        monthlyCompletionSum += progress;
        monthlyCompletionCount += 1;

        // coi như "hoàn thành" nếu progress >= 100 hoặc có completed_at
        if (progress >= 100 || e.completed_at) {
          monthlyCompletedEnrollments += 1;
        }
      }
    });

    const monthlyAvgCompletion =
      monthlyCompletionCount > 0
        ? monthlyCompletionSum / monthlyCompletionCount
        : 0;

    // ===== Monthly data (12 tháng gần nhất) =====
    const monthDefs = getLastNMonthsLabels(12);
    const monthMap: Record<
      string,
      {
        activeStudents: number;
        completionRates: number[];
        activeCoursesSet: Set<number>;
      }
    > = {};

    monthDefs.forEach((m) => {
      monthMap[m.key] = {
        activeStudents: 0,
        completionRates: [],
        activeCoursesSet: new Set<number>(),
      };
    });

    enrollments.forEach((e) => {
      const dateStr = e.started_at || e.created_at;
      if (!dateStr) return;

      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const bucket = monthMap[key];
      if (!bucket) return; // không thuộc 12 tháng gần nhất

      if ((e.progress ?? 0) > 0) {
        bucket.activeStudents += 1;
        bucket.completionRates.push(e.progress ?? 0);
      }

      if (e.course != null) {
        bucket.activeCoursesSet.add(e.course);
      }
    });

    const monthlyData = monthDefs.map((m) => {
      const bucket = monthMap[m.key];
      const completionRate =
        bucket.completionRates.length > 0
          ? bucket.completionRates.reduce((s, v) => s + v, 0) /
            bucket.completionRates.length
          : 0;

      return {
        month: m.label,
        activeStudents: bucket.activeStudents,
        completionRate,
        activeCourses: bucket.activeCoursesSet.size,
      };
    });

    // ===== Top courses =====
    const courseStats = new Map<
      number,
      { students: number; completionSum: number }
    >();

    enrollments.forEach((e) => {
      if (e.course == null) return;
      const stat =
        courseStats.get(e.course) || { students: 0, completionSum: 0 };
      stat.students += 1;
      stat.completionSum += e.progress ?? 0;
      courseStats.set(e.course, stat);
    });

    const topCourses = Array.from(courseStats.entries())
      .map(([courseId, stat]) => {
        const course = courseMap.get(courseId);
        const avgCourseCompletion =
          stat.students > 0 ? stat.completionSum / stat.students : 0;
        const revenueRaw = (course?.price ?? 0) * stat.students;
        return {
          name: course?.title ?? `Khoá #${courseId}`,
          students: stat.students,
          completion: Math.round(avgCourseCompletion),
          revenue:
            "₫" +
            revenueRaw.toLocaleString("vi-VN", {
              maximumFractionDigits: 0,
            }),
        };
      })
      .sort((a, b) => b.students - a.students)
      .slice(0, 3);

    return NextResponse.json({
      totalUsers,
      activeStudents,
      totalCourses,
      avgCompletion,
      monthlyData,
      topCourses,

      // thêm cho 3 card phía dưới
      totalEnrollments,
      monthlyEnrollments,
      monthlyCompletedEnrollments,
      monthlyAvgCompletion,
    });
  } catch (err: any) {
    console.error("Analytics API error:", err);
    return NextResponse.json(
      { message: err?.message || "Không tính được analytics" },
      { status: 500 }
    );
  }
}
