'use client';

import {
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  Activity,
  ArrowUp,
  ArrowDown,
  ShoppingCart,
  CreditCard,
  Clock,
  RotateCcw,
  Wallet,
  Banknote,
  Receipt,
  Landmark,
  TicketPercent,
  ClipboardList,
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

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

type StatTone = 'blue' | 'green' | 'purple' | 'orange';

type StatItem = {
  label: string;
  value: number;
  note: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone: StatTone;
  format: 'number' | 'currency';
};

type AnalyticsTabId =
  | 'learning-analytics'
  | 'orders-transactions'
  | 'revenue-payouts'
  | 'coupons'
  | 'audit-logs';

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

const ANALYTICS_TABS: { id: AnalyticsTabId; label: string }[] = [
  { id: 'learning-analytics', label: 'Thống kê học tập' },
  { id: 'orders-transactions', label: 'Đơn hàng & giao dịch' },
  { id: 'revenue-payouts', label: 'Doanh thu & chi trả' },
  { id: 'coupons', label: 'Mã giảm giá' },
  { id: 'audit-logs', label: 'Nhật ký kiểm toán' },
];

const ORDER_SUMMARY: StatItem[] = [
  {
    label: 'Tổng đơn hàng',
    value: 1284,
    note: '30 ngày gần đây',
    icon: ShoppingCart,
    tone: 'blue',
    format: 'number',
  },
  {
    label: 'Giao dịch thành công',
    value: 1156,
    note: 'Tỷ lệ 90%',
    icon: CreditCard,
    tone: 'green',
    format: 'number',
  },
  {
    label: 'Đang chờ xử lý',
    value: 68,
    note: 'Cần đối soát',
    icon: Clock,
    tone: 'orange',
    format: 'number',
  },
  {
    label: 'Hoàn tiền',
    value: 12,
    note: 'Trong tháng',
    icon: RotateCcw,
    tone: 'purple',
    format: 'number',
  },
];

const REVENUE_SUMMARY: StatItem[] = [
  {
    label: 'Doanh thu gộp',
    value: 245000000,
    note: '30 ngày gần đây',
    icon: Wallet,
    tone: 'blue',
    format: 'currency',
  },
  {
    label: 'Doanh thu ròng',
    value: 198000000,
    note: 'Sau phí nền tảng',
    icon: Banknote,
    tone: 'green',
    format: 'currency',
  },
  {
    label: 'Phí nền tảng',
    value: 47000000,
    note: 'Tỷ lệ 19%',
    icon: Receipt,
    tone: 'purple',
    format: 'currency',
  },
  {
    label: 'Chi trả đang chờ',
    value: 32500000,
    note: 'Xử lý trong 7 ngày',
    icon: Landmark,
    tone: 'orange',
    format: 'currency',
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: 'OD-1024',
    student: 'Nguyễn Minh Anh',
    course: 'React nâng cao',
    method: 'VNPay',
    amount: 1290000,
    status: 'Thành công',
    date: '24/01/2026',
  },
  {
    id: 'OD-1023',
    student: 'Trần Ngọc Hà',
    course: 'UI/UX cơ bản',
    method: 'Momo',
    amount: 890000,
    status: 'Đang chờ',
    date: '23/01/2026',
  },
  {
    id: 'OD-1022',
    student: 'Lê Gia Bảo',
    course: 'Next.js Full Stack',
    method: 'ZaloPay',
    amount: 1590000,
    status: 'Thành công',
    date: '22/01/2026',
  },
  {
    id: 'OD-1021',
    student: 'Phạm Thảo Vy',
    course: 'Phân tích dữ liệu',
    method: 'Chuyển khoản',
    amount: 990000,
    status: 'Hoàn tiền',
    date: '20/01/2026',
  },
  {
    id: 'OD-1020',
    student: 'Hoàng Minh Quân',
    course: 'Python cơ bản',
    method: 'VNPay',
    amount: 590000,
    status: 'Thất bại',
    date: '19/01/2026',
  },
];

const MOCK_PAYOUTS = [
  {
    id: 'PO-2026-01',
    instructor: 'Trần Hải Nam',
    period: '01/01 - 15/01',
    amount: 12500000,
    status: 'Đang xử lý',
    eta: '31/01/2026',
  },
  {
    id: 'PO-2026-02',
    instructor: 'Nguyễn Khánh Linh',
    period: '01/01 - 15/01',
    amount: 9800000,
    status: 'Chờ duyệt',
    eta: '30/01/2026',
  },
  {
    id: 'PO-2025-12',
    instructor: 'Phạm Quốc Bảo',
    period: '16/12 - 31/12',
    amount: 15200000,
    status: 'Đã chi trả',
    eta: '05/01/2026',
  },
];

const MOCK_COUPONS = [
  {
    code: 'TET2026',
    type: 'Giảm %',
    value: '20%',
    usage: '120/500',
    status: 'Đang áp dụng',
    expires: '10/02/2026',
  },
  {
    code: 'WELCOME2026',
    type: 'Giảm giá cố định',
    value: '100.000₫',
    usage: '320/1000',
    status: 'Đang áp dụng',
    expires: '30/06/2026',
  },
  {
    code: 'FLASH50',
    type: 'Giảm giá cố định',
    value: '50.000₫',
    usage: '85/200',
    status: 'Sắp hết hạn',
    expires: '05/02/2026',
  },
  {
    code: 'STUDENT10',
    type: 'Giảm %',
    value: '10%',
    usage: '560/1000',
    status: 'Tạm dừng',
    expires: '31/12/2026',
  },
];

const MOCK_AUDIT_LOGS = [
  {
    time: '26/01/2026 14:20',
    actor: 'Admin',
    action: 'Cập nhật giá khóa học',
    target: 'React nâng cao',
    note: 'Tăng 10% phí khóa học',
  },
  {
    time: '26/01/2026 09:12',
    actor: 'Hệ thống',
    action: 'Đối soát giao dịch',
    target: 'Kỳ thanh toán 01/2026',
    note: 'Đã khớp 98% giao dịch',
  },
  {
    time: '25/01/2026 18:45',
    actor: 'Admin',
    action: 'Tạo mã giảm giá',
    target: 'TET2026',
    note: 'Áp dụng cho toàn bộ khóa học',
  },
  {
    time: '25/01/2026 13:30',
    actor: 'Admin',
    action: 'Khóa giao dịch',
    target: 'OD-1020',
    note: 'Thanh toán thất bại - chờ xử lý',
  },
  {
    time: '24/01/2026 08:20',
    actor: 'Hệ thống',
    action: 'Chi trả giảng viên',
    target: 'PO-2025-12',
    note: 'Đã chuyển khoản thành công',
  },
];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] =
    useState<AnalyticsTabId>('learning-analytics');
  const searchParams = useSearchParams();
  const [ordersFilter, setOrdersFilter] = useState<'all' | 'pending' | 'refunds' | 'failed'>('all');
  const [payoutsFilter, setPayoutsFilter] = useState<'all' | 'pending'>('all');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ANALYTICS_TABS.some((tab) => tab.id === tabParam)) {
      setActiveTab(tabParam as AnalyticsTabId);
    }

    const ordersParam = searchParams.get('orders');
    if (ordersParam === 'pending' || ordersParam === 'refunds' || ordersParam === 'failed') {
      setOrdersFilter(ordersParam);
    } else if (ordersParam === 'all') {
      setOrdersFilter('all');
    }

    const payoutsParam = searchParams.get('payouts');
    if (payoutsParam === 'pending') {
      setPayoutsFilter('pending');
    } else if (payoutsParam === 'all') {
      setPayoutsFilter('all');
    }
  }, [searchParams]);


  // Hiển thị mặc định: 12 tháng gần đây (tất cả tháng backend trả về)
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
            (json as any)?.message || 'Không lấy được dữ liệu phân tích';
          throw new Error(msg);
        }

        setAnalytics(json as AnalyticsResponse);
      } catch (err: any) {
        console.error('AnalyticsPage error:', err);
        setError(err?.message || 'Không lấy được dữ liệu phân tích');
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

  const formatCurrency = (value: number) =>
    `${value.toLocaleString('vi-VN')} ₫`;

  const transactionStatusStyles: Record<string, string> = {
    'Thành công': 'bg-green-100 text-green-700',
    'Đang chờ': 'bg-amber-100 text-amber-700',
    'Thất bại': 'bg-red-100 text-red-700',
    'Hoàn tiền': 'bg-slate-100 text-slate-700',
  };

  const payoutStatusStyles: Record<string, string> = {
    'Đang xử lý': 'bg-blue-100 text-blue-700',
    'Chờ duyệt': 'bg-amber-100 text-amber-700',
    'Đã chi trả': 'bg-green-100 text-green-700',
  };

  const couponStatusStyles: Record<string, string> = {
    'Đang áp dụng': 'bg-green-100 text-green-700',
    'Sắp hết hạn': 'bg-amber-100 text-amber-700',
    'Tạm dừng': 'bg-slate-100 text-slate-700',
  };

  const orderFilters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Đang chờ' },
    { id: 'refunds', label: 'Hoàn tiền' },
    { id: 'failed', label: 'Thất bại' },
  ] as const;

  const payoutFilters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ chi trả' },
  ] as const;

  const filteredTransactions = useMemo(() => {
    if (ordersFilter === 'all') return MOCK_TRANSACTIONS;
    const statusMap = {
      pending: 'Đang chờ',
      refunds: 'Hoàn tiền',
      failed: 'Thất bại',
    } as const;
    const target = statusMap[ordersFilter];
    return MOCK_TRANSACTIONS.filter((item) => item.status === target);
  }, [ordersFilter]);

  const filteredPayouts = useMemo(() => {
    if (payoutsFilter === 'all') return MOCK_PAYOUTS;
    return MOCK_PAYOUTS.filter(
      (item) => item.status === 'Đang xử lý' || item.status === 'Chờ duyệt'
    );
  }, [payoutsFilter]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Phân tích &amp; Tài chính
          </h1>
          <p className="mt-2 text-gray-600">
            Theo dõi học tập, đơn hàng và dòng tiền trên toàn hệ thống
          </p>
          {activeTab === 'learning-analytics' && error && (
            <p className="mt-2 text-sm text-orange-600">
              {error} — đang hiển thị dữ liệu mẫu để demo.
            </p>
          )}
        </div>

        {activeTab === 'learning-analytics' && (
          <div className="flex flex-wrap items-center gap-3">
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
              <option value="365">12 tháng gần đây</option>
            </select>
            <button className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
              Xuất báo cáo
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {ANALYTICS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'learning-analytics' && (
        <div className="space-y-6">
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
      )}

      {activeTab === 'orders-transactions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ORDER_SUMMARY.map((item) => (
              <InfoCard
                key={item.label}
                title={item.label}
                value={
                  item.format === 'currency'
                    ? formatCurrency(item.value)
                    : item.value.toLocaleString('vi-VN')
                }
                description={item.note}
                icon={item.icon}
                tone={item.tone}
              />
            ))}

          </div>

          <div className="flex flex-wrap gap-2">
            {orderFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setOrdersFilter(filter.id)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  ordersFilter === filter.id
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}

          </div>

          

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Đơn hàng &amp; giao dịch gần đây
                </h2>
                <p className="text-sm text-gray-500">
                  Theo dõi thanh toán, đối soát và hoàn tiền.
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Xuất danh sách
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase border-b">
                  <tr>
                    <th className="pb-3 text-left">Mã đơn</th>
                    <th className="pb-3 text-left">Học viên</th>
                    <th className="pb-3 text-left">Khoá học</th>
                    <th className="pb-3 text-left">Phương thức</th>
                    <th className="pb-3 text-right">Số tiền</th>
                    <th className="pb-3 text-left">Trạng thái</th>
                    <th className="pb-3 text-right">Ngày</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="text-gray-700">
                      <td className="py-3 font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="py-3">{transaction.student}</td>
                      <td className="py-3">{transaction.course}</td>
                      <td className="py-3">{transaction.method}</td>
                      <td className="py-3 text-right">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            transactionStatusStyles[transaction.status] ??
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">{transaction.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'revenue-payouts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {REVENUE_SUMMARY.map((item) => (
              <InfoCard
                key={item.label}
                title={item.label}
                value={formatCurrency(item.value)}
                description={item.note}
                icon={item.icon}
                tone={item.tone}
              />
            ))}

          </div>

          <div className="flex flex-wrap gap-2">
            {payoutFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setPayoutsFilter(filter.id)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  payoutsFilter === filter.id
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Lịch chi trả cho giảng viên
                </h2>
                <p className="text-sm text-gray-500">
                  Theo dõi các đợt chi trả và trạng thái phê duyệt.
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Tạo kỳ chi trả
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase border-b">
                  <tr>
                    <th className="pb-3 text-left">Mã kỳ</th>
                    <th className="pb-3 text-left">Giảng viên</th>
                    <th className="pb-3 text-left">Thời gian</th>
                    <th className="pb-3 text-right">Số tiền</th>
                    <th className="pb-3 text-left">Trạng thái</th>
                    <th className="pb-3 text-right">Dự kiến</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPayouts.map((payout) => (
                    <tr key={payout.id} className="text-gray-700">
                      <td className="py-3 font-medium text-gray-900">
                        {payout.id}
                      </td>
                      <td className="py-3">{payout.instructor}</td>
                      <td className="py-3">{payout.period}</td>
                      <td className="py-3 text-right">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            payoutStatusStyles[payout.status] ??
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">{payout.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 text-blue-600 bg-blue-50 rounded-full">
                  <TicketPercent className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Quản lý mã giảm giá
                  </h2>
                  <p className="text-sm text-gray-500">
                    Theo dõi hiệu quả và thời hạn mã khuyến mãi.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Tạo mã mới
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Nhập mã
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase border-b">
                  <tr>
                    <th className="pb-3 text-left">Mã</th>
                    <th className="pb-3 text-left">Loại</th>
                    <th className="pb-3 text-left">Giá trị</th>
                    <th className="pb-3 text-left">Đã dùng</th>
                    <th className="pb-3 text-left">Trạng thái</th>
                    <th className="pb-3 text-right">Hết hạn</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {MOCK_COUPONS.map((coupon) => (
                    <tr key={coupon.code} className="text-gray-700">
                      <td className="py-3 font-medium text-gray-900">
                        {coupon.code}
                      </td>
                      <td className="py-3">{coupon.type}</td>
                      <td className="py-3">{coupon.value}</td>
                      <td className="py-3">{coupon.usage}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            couponStatusStyles[coupon.status] ??
                            'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {coupon.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">{coupon.expires}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit-logs' && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Nhật ký kiểm toán
                </h2>
                <p className="text-sm text-gray-500">
                  Ghi nhận thay đổi quan trọng trong 7 ngày gần nhất.
                </p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Xuất log
              </button>
            </div>

            <div className="space-y-4">
              {MOCK_AUDIT_LOGS.map((log, index) => (
                <div
                  key={`${log.time}-${index}`}
                  className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 text-blue-600 bg-blue-50 rounded-full">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {log.action}
                      </p>
                      <p className="text-sm text-gray-600">
                        {log.actor} · {log.target}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{log.note}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== SUMMARY CARD COMPONENT =====

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: StatTone;
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
  const colors: Record<StatTone, string> = {
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

type InfoCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone?: StatTone;
};

function InfoCard({
  title,
  value,
  description,
  icon: Icon,
  tone = 'blue',
}: InfoCardProps) {
  const colors: Record<StatTone, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[tone]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="mb-1 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="mt-2 text-xs text-gray-500">{description}</p>
    </div>
  );
}
