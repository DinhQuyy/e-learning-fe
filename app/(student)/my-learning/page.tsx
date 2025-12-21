'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Play,
  CheckCircle2,
  BarChart3,
  Filter,
  Search,
  Grid3x3,
  List,
  ArrowRight,
  Calendar,
  Target
} from 'lucide-react';

// Mock data - enrolled courses 
const enrolledCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    instructor: 'Nguyễn Văn A',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    progress: 65,
    currentLesson: 'React Hooks Advanced',
    totalLessons: 250,
    completedLessons: 163,
    timeLeft: '15 giờ',
    lastAccessed: '2 giờ trước',
    category: 'Web Development',
    nextLesson: {
      id: 164,
      title: 'Context API và useContext',
      duration: '18:30'
    }
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning',
    instructor: 'Trần Thị B',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    progress: 32,
    currentLesson: 'Pandas DataFrames',
    totalLessons: 320,
    completedLessons: 102,
    timeLeft: '40 giờ',
    lastAccessed: '1 ngày trước',
    category: 'Data Science',
    nextLesson: {
      id: 103,
      title: 'Data Cleaning Techniques',
      duration: '22:15'
    }
  },
  {
    id: 3,
    title: 'UI/UX Design: Từ Zero đến Hero',
    instructor: 'Lê Minh C',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    progress: 88,
    currentLesson: 'Final Project Review',
    totalLessons: 180,
    completedLessons: 158,
    timeLeft: '4 giờ',
    lastAccessed: '5 giờ trước',
    category: 'Design',
    nextLesson: {
      id: 159,
      title: 'Portfolio Presentation',
      duration: '25:00'
    }
  },
  {
    id: 4,
    title: 'Python Programming Complete',
    instructor: 'Võ Thị E',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
    progress: 45,
    currentLesson: 'Object-Oriented Programming',
    totalLessons: 150,
    completedLessons: 68,
    timeLeft: '18 giờ',
    lastAccessed: '3 ngày trước',
    category: 'Programming',
    nextLesson: {
      id: 69,
      title: 'Classes and Objects',
      duration: '20:45'
    }
  },
];

const stats = [
  {
    icon: BookOpen,
    label: 'Khóa học đang học',
    value: '4',
    color: 'blue',
    change: '+1 tháng này'
  },
  {
    icon: CheckCircle2,
    label: 'Hoàn thành',
    value: '12',
    color: 'green',
    change: '+3 tháng này'
  },
  {
    icon: Clock,
    label: 'Giờ học',
    value: '156',
    color: 'purple',
    change: '+24 tuần này'
  },
  {
    icon: Award,
    label: 'Chứng chỉ',
    value: '8',
    color: 'orange',
    change: '+2 tháng này'
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'completed',
    course: 'Web Development Bootcamp',
    lesson: 'React Hooks Basics',
    time: '2 giờ trước'
  },
  {
    id: 2,
    type: 'started',
    course: 'Data Science',
    lesson: 'Pandas Introduction',
    time: '1 ngày trước'
  },
  {
    id: 3,
    type: 'certificate',
    course: 'Python Basics',
    lesson: 'Hoàn thành khóa học',
    time: '3 ngày trước'
  },
];

