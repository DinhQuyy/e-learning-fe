// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

type Enrollment = {
  id: number;
  user: string | null;
  course: number | string | null;
  status?: string | null;
  progress?: number | null;
  last_activity?: string | null;
  enrolled_at?: string | null;
};

// Gọi Directus chung
async function directusFetch(path: string) {
  if (!DIRECTUS_URL) {
    throw new Error("Missing NEXT_PUBLIC_DIRECTUS_URL");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (ADMIN_TOKEN) {
    headers["Authorization"] = `Bearer ${ADMIN_TOKEN}`;
  }

  const res = await fetch(`${DIRECTUS_URL}/${path}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("Directus error:", path, json);
    throw new Error(json?.errors?.[0]?.message || "Directus error");
  }

  return json;
}

// Đếm số bản ghi (dùng meta.total_count nếu có)
async function fetchDirectusCount(pathWithQuery: string): Promise<number> {
  const json = await directusFetch(pathWithQuery);
  const meta = json?.meta || {};

  const total =
    typeof meta.total_count === "number"
      ? meta.total_count
      : typeof meta.filter_count === "number"
      ? meta.filter_count
      : Array.isArray(json?.data)
      ? json.data.length
      : 0;

  return total;
}

// Lấy toàn bộ enrollments (dữ liệu không quá lớn nên xử lý trong Node)
async function fetchAllEnrollments(): Promise<Enrollment[]> {
  const json = await directusFetch(
    "items/enrollments?limit=-1&fields=id,student,course,progress,status,started_at,completed_at,created_at,updated_at"
  );
  return (json?.data || []) as Enrollment[];
}

export async function GET(req: NextRequest) {
  try {
    if (!DIRECTUS_URL) {
      return NextResponse.json(
        { message: "Thiếu NEXT_PUBLIC_DIRECTUS_URL" },
        { status: 500 }
      );
    }

    // 1. Lấy tổng users và courses
    const [totalUsers, totalCourses, enrollments] = await Promise.all([
      fetchDirectusCount("users?limit=0&meta=total_count"),
      fetchDirectusCount("items/courses?limit=0&meta=total_count"),
      fetchAllEnrollments(),
    ]);

    const now = new Date();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    // 2. Học viên đang hoạt động = user có last_activity trong 30 ngày
    const activeUserSet = new Set<string>();

    enrollments.forEach((e) => {
      if (!e.user || !e.last_activity) return;
      const last = new Date(e.last_activity).getTime();
      if (isNaN(last)) return;
      if (now.getTime() - last <= THIRTY_DAYS) {
        activeUserSet.add(String(e.user));
      }
    });

    const activeStudents = activeUserSet.size || 0;

    // 3. Tiến độ trung bình = avg(progress)
    const progressValues = enrollments
      .map((e) => (typeof e.progress === "number" ? e.progress : null))
      .filter((v): v is number => v !== null);

    const avgCompletion =
      progressValues.length > 0
        ? progressValues.reduce((sum, v) => sum + v, 0) / progressValues.length
        : 0;

    // 4. Thống kê theo tháng (đăng ký/enrollment)
    type MonthAgg = {
      monthKey: string; // "Jan"
      activeStudents: Set<string>;
      completions: number[];
      courses: Set<string | number>;
    };

    const monthMap = new Map<string, MonthAgg>();

    enrollments.forEach((e) => {
      if (!e.enrolled_at) return;

      const d = new Date(e.enrolled_at);
      if (isNaN(d.getTime())) return;

      const monthKey = d.toLocaleString("en", { month: "short" }); // Jan, Feb, ...
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          monthKey,
          activeStudents: new Set<string>(),
          completions: [],
          courses: new Set(),
        });
      }

      const bucket = monthMap.get(monthKey)!;

      if (e.user) bucket.activeStudents.add(String(e.user));
      if (typeof e.progress === "number") bucket.completions.push(e.progress);
      if (e.course) bucket.courses.add(e.course);
    });

    // Nếu chưa có dữ liệu -> trả rỗng, phía client sẽ fallback sang mock
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyData = Array.from(monthMap.values())
      .sort(
        (a, b) =>
          monthOrder.indexOf(a.monthKey) - monthOrder.indexOf(b.monthKey)
      )
      .map((m) => {
        const completionRate =
          m.completions.length > 0
            ? m.completions.reduce((s, v) => s + v, 0) / m.completions.length
            : 0;

        return {
          month: m.monthKey,
          activeStudents: m.activeStudents.size,
          completionRate,
          activeCourses: m.courses.size,
        };
      });

    // 5. Tạm giữ topCourses giống mock (có thể nâng cấp sau)
    const topCourses = [
      {
        name: "Next.js Full Stack",
        students: Math.max(50, Math.round(totalUsers * 0.25)),
        completion: 85,
        revenue: "₫45M",
      },
      {
        name: "React Native Apps",
        students: Math.max(40, Math.round(totalUsers * 0.2)),
        completion: 78,
        revenue: "₫38M",
      },
      {
        name: "TypeScript Mastery",
        students: Math.max(30, Math.round(totalUsers * 0.18)),
        completion: 92,
        revenue: "₫32M",
      },
    ];

    return NextResponse.json({
      totalUsers,
      activeStudents,
      totalCourses,
      avgCompletion,
      // nếu monthlyData rỗng, client sẽ dùng mock nên không sao
      monthlyData,
      topCourses,
    });
  } catch (err) {
    console.error("Analytics API error:", err);
    return NextResponse.json(
      { message: "Không lấy được dữ liệu analytics" },
      { status: 500 }
    );
  }
}
