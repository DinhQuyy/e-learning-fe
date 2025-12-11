'use client';

import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Activity,
  UserCheck,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

type AnalyticsResponse = {
  totalUsers: number;
  activeStudents: number;
  totalCourses: number;
  avgCompletion: number;
  monthlyData: {
    month: string;
    activeStudents: number;
    completionRate: number;
    activeCourses: number;
  }[];
  topCourses: {
    name: string;
    students: number;
    completion: number; // 0–100
    revenue: string; // "₫398.000"
  }[];
  // nếu route.ts của bạn có thêm các field khác (totalEnrollments, …) thì để cũng không sao
};

// ===== MOCK RECENT ACTIVITIES (chưa có log thật) =====
const recentActivities = [
  {
    id: 1,
    type: 'user',
    title: 'Nguyễn Văn A đăng ký khóa học "Next.js Advanced"',
    time: '5 phút trước',
    icon: UserCheck,
  },
  {
    id: 2,
    type: 'course',
    title: 'Khóa học "React Fundamentals" được xuất bản',
    time: '1 giờ trước',
    icon: BookOpen,
  },
  {
    id: 3,
    type: 'user',
    title: 'Trần Thị B hoàn thành khóa học "TypeScript Basics"',
    time: '2 giờ trước',
    icon: Activity,
  },
  {
    id: 4,
    type: 'system',
    title: 'Hệ thống được cập nhật phiên bản mới',
    time: '3 giờ trước',
    icon: Clock,
  },
];

// ===== MOCK TOP COURSES (fallback khi API lỗi) =====
const MOCK_TOP_COURSES = [
  {
    id: 1,
    title: 'Next.js Full Stack Development',
    students: 320,
    revenue: '₫45M',
    rating: 4.8,
  },
  {
    id: 2,
    title: 'React Native Mobile Apps',
    students: 280,
    revenue: '₫38M',
    rating: 4.7,
  },
  {
    id: 3,
    title: 'TypeScript Mastery',
    students: 250,
    revenue: '₫32M',
    rating: 4.9,
  },
  {
    id: 4,
    title: 'Node.js Backend Development',
    students: 220,
    revenue: '₫28M',
    rating: 4.6,
  },
];

