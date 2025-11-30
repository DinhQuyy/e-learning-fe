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
  Clock
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const stats = [
  {
    title: 'Tổng Người dùng',
    value: '1,250',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'blue',
  },
  {
    title: 'Tổng khoá học',
    value: '45',
    change: '+3',
    trend: 'up',
    icon: BookOpen,
    color: 'green',
  },
  {
    title: 'Doanh thu',
    value: '₫125M',
    change: '+8.2%',
    trend: 'up',
    icon: DollarSign,
    color: 'purple',
  },
  {
    title: 'Học viên còn hoạt động',
    value: '980',
    change: '-2.4%',
    trend: 'down',
    icon: TrendingUp,
    color: 'orange',
  },
];

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

const topCourses = [
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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Chào mừng trở lại!
        </p>
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
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[stat.color as keyof typeof colors]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
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
            <h2 className="text-xl font-bold text-gray-900">Các hoạt động gần đây</h2>
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
                      <p className="text-sm text-gray-900">{activity.title}</p>
                      <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
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
                    <div className="text-sm text-gray-900">{course.students}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{course.revenue}</div>
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