export default function MyLearningPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter courses
  const filteredCourses = enrolledCourses.filter(course => {
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get course with highest progress for continue learning
  const continueLearningSorted = [...enrolledCourses].sort((a, b) => {
    if (a.progress === b.progress) {
      return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
    }
    return b.progress - a.progress;
  });

  const categories = ['all', 'Web Development', 'Data Science', 'Design', 'Programming'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 py-12 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="mb-2 text-4xl font-bold">Học tập của tôi</h1>
              <p className="text-lg text-blue-100">
                Tiếp tục hành trình học tập của bạn
              </p>
            </div>
            <Link
              href="/courses"
              className="flex items-center gap-2 px-6 py-3 font-semibold text-blue-600 transition-all bg-white rounded-lg hover:shadow-lg"
            >
              Khám phá thêm
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = {
                blue: 'bg-blue-500',
                green: 'bg-green-500',
                purple: 'bg-purple-500',
                orange: 'bg-orange-500',
              };

              return (
                <div
                  key={index}
                  className="p-6 border bg-white/10 backdrop-blur-sm rounded-xl border-white/20"
                >
                  <div className={`w-12 h-12 ${colors[stat.color as keyof typeof colors]} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="mb-1 text-3xl font-bold">{stat.value}</div>
                  <div className="mb-2 text-sm text-blue-100">{stat.label}</div>
                  <div className="text-xs text-blue-200">{stat.change}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        {/* Continue Learning Section */}
        {continueLearningSorted[0] && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Tiếp tục học
            </h2>
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="grid gap-6 p-6 md:grid-cols-3">
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden rounded-lg md:h-auto">
                  <img
                    src={continueLearningSorted[0].thumbnail}
                    alt={continueLearningSorted[0].title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Link
                      href={`/courses/${continueLearningSorted[0].id}/learn`}
                      className="flex items-center justify-center w-16 h-16 transition-transform bg-white rounded-full hover:scale-110"
                    >
                      <Play className="w-8 h-8 ml-1 text-blue-600" />
                    </Link>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between md:col-span-2">
                  <div>
                    <div className="mb-2 text-sm font-semibold text-blue-600">
                      {continueLearningSorted[0].category}
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                      {continueLearningSorted[0].title}
                    </h3>
                    <p className="mb-4 text-gray-600">
                      Bài học tiếp theo: {continueLearningSorted[0].nextLesson.title}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-gray-600">
                          {continueLearningSorted[0].completedLessons} / {continueLearningSorted[0].totalLessons} bài học
                        </span>
                        <span className="font-semibold text-blue-600">
                          {continueLearningSorted[0].progress}%
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden bg-gray-200 rounded-full">
                        <div
                          className="h-full transition-all rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                          style={{ width: `${continueLearningSorted[0].progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/courses/${continueLearningSorted[0].id}/learn`}
                      className="px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                    >
                      Tiếp tục học
                    </Link>
                    <Link
                      href={`/courses/${continueLearningSorted[0].id}`}
                      className="px-6 py-3 font-semibold text-gray-700 transition-all border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
          <div className="flex items-center w-full gap-4 md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Tất cả' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode */}
          <div className="flex gap-2 p-1 border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Courses Grid/List */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Tất cả khóa học ({filteredCourses.length})
            </h2>

            {filteredCourses.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Không tìm thấy khóa học
                </h3>
                <p className="mb-6 text-gray-600">
                  Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Khám phá khóa học mới
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="overflow-hidden transition-all bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-xl group"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                      <Link
                        href={`/courses/${course.id}/learn`}
                        className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/50 group-hover:opacity-100"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
                          <Play className="w-6 h-6 ml-1 text-blue-600" />
                        </div>
                      </Link>
                      <div className="absolute px-3 py-1 text-xs font-bold rounded-full top-3 right-3 bg-white/90 backdrop-blur-sm">
                        {course.progress}%
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="text-sm font-semibold text-blue-600">
                        {course.category}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 transition-colors line-clamp-2 group-hover:text-blue-600">
                        {course.title}
                      </h3>

                      <div className="text-sm text-gray-600">
                        {course.instructor}
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2 text-xs">
                          <span className="text-gray-600">
                            {course.completedLessons}/{course.totalLessons} bài
                          </span>
                          <span className="font-semibold text-blue-600">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Truy cập: {course.lastAccessed}
                      </div>

                      <Link
                        href={`/courses/${course.id}/learn`}
                        className="block w-full py-2 font-semibold text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Tiếp tục học
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="overflow-hidden transition-all bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-xl"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 w-full h-40 md:w-64">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="object-cover w-full h-full"
                        />
                        <Link
                          href={`/courses/${course.id}/learn`}
                          className="absolute inset-0 flex items-center justify-center transition-colors bg-black/50 hover:bg-black/40 group"
                        >
                          <div className="flex items-center justify-center w-12 h-12 transition-transform bg-white rounded-full group-hover:scale-110">
                            <Play className="w-6 h-6 ml-1 text-blue-600" />
                          </div>
                        </Link>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="mb-2 text-sm font-semibold text-blue-600">
                              {course.category}
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900">
                              {course.title}
                            </h3>
                            <div className="mb-4 text-sm text-gray-600">
                              {course.instructor}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">
                              {course.progress}%
                            </div>
                            <div className="text-xs text-gray-500">hoàn thành</div>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="text-gray-600">
                              {course.completedLessons} / {course.totalLessons} bài học
                            </span>
                            <span className="text-gray-500">
                              Còn lại: {course.timeLeft}
                            </span>
                          </div>
                          <div className="h-3 overflow-hidden bg-gray-200 rounded-full">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Truy cập: {course.lastAccessed}
                          </div>
                          <Link
                            href={`/courses/${course.id}/learn`}
                            className="px-6 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                          >
                            Tiếp tục học
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 space-y-6 bg-white rounded-xl top-8">
              {/* Learning Goals */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
                  <Target className="w-5 h-5 text-blue-600" />
                  Mục tiêu tuần này
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-gray-600">Giờ học</span>
                      <span className="font-semibold">8/10 giờ</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-gray-600">Bài học</span>
                      <span className="font-semibold">12/15 bài</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-green-600 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Hoạt động gần đây
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'completed' ? 'bg-green-500' :
                        activity.type === 'started' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.lesson}</p>
                        <p className="text-xs text-gray-500">{activity.course}</p>
                        <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Liên kết nhanh
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/certificates"
                    className="block px-4 py-2 text-sm text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    📜 Chứng chỉ của tôi
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block px-4 py-2 text-sm text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    ❤️ Danh sách yêu thích
                  </Link>
                  <Link
                    href="/courses"
                    className="block px-4 py-2 text-sm text-gray-700 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    🔍 Khám phá khóa học
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}