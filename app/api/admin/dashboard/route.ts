import { NextResponse } from "next/server";
import { directusRequest } from "@/lib/directus";

export const revalidate = 60;

type DirectusUser = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  role?: string | null;
};

type DirectusCourse = {
  id: number;
  title?: string | null;
  price?: number | null;
  status?: string | null;
  teacher_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type DirectusEnrollment = {
  id: number;
  student?: string | null;
  course?: number | null;
  progress?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
};

type DirectusOrder = {
  id: number;
  user_id?: string | null;
  course_id?: number | null;
  total?: number | null;
  status?: string | null;
  created_at?: string | null;
};

type DirectusStatusItem = {
  id: number | string;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ActivityItem = {
  id: string | number;
  type: "user" | "course" | "system";
  title: string;
  time: string;
  _date?: Date;
};

function normalizeStatus(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function parseRange(value: string | null) {
  if (!value) return 30;
  const normalized = value.trim().toLowerCase();
  const digits = parseInt(normalized.replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(digits) || digits <= 0) return 30;
  if (digits === 7 || digits === 30 || digits === 90 || digits === 365) {
    return digits;
  }
  return 30;
}

function toDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function pickDate<T extends Record<string, any>>(item: T, fields: (keyof T)[]) {
  for (const field of fields) {
    const d = toDate(item[field] as any);
    if (d) return d;
  }
  return null;
}

function isWithin(date: Date | null, start: Date, end: Date) {
  if (!date) return false;
  return date >= start && date < end;
}

function timeAgoVi(date: Date, now = new Date()) {
  const diff = Math.max(0, now.getTime() - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Vài giây trước";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

function calcTrend(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return 0;
    return 100;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

async function fetchItems<T>(path: string): Promise<T[]> {
  const json = await directusRequest<{ data?: T[] }>(path);
  const data = (json as any)?.data ?? json;
  return Array.isArray(data) ? data : [];
}

async function fetchItemsSafe<T>(path: string): Promise<T[]> {
  try {
    return await fetchItems<T>(path);
  } catch (error) {
    console.warn("Dashboard API fallback for", path, error);
    return [];
  }
}

function getLastNMonthsLabels(n: number) {
  const now = new Date();
  const months: { key: string; label: string }[] = [];

  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("vi-VN", { month: "short" });
    months.push({ key, label });
  }

  return months;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rangeDays = parseRange(searchParams.get("range"));

    const now = new Date();
    const startCurrent = new Date(now);
    startCurrent.setDate(startCurrent.getDate() - rangeDays);
    const startPrevious = new Date(now);
    startPrevious.setDate(startPrevious.getDate() - rangeDays * 2);

    const [
      users,
      courses,
      enrollments,
      orders,
      refunds,
      payouts,
      reports,
    ] = await Promise.all([
      fetchItems<DirectusUser>(
        `users?limit=-1&fields=${encodeURIComponent(
          "id,first_name,last_name,email,role"
        )}`
      ),
      fetchItems<DirectusCourse>(
        `items/courses?limit=-1&fields=${encodeURIComponent(
          "id,title,price,status,teacher_name,created_at,updated_at"
        )}`
      ),
      fetchItems<DirectusEnrollment>(
        `items/enrollments?limit=-1&fields=${encodeURIComponent(
          "id,student,course,progress,created_at,updated_at,started_at,completed_at"
        )}`
      ),
      fetchItemsSafe<DirectusOrder>(
        `items/orders?limit=-1&fields=${encodeURIComponent(
          "id,user_id,course_id,total,status,created_at"
        )}`
      ),
      fetchItemsSafe<DirectusStatusItem>(
        `items/refunds?limit=-1&fields=${encodeURIComponent(
          "id,status,created_at,updated_at"
        )}`
      ),
      fetchItemsSafe<DirectusStatusItem>(
        `items/payouts?limit=-1&fields=${encodeURIComponent(
          "id,status,created_at,updated_at"
        )}`
      ),
      fetchItemsSafe<DirectusStatusItem>(
        `items/reports?limit=-1&fields=${encodeURIComponent(
          "id,status,created_at,updated_at"
        )}`
      ),
    ]);

    const totalUsers = users.length;
    const totalCourses = courses.length;

    const pendingCourseReviews = courses.filter(
      (course) => normalizeStatus(course.status) === "pending_review"
    ).length;

    const refundsPending = refunds.filter(
      (item) => normalizeStatus(item.status) === "pending"
    ).length;

    const payoutsPending = payouts.filter((item) => {
      const status = normalizeStatus(item.status);
      return status === "pending" || status === "approved_not_paid";
    }).length;

    const reportsPending = reports.filter(
      (item) => normalizeStatus(item.status) === "open"
    ).length;

    const paidStatuses = new Set(["paid", "success", "completed"]);
    const pendingPaymentStatuses = new Set(["pending", "failed", "processing"]);

    const totalRevenueAll = orders.reduce((sum, order) => {
      const status = normalizeStatus(order.status);
      if (!paidStatuses.has(status)) return sum;
      return sum + Number(order.total ?? 0);
    }, 0);

    const currentRevenue = orders.reduce((sum, order) => {
      const status = normalizeStatus(order.status);
      if (!paidStatuses.has(status)) return sum;
      const createdAt = pickDate(order, ["created_at"]);
      if (!isWithin(createdAt, startCurrent, now)) return sum;
      return sum + Number(order.total ?? 0);
    }, 0);

    const previousRevenue = orders.reduce((sum, order) => {
      const status = normalizeStatus(order.status);
      if (!paidStatuses.has(status)) return sum;
      const createdAt = pickDate(order, ["created_at"]);
      if (!isWithin(createdAt, startPrevious, startCurrent)) return sum;
      return sum + Number(order.total ?? 0);
    }, 0);

    const currentNewUsers = 0;
    const previousNewUsers = 0;

    const currentNewCourses = courses.filter((course) =>
      isWithin(pickDate(course, ["created_at", "updated_at"]), startCurrent, now)
    ).length;
    const previousNewCourses = courses.filter((course) =>
      isWithin(
        pickDate(course, ["created_at", "updated_at"]),
        startPrevious,
        startCurrent
      )
    ).length;

    const currentActiveStudentSet = new Set<string>();
    const previousActiveStudentSet = new Set<string>();

    enrollments.forEach((enrollment) => {
      const date = pickDate(enrollment, ["updated_at", "created_at", "started_at"]);
      if (!date || !enrollment.student) return;
      if (isWithin(date, startCurrent, now)) {
        currentActiveStudentSet.add(enrollment.student);
      } else if (isWithin(date, startPrevious, startCurrent)) {
        previousActiveStudentSet.add(enrollment.student);
      }
    });

    const activeStudents = currentActiveStudentSet.size;
    const previousActiveStudents = previousActiveStudentSet.size;

    const progressValues = enrollments
      .map((e) => Number(e.progress ?? 0))
      .filter((v) => v >= 0);
    const avgCompletion =
      progressValues.length > 0
        ? progressValues.reduce((sum, v) => sum + v, 0) / progressValues.length
        : 0;

    // Monthly data (12 tháng)
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
      const date = pickDate(e, ["started_at", "created_at", "updated_at"]);
      if (!date) return;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const bucket = monthMap[key];
      if (!bucket) return;

      const progressValue = Number(e.progress ?? 0);
      if (progressValue > 0) {
        bucket.activeStudents += 1;
        bucket.completionRates.push(progressValue);
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

    // Top courses
    const courseMap = new Map<number, DirectusCourse>();
    courses.forEach((course) => {
      if (course.id != null) {
        courseMap.set(course.id, course);
      }
    });

    const courseStats = new Map<
      number,
      { students: number; completionSum: number; revenue: number }
    >();

    enrollments.forEach((e) => {
      if (e.course == null) return;
      const stat = courseStats.get(e.course) || {
        students: 0,
        completionSum: 0,
        revenue: 0,
      };
      stat.students += 1;
      stat.completionSum += Number(e.progress ?? 0);
      courseStats.set(e.course, stat);
    });

    orders.forEach((order) => {
      const status = normalizeStatus(order.status);
      if (!paidStatuses.has(status)) return;
      if (order.course_id == null) return;
      const stat = courseStats.get(order.course_id) || {
        students: 0,
        completionSum: 0,
        revenue: 0,
      };
      stat.revenue += Number(order.total ?? 0);
      courseStats.set(order.course_id, stat);
    });

    const topCourses = Array.from(courseStats.entries())
      .map(([courseId, stat]) => {
        const course = courseMap.get(courseId);
        const avgCourseCompletion =
          stat.students > 0 ? stat.completionSum / stat.students : 0;
        const fallbackRevenue =
          stat.revenue > 0
            ? stat.revenue
            : Number(course?.price ?? 0) * stat.students;
        const revenueValue = stat.revenue > 0 ? stat.revenue : fallbackRevenue;
        return {
          name: course?.title ?? `Khoá #${courseId}`,
          students: stat.students,
          completion: Math.round(avgCourseCompletion),
          revenue: `₫${Math.max(0, revenueValue).toLocaleString("vi-VN")}`,
          _sort: Math.max(0, revenueValue),
        };
      })
      .sort((a, b) => b._sort - a._sort)
      .slice(0, 4)
      .map(({ _sort, ...rest }) => rest);

    // Recent activities
    const userMap = new Map<string, string>();
    users.forEach((user) => {
      const name =
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.email ||
        `Học viên #${user.id}`;
      userMap.set(user.id, name);
    });

    const enrollmentActivities: ActivityItem[] = enrollments
      .map((enrollment) => {
        const date = pickDate(enrollment, ["created_at", "started_at", "updated_at"]);
        if (!date) return null;
        const studentName = enrollment.student
          ? userMap.get(enrollment.student) ?? `Học viên #${enrollment.student}`
          : "Học viên";
        const courseTitle =
          enrollment.course != null
            ? courseMap.get(enrollment.course)?.title ?? `Khoá #${enrollment.course}`
            : "Khoá học";
        return {
          id: `enroll-${enrollment.id}`,
          type: "user",
          title: `${studentName} đăng ký khóa học \"${courseTitle}\"`,
          time: timeAgoVi(date, now),
          _date: date,
        };
      })
      .filter(Boolean) as ActivityItem[];

    const courseActivities: ActivityItem[] = courses
      .map((course) => {
        const date = pickDate(course, ["updated_at", "created_at"]);
        if (!date) return null;
        const status = normalizeStatus(course.status);
        if (status !== "pending_review" && status !== "published") return null;
        const teacher = course.teacher_name ? `Giảng viên ${course.teacher_name}` : "Giảng viên";
        const title =
          status === "pending_review"
            ? `${teacher} đã gửi duyệt khóa học \"${course.title ?? "Khoá học"}\"`
            : `Khóa học \"${course.title ?? "Khoá học"}\" được xuất bản`;
        return {
          id: `course-${course.id}`,
          type: "course",
          title,
          time: timeAgoVi(date, now),
          _date: date,
        };
      })
      .filter(Boolean) as ActivityItem[];

    const recentActivities = [...enrollmentActivities, ...courseActivities]
      .sort((a, b) => (b._date?.getTime() ?? 0) - (a._date?.getTime() ?? 0))
      .slice(0, 12)
      .map(({ _date, ...rest }) => rest);

    return NextResponse.json({
      totalUsers,
      totalCourses,
      activeStudents,
      totalRevenue: totalRevenueAll,
      avgCompletion,
      monthlyData,
      topCourses,
      recentActivities,
      pendingCourseReviews,
      refundsPending,
      payoutsPending,
      reportsPending,
      pendingPayments: orders.filter((order) =>
        pendingPaymentStatuses.has(normalizeStatus(order.status))
      ).length,
      trend: {
        totalUsers: calcTrend(currentNewUsers, previousNewUsers),
        totalCourses: calcTrend(currentNewCourses, previousNewCourses),
        activeStudents: calcTrend(activeStudents, previousActiveStudents),
        totalRevenue: calcTrend(currentRevenue, previousRevenue),
      },
    });
  } catch (error: any) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { message: error?.message || "Không lấy được dữ liệu dashboard" },
      { status: 500 }
    );
  }
}