function calcTrend(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return 0;
    return 100; // từ 0 → >0 thì xem như +100%
  }
  return ((current - previous) / Math.abs(previous)) * 100;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setError(null);
        const res = await fetch('/api/admin/analytics');
        const json = await res.json().catch(() => null);

        if (!res.ok || !json) {
          throw new Error(
            (json as any)?.message || 'Không lấy được dữ liệu analytics',
          );
        }

        setAnalytics(json as AnalyticsResponse);
      } catch (err: any) {
        console.error('Dashboard analytics error:', err);
        setError(err?.message || 'Không lấy được dữ liệu analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ===== BIẾN TÓM TẮT =====
  const totalUsers = analytics?.totalUsers ?? 0;
  const totalCourses = analytics?.totalCourses ?? 0;
  const activeStudents = analytics?.activeStudents ?? 0;

  const monthlyData = analytics?.monthlyData ?? [];

  const hasHistory = monthlyData.length >= 2;
  const lastMonth = hasHistory
    ? monthlyData[monthlyData.length - 1]
    : monthlyData[monthlyData.length - 1] ?? {
        activeStudents: 0,
        completionRate: 0,
        activeCourses: 0,
      };
  const prevMonth = hasHistory
    ? monthlyData[monthlyData.length - 2]
    : lastMonth;

  // Trend cho dashboard (đơn giản, dùng dữ liệu tháng cuối vs tháng trước)
  const activeTrend = calcTrend(
    lastMonth.activeStudents || 0,
    prevMonth.activeStudents || 0,
  );
  const coursesTrend = calcTrend(
    lastMonth.activeCourses || 0,
    prevMonth.activeCourses || 0,
  );
  const usersTrend = activeTrend; // tạm dùng cùng trend với active students

  // Tổng doanh thu = tổng revenue của topCourses từ API
  const totalRevenueNumber = useMemo(() => {
    if (!analytics?.topCourses?.length) return 0;
    return analytics.topCourses.reduce((sum, course) => {
      // revenue dạng "₫398.000" → chỉ lấy số
      const digits = course.revenue.replace(/[^\d]/g, '');
      const value = parseInt(digits || '0', 10);
      return sum + value;
    }, 0);
  }, [analytics]);

  const totalRevenueText = loading
    ? '...'
    : '₫' + totalRevenueNumber.toLocaleString('vi-VN');

  // Trend doanh thu: vì chưa có dữ liệu theo tháng nên dùng đơn giản:
  const revenueTrend = totalRevenueNumber > 0 ? 100 : 0;

  const formatTrend = (v: number) =>
    `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;

  // ===== TOP COURSES CHO BẢNG =====
  const topCourses =
    analytics && analytics.topCourses?.length
      ? analytics.topCourses.map((c, index) => ({
          id: index + 1,
          title: c.name,
          students: c.students,
          revenue: c.revenue,
          // quy đổi completion (0–100) ra rating (0–5)
          rating: parseFloat((c.completion / 20).toFixed(1)),
        }))
      : MOCK_TOP_COURSES;

  // ===== STATS ARRAY (DÙNG DỮ LIỆU THẬT) =====
  const stats = [
    {
      title: 'Tổng Người dùng',
      value: loading ? '...' : totalUsers.toLocaleString('vi-VN'),
      change: formatTrend(usersTrend),
      trend: usersTrend >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Tổng khoá học',
      value: loading ? '...' : totalCourses.toString(),
      change: formatTrend(coursesTrend),
      trend: coursesTrend >= 0 ? 'up' : 'down',
      icon: BookOpen,
      color: 'green',
    },
    {
      title: 'Doanh thu',
      value: totalRevenueText,
      change: formatTrend(revenueTrend),
      trend: revenueTrend >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'purple',
    },
    {
      title: 'Học viên còn hoạt động',
      value: loading ? '...' : activeStudents.toString(),
      change: formatTrend(activeTrend),
      trend: activeTrend >= 0 ? 'up' : 'down',
      icon: TrendingUp,
      color: 'orange',
    },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Chào mừng trở lại!</p>
        {error && (
          <p className="mt-1 text-sm text-orange-600">
            {error} — đang hiển thị một phần dữ liệu mẫu.
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
          };

          return (
            <div
              key={stat.title}
              className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    colors[stat.color as keyof typeof colors]
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="mb-1 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Các hoạt động gần đây
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 transition-colors rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {activity.title}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Xem tất cả hoạt động →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Truy cập nhanh</h2>
          </div>
          <div className="p-6 space-y-3">
            <Link
              href="/dashboard/users"
              className="block w-full px-4 py-3 font-medium text-center text-blue-700 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
            >
              <Users className="inline-block w-5 h-5 mr-2" />
              Quản lý Người dùng
            </Link>
            <Link
              href="/dashboard/courses"
              className="block w-full px-4 py-3 font-medium text-center text-green-700 transition-colors rounded-lg bg-green-50 hover:bg-green-100"
            >
              <BookOpen className="inline-block w-5 h-5 mr-2" />
              Quản lý Khoá học
            </Link>
            <Link
              href="/dashboard/analytics"
              className="block w-full px-4 py-3 font-medium text-center text-purple-700 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100"
            >
              <TrendingUp className="inline-block w-5 h-5 mr-2" />
              Thống kê Phân tích
            </Link>
          </div>
        </div>
      </div>

      {/* Top Courses */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Top Khoá Học Nổi Trội</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Khoá học
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Học viên
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Đánh giá
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {course.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {course.students}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {course.revenue}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900">
                        {course.rating}
                      </span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
