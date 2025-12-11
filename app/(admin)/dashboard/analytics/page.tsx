'use client';

import {
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
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
    completion: number;
    revenue: string;
  }[];
  totalEnrollments: number;
  monthlyEnrollments: number;
  monthlyCompletedEnrollments: number;
  monthlyAvgCompletion: number;
};

// ===== MOCK FALLBACK DATA (dùng khi API không có dữ liệu) =====

const MOCK_MONTHLY_DATA: AnalyticsResponse['monthlyData'] = [
  { month: 'Jan', activeStudents: 50, completionRate: 40, activeCourses: 3 },
  { month: 'Feb', activeStudents: 55, completionRate: 42, activeCourses: 3 },
  { month: 'Mar', activeStudents: 60, completionRate: 45, activeCourses: 4 },
  { month: 'Apr', activeStudents: 72, completionRate: 55, activeCourses: 4 },
  { month: 'May', activeStudents: 80, completionRate: 60, activeCourses: 5 },
  { month: 'Jun', activeStudents: 90, completionRate: 70, activeCourses: 5 },
];

const MOCK_TOP_COURSES: AnalyticsResponse['topCourses'] = [
  {
    name: 'Next.js Full Stack',
    students: 50,
    completion: 85,
    revenue: '₫45M',
  },
  {
    name: 'React Native Apps',
    students: 40,
    completion: 78,
    revenue: '₫38M',
  },
  {
    name: 'TypeScript Mastery',
    students: 30,
    completion: 92,
    revenue: '₫32M',
  },
];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hiển thị mặc định: Năm trước (tất cả tháng backend trả về)
  const [range, setRange] = useState<'7' | '30' | '90' | '365'>('365');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setError(null);
        const res = await fetch('/api/admin/analytics');
        const json = (await res.json().catch(() => null)) as
          | AnalyticsResponse
          | { message?: string }
          | null;

        if (!res.ok || !json) {
          const msg =
            (json as any)?.message || 'Không lấy được dữ liệu analytics';
          throw new Error(msg);
        }

        setAnalytics(json as AnalyticsResponse);
      } catch (err: any) {
        console.error('AnalyticsPage error:', err);
        setError(err?.message || 'Không lấy được dữ liệu analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Dùng dữ liệu thật nếu có, nếu không sẽ fallback qua mock
  const monthlyData =
    analytics && analytics.monthlyData?.length
      ? analytics.monthlyData
      : MOCK_MONTHLY_DATA;

  const topCourses =
    analytics && analytics.topCourses?.length
      ? analytics.topCourses
      : MOCK_TOP_COURSES;

  const totalUsers = analytics?.totalUsers ?? 0;
  const activeStudents = analytics?.activeStudents ?? 0;
  const totalCourses = analytics?.totalCourses ?? 0;
  const avgCompletion = analytics?.avgCompletion ?? 0;

  const totalEnrollments = analytics?.totalEnrollments ?? 0;
  const monthlyEnrollments = analytics?.monthlyEnrollments ?? 0;
  const monthlyCompletedEnrollments =
    analytics?.monthlyCompletedEnrollments ?? 0;
  const monthlyAvgCompletion = analytics?.monthlyAvgCompletion ?? 0;

  // Quy đổi tiến độ trung bình trong tháng (0–100%) -> đánh giá (0–5)
  const avgRating =
    monthlyAvgCompletion > 0 ? (monthlyAvgCompletion / 20).toFixed(1) : '0.0';

  // ===== TÍNH TREND % TỰ ĐỘNG =====

  const calcTrend = (current: number, previous: number) => {
    if (previous === 0) {
      if (current === 0) return 0;
      // nếu tháng trước = 0, tháng này > 0 => xem như tăng 100%
      return 100;
    }
    return ((current - previous) / Math.abs(previous)) * 100;
  };

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

  // 1) Trend học viên đang hoạt động (dùng trong card 2)
  const activeTrend = calcTrend(
    lastMonth.activeStudents || 0,
    prevMonth.activeStudents || 0,
  );

  // 2) Trend tiến độ trung bình (card 3)
  const progressTrend = calcTrend(
    lastMonth.completionRate || 0,
    prevMonth.completionRate || 0,
  );

  // 3) Trend khoá học đang hoạt động (card 4)
  const courseTrend = calcTrend(
    lastMonth.activeCourses || 0,
    prevMonth.activeCourses || 0,
  );

  // 4) Trend tổng số học viên (card 1) – tạm dùng cùng trend với activeStudents
  const totalUsersTrend = activeTrend;

  // 5) Trend tổng ghi danh trong tháng (card dưới cùng 1)
  const monthlyEnrollTrend =
    totalEnrollments === 0
      ? 0
      : (monthlyEnrollments / totalEnrollments) * 100;

  // 6) Trend khoá học hoàn thành trong tháng (card dưới cùng 2)
  const monthlyCompletedTrend =
    monthlyEnrollments === 0
      ? 0
      : (monthlyCompletedEnrollments / monthlyEnrollments) * 100;

  // 7) Trend đánh giá trung bình (card dưới cùng 3)
  const ratingTrend =
    avgCompletion === 0
      ? 0
      : ((monthlyAvgCompletion - avgCompletion) / avgCompletion) * 100;

  // Lọc dữ liệu theo range đang chọn
  const filteredMonthlyData = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) return [];

    switch (range) {
      case '7':
        return monthlyData.slice(-1);
      case '30':
        return monthlyData.slice(-3);
      case '90':
        return monthlyData.slice(-6);
      case '365':
      default:
        return monthlyData;
    }
  }, [monthlyData, range]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">
            Thống kê học viên, tiến độ và các khoá học đang hoạt động
          </p>
          {error && (
            <p className="mt-2 text-sm text-orange-600">
              {error} — đang hiển thị dữ liệu mẫu để demo.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={range}
            onChange={(e) =>
              setRange(e.target.value as '7' | '30' | '90' | '365')
            }
          >
            <option value="7">7 ngày gần đây</option>
            <option value="30">30 ngày gần đây</option>
            <option value="90">90 ngày gần đây</option>
            <option value="365">Năm trước</option>
          </select>
          <button className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Tổng số học viên"
          value={loading ? '...' : totalUsers.toLocaleString('vi-VN')}
          description="Tất cả học viên đã đăng ký"
          icon={Users}
          color="blue"
          trend={totalUsersTrend >= 0 ? 'up' : 'down'}
          trendLabel={`${totalUsersTrend >= 0 ? '+' : ''}${totalUsersTrend.toFixed(1)}%`}
        />

        <SummaryCard
          title="Học viên đang hoạt động"
          value={loading ? '...' : activeStudents.toLocaleString('vi-VN')}
          description="Đăng nhập & học trong 30 ngày gần nhất"
          icon={Activity}
          color="green"
          trend={activeTrend >= 0 ? 'up' : 'down'}
          trendLabel={`${activeTrend >= 0 ? '+' : ''}${activeTrend.toFixed(1)}%`}
        />

        <SummaryCard
          title="Tiến độ trung bình"
          value={loading ? '...' : `${avgCompletion.toFixed(1)}%`}
          description="Tỷ lệ hoàn thành khoá học trung bình"
          icon={BookOpen}
          color="purple"
          trend={progressTrend >= 0 ? 'up' : 'down'}
          trendLabel={`${progressTrend >= 0 ? '+' : ''}${progressTrend.toFixed(1)}%`}
        />

        <SummaryCard
          title="Khoá học đang hoạt động"
          value={loading ? '...' : totalCourses.toString()}
          description="Khoá đang mở ghi danh"
          icon={TrendingUp}
          color="orange"
          trend={courseTrend >= 0 ? 'up' : 'down'}
          trendLabel={`${courseTrend >= 0 ? '+' : ''}${courseTrend.toFixed(1)}%`}
        />
      </div>

      {/* Middle section: left chart + right top courses */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Biểu đồ tăng trưởng học viên đang hoạt động */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Biểu đồ tăng trưởng học viên đang hoạt động
            </h2>
          </div>

          {filteredMonthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-500">
              Chưa có dữ liệu để hiển thị
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMonthlyData.map((data) => {
                const maxActive = Math.max(
                  ...filteredMonthlyData.map((d) => d.activeStudents || 1),
                );
                const percent =
                  maxActive > 0 ? (data.activeStudents / maxActive) * 100 : 0;

                return (
                  <div
                    key={data.month}
                    className="flex items-center gap-4 text-sm"
                  >
                    <div className="w-12 text-gray-600">{data.month}</div>
                    <div className="flex-1">
                      <div className="relative h-4 overflow-hidden bg-gray-100 rounded-full">
                        <div
                          className="flex items-center h-full overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{ width: `${percent}%` }}
                        >
                          <span className="px-3 text-xs font-medium text-white">
                            {data.activeStudents}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-24 text-xs text-right text-gray-500">
                      {data.activeCourses} khoá
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top courses */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Top các khoá học nổi trội
          </h2>

          {topCourses.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-500">
              Chưa có dữ liệu khoá học
            </div>
          ) : (
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={course.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-blue-600 rounded-full">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {course.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.students} học viên
                        </p>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-gray-700">
                      {course.revenue}
                    </div>
                  </div>

                  <div className="ml-11">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-gray-600">Mức độ hoàn thành</span>
                      <span className="font-medium text-gray-900">
                        {course.completion}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${course.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: tiến độ hoàn thành khoá học theo tháng */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Tiến độ hoàn thành khoá học theo tháng
          </h2>
        </div>

        {filteredMonthlyData.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-gray-500">
            Chưa có dữ liệu để hiển thị
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMonthlyData.map((data) => (
              <div key={data.month} className="flex items-center gap-4">
                <div className="w-12 text-sm text-gray-600">{data.month}</div>
                <div className="flex-1">
                  <div className="relative h-4 overflow-hidden bg-gray-100 rounded-full">
                    <div
                      className="flex items-center h-full overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                      style={{ width: `${data.completionRate}%` }}
                    >
                      <span className="px-3 text-xs font-medium text-white">
                        {data.completionRate.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-32 text-xs text-right text-gray-500">
                  {data.activeCourses} khoá đang mở
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extra stats cards dưới cùng – dùng dữ liệu thật */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Tổng ghi danh trong tháng */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span
              className={`text-sm font-medium ${
                monthlyEnrollTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {`${monthlyEnrollTrend >= 0 ? '+' : ''}${monthlyEnrollTrend.toFixed(
                1,
              )}%`}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : monthlyEnrollments.toLocaleString('vi-VN')}
          </p>
          <p className="mt-1 text-sm text-gray-600">Tổng ghi danh</p>
          <p className="mt-2 text-xs text-gray-500">Trong tháng</p>
        </div>

        {/* Khoá học hoàn thành trong tháng */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 text-green-600" />
            <span
              className={`text-sm font-medium ${
                monthlyCompletedTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {`${monthlyCompletedTrend >= 0 ? '+' : ''}${monthlyCompletedTrend.toFixed(
                1,
              )}%`}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading
              ? '...'
              : monthlyCompletedEnrollments.toLocaleString('vi-VN')}
          </p>
          <p className="mt-1 text-sm text-gray-600">Khoá học hoàn thành</p>
          <p className="mt-2 text-xs text-gray-500">Trong tháng</p>
        </div>

        {/* Đánh giá trung bình (quy đổi từ tiến độ) */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span
              className={`text-sm font-medium ${
                ratingTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {`${ratingTrend >= 0 ? '+' : ''}${ratingTrend.toFixed(1)}%`}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {loading ? '...' : avgRating}
          </p>
          <p className="mt-1 text-sm text-gray-600">Đánh giá trung bình</p>
          <p className="mt-2 text-xs text-gray-500">
            Quy đổi từ tiến độ hoàn thành khoá học
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== SUMMARY CARD COMPONENT =====

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend: 'up' | 'down';
  trendLabel?: string;
};

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend,
  trendLabel,
}: SummaryCardProps) {
  const colors: Record<SummaryCardProps['color'], string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {trend === 'up' ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          {trendLabel && <span>{trendLabel}</span>}
        </div>
      </div>
      <p className="mb-1 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="mt-2 text-xs text-gray-500">{description}</p>
    </div>
  );
}
