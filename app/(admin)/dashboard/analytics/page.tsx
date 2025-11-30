'use client';

import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function AnalyticsPage() {
  // Mock data cho charts
  const monthlyData = [
    { month: 'Jan', users: 850, revenue: 95000000, courses: 38 },
    { month: 'Feb', users: 920, revenue: 105000000, courses: 40 },
    { month: 'Mar', users: 1050, revenue: 118000000, courses: 42 },
    { month: 'Apr', users: 1120, revenue: 125000000, courses: 45 },
    { month: 'May', users: 1180, revenue: 132000000, courses: 45 },
    { month: 'Jun', users: 1250, revenue: 145000000, courses: 48 },
  ];

  const metrics = [
    {
      title: 'User Growth',
      value: '+32.5%',
      description: 'vs last month',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Course Completion',
      value: '78.2%',
      description: 'Average rate',
      trend: 'up',
      icon: BookOpen,
      color: 'green',
    },
    {
      title: 'Revenue Growth',
      value: '+15.8%',
      description: 'vs last month',
      trend: 'up',
      icon: DollarSign,
      color: 'purple',
    },
    {
      title: 'Engagement Rate',
      value: '65.4%',
      description: 'Daily active users',
      trend: 'down',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const topPerformers = [
    {
      name: 'Next.js Full Stack',
      students: 320,
      completion: 85,
      revenue: '₫45M',
    },
    {
      name: 'React Native Apps',
      students: 280,
      completion: 78,
      revenue: '₫38M',
    },
    {
      name: 'TypeScript Mastery',
      students: 250,
      completion: 92,
      revenue: '₫32M',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">
            Thống kê và phân tích chi tiết về hệ thống E-learning
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const colors = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
          };

          return (
            <div
              key={metric.title}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[metric.color as keyof typeof colors]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                </div>
              </div>
              <p className="mb-1 text-2xl font-bold text-gray-900">
                {metric.value}
              </p>
              <p className="text-sm text-gray-600">{metric.title}</p>
              <p className="mt-2 text-xs text-gray-500">{metric.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart Placeholder - Users Growth */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Biểu đồ tăng trưởng người dùng</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-lg">
                Người dùng
              </button>
              <button className="px-3 py-1 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
                Doanh thu
              </button>
            </div>
          </div>
          
          {/* Simple bar chart visualization */}
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center gap-4">
                <div className="w-12 text-sm text-gray-600">{data.month}</div>
                <div className="flex-1">
                  <div className="relative h-8 overflow-hidden bg-gray-100 rounded-full">
                    <div
                      className="flex items-center justify-end h-full pr-3 rounded-full bg-linear-to-r from-blue-500 to-blue-600"
                      style={{ width: `${(data.users / 1250) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        {data.users}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Top các khoá học nổi trội
          </h2>
          <div className="space-y-4">
            {topPerformers.map((course, index) => (
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
                  <p className="mt-1 text-xs text-gray-500">{course.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          Tổng quan về doanh thu qua các tháng
        </h2>
        <div className="space-y-4">
          {monthlyData.map((data) => (
            <div key={data.month} className="flex items-center gap-4">
              <div className="w-12 text-sm text-gray-600">{data.month}</div>
              <div className="flex-1">
                <div className="relative h-8 overflow-hidden bg-gray-100 rounded-full">
                  <div
                    className="flex items-center justify-end h-full pr-3 rounded-full bg-linear-to-r from-purple-500 to-purple-600"
                    style={{ width: `${(data.revenue / 145000000) * 100}%` }}
                  >
                    <span className="text-xs font-medium text-white">
                      ₫{(data.revenue / 1000000).toFixed(0)}M
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-green-600">+8.5%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">1,847</p>
          <p className="mt-1 text-sm text-gray-600">Tổng ghi danh</p>
          <p className="mt-2 text-xs text-gray-500">Trong tháng</p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-600">+12.3%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">456</p>
          <p className="mt-1 text-sm text-gray-600">Khoá học hoàn thành</p>
          <p className="mt-2 text-xs text-gray-500">Trong tháng</p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-green-600">+5.7%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">4.8</p>
          <p className="mt-1 text-sm text-gray-600">Đánh giá trung bình</p>
          <p className="mt-2 text-xs text-gray-500">Tất cả các khoá học</p>
        </div>
      </div>
    </div>
  );
}