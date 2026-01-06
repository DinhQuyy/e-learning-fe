'use client';

import Link from 'next/link';
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Clock,
  Star,
  MessageSquare,
  ArrowRight,
  BarChart3
} from 'lucide-react';

// Mock data
const stats = [
  {
    icon: BookOpen,
    label: 'Khóa học',
    value: '12',
    change: '+2 tháng này',
    color: 'blue',
  },
  {
    icon: Users,
    label: 'Học viên',
    value: '2,847',
    change: '+324 tháng này',
    color: 'green',
  },
  {
    icon: DollarSign,
    label: 'Doanh thu',
    value: '₫245M',
    change: '+18% tháng này',
    color: 'purple',
  },
  {
    icon: Star,
    label: 'Đánh giá TB',
    value: '4.8',
    change: '1,547 reviews',
    color: 'orange',
  },
];

const recentCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    students: 847,
    revenue: '₫45M',
    rating: 4.8,
    reviews: 234,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
  },
  {
    id: 2,
    title: 'React Advanced Patterns',
    students: 523,
    revenue: '₫28M',
    rating: 4.9,
    reviews: 156,
    status: 'published',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
  },
  {
    id: 3,
    title: 'Node.js Backend Mastery',
    students: 412,
    revenue: '₫22M',
    rating: 4.7,
    reviews: 98,
    status: 'draft',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
  },
];

const recentReviews = [
  {
    id: 1,
    student: 'Nguyễn Văn A',
    course: 'Web Development Bootcamp',
    rating: 5,
    comment: 'Khóa học rất tuyệt vời! Giảng viên giải thích rất chi tiết.',
    time: '2 giờ trước',
  },
  {
    id: 2,
    student: 'Trần Thị B',
    course: 'React Advanced',
    rating: 5,
    comment: 'Nội dung chất lượng, rất đáng để học.',
    time: '5 giờ trước',
  },
];

export default function InstructorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Chào mừng trở lại, Giảng viên!
              </p>
            </div>
            <Link
              href="/instructor/courses/new"
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Tạo khóa học mới
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
                orange: 'bg-orange-100 text-orange-600',
              };

              return (
                <div
                  key={index}
                  className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[stat.color as keyof typeof colors]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mb-1 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="mb-2 text-sm text-gray-600">{stat.label}</div>
                  <div className="text-xs font-medium text-green-600">
                    {stat.change}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Courses */}
            <div className="lg:col-span-2">
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Khóa học của tôi
                  </h2>
                  <Link
                    href="/instructor/courses"
                    className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Xem tất cả
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex gap-4 p-4 transition-all border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md"
                    >
                      {/* Thumbnail */}
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="object-cover w-32 h-24 rounded-lg"
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {course.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                              course.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {course.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students} học viên
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            {course.rating} ({course.reviews})
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {course.revenue}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/courses/${course.id}`}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4" />
                            Xem
                          </Link>
                          <Link
                            href={`/instructor/courses/${course.id}/edit`}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                            Chỉnh sửa
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Thao tác nhanh
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/instructor/courses/new"
                    className="block px-4 py-3 font-medium text-blue-700 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
                  >
                    <Plus className="inline-block w-4 h-4 mr-2" />
                    Tạo khóa học mới
                  </Link>
                  <Link
                    href="/instructor/students"
                    className="block px-4 py-3 font-medium text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                  >
                    <Users className="inline-block w-4 h-4 mr-2" />
                    Quản lý học viên
                  </Link>
                  <Link
                    href="/instructor/analytics"
                    className="block px-4 py-3 font-medium text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                  >
                    <BarChart3 className="inline-block w-4 h-4 mr-2" />
                    Xem báo cáo
                  </Link>
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Đánh giá gần đây
                </h3>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="pb-4 border-b last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {review.student}
                        </span>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mb-1 text-sm text-gray-600">{review.comment}</p>
                      <div className="text-xs text-gray-400">{review.course} • {review.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* This Month */}
              <div className="p-6 text-white shadow-sm bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <h3 className="mb-4 text-lg font-bold">Tháng này</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Học viên mới</span>
                    <span className="text-2xl font-bold">324</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Doanh thu</span>
                    <span className="text-2xl font-bold">₫45M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Đánh giá mới</span>
                    <span className="text-2xl font-bold">127</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}