'use client';

import { useState } from 'react';
import {
  BookOpen,
  Users,
  DollarSign,
  Star,
  Edit,
  Eye,
  Trash2,
  Search,
  Filter,
  Plus,
  MoreVertical,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Copy,
  Archive
} from 'lucide-react';

// Mock data
const mockCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    description: 'Học lập trình web từ cơ bản đến nâng cao với HTML, CSS, JavaScript, React, Node.js',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    category: 'Web Development',
    level: 'Beginner',
    price: 1299000,
    students: 847,
    revenue: 45000000,
    rating: 4.8,
    reviews: 234,
    status: 'published',
    lastUpdated: '2024-01-15',
    duration: '42 giờ',
    lessons: 156,
    enrollmentTrend: '+12%'
  },
  {
    id: 2,
    title: 'React Advanced Patterns & Best Practices',
    description: 'Nắm vững React Hooks, Context API, Custom Hooks, Performance Optimization',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    category: 'Frontend',
    level: 'Advanced',
    price: 899000,
    students: 523,
    revenue: 28000000,
    rating: 4.9,
    reviews: 156,
    status: 'published',
    lastUpdated: '2024-01-10',
    duration: '28 giờ',
    lessons: 98,
    enrollmentTrend: '+8%'
  },
  {
    id: 3,
    title: 'Node.js Backend Mastery with MongoDB',
    description: 'Xây dựng RESTful API, Authentication, Database Design, Deployment',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
    category: 'Backend',
    level: 'Intermediate',
    price: 999000,
    students: 412,
    revenue: 22000000,
    rating: 4.7,
    reviews: 98,
    status: 'draft',
    lastUpdated: '2024-01-20',
    duration: '35 giờ',
    lessons: 124,
    enrollmentTrend: '+5%'
  },
  {
    id: 4,
    title: 'Python for Data Science & Machine Learning',
    description: 'Học Python, NumPy, Pandas, Matplotlib, Scikit-learn để phân tích dữ liệu',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
    category: 'Data Science',
    level: 'Intermediate',
    price: 1499000,
    students: 678,
    revenue: 38000000,
    rating: 4.8,
    reviews: 189,
    status: 'published',
    lastUpdated: '2024-01-12',
    duration: '48 giờ',
    lessons: 178,
    enrollmentTrend: '+15%'
  },
  {
    id: 5,
    title: 'Mobile App Development with React Native',
    description: 'Xây dựng ứng dụng iOS và Android với React Native, Expo, Firebase',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    category: 'Mobile',
    level: 'Intermediate',
    price: 1199000,
    students: 345,
    revenue: 18000000,
    rating: 4.6,
    reviews: 87,
    status: 'published',
    lastUpdated: '2024-01-18',
    duration: '32 giờ',
    lessons: 112,
    enrollmentTrend: '+6%'
  },
  {
    id: 6,
    title: 'UI/UX Design Fundamentals',
    description: 'Thiết kế giao diện người dùng với Figma, Design System, User Research',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    category: 'Design',
    level: 'Beginner',
    price: 799000,
    students: 234,
    revenue: 12000000,
    rating: 4.7,
    reviews: 56,
    status: 'archived',
    lastUpdated: '2023-12-20',
    duration: '24 giờ',
    lessons: 76,
    enrollmentTrend: '+2%'
  }
];

export default function MyCoursesPage() {
  const [courses, setCourses] = useState(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('students');
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);

  // Filter and sort
  const filteredCourses = courses
    .filter(course => {
      const matchSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'all' || course.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'students': return b.students - a.students;
        case 'revenue': return b.revenue - a.revenue;
        case 'rating': return b.rating - a.rating;
        case 'recent': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default: return 0;
      }
    });

  // Stats
  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    archived: courses.filter(c => c.status === 'archived').length,
    totalStudents: courses.reduce((sum, c) => sum + c.students, 0),
    totalRevenue: courses.reduce((sum, c) => sum + c.revenue, 0),
    avgRating: (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
  };

  const toggleCourseSelection = (id: number) => {
    setSelectedCourses(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const selectAllCourses = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(c => c.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const CourseDropdown = ({ courseId }: { courseId: number }) => (
    <div className="absolute right-0 z-10 w-48 py-2 bg-white border border-gray-200 rounded-lg shadow-xl top-10">
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50">
        <Eye className="w-4 h-4" /> Xem trước
      </button>
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50">
        <Edit className="w-4 h-4" /> Chỉnh sửa
      </button>
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50">
        <Copy className="w-4 h-4" /> Nhân bản
      </button>
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50">
        <Download className="w-4 h-4" /> Xuất dữ liệu
      </button>
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50">
        <Archive className="w-4 h-4" /> Lưu trữ
      </button>
      <hr className="my-2" />
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50">
        <Trash2 className="w-4 h-4" /> Xóa khóa học
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Khóa học của tôi</h1>
              <p className="mt-2 text-gray-600">Quản lý và theo dõi tất cả khóa học của bạn</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl">
              <Plus className="w-5 h-5" />
              Tạo khóa học mới
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-blue-600 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="px-2 py-1 text-xs font-semibold text-blue-600 rounded-full bg-blue-50">
                  {stats.published} hoạt động
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Tổng khóa học</div>
            </div>

            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-green-600 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Tổng học viên</div>
            </div>

            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-purple-600 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">₫{(stats.totalRevenue / 1000000).toFixed(0)}M</div>
              <div className="text-sm text-gray-600">Tổng doanh thu</div>
            </div>

            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-orange-600 bg-orange-100 rounded-lg">
                  <Star className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.avgRating}</div>
              <div className="text-sm text-gray-600">Đánh giá trung bình</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học theo tên, danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
                <option value="archived">Đã lưu trữ</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="students">Nhiều học viên nhất</option>
                <option value="revenue">Doanh thu cao nhất</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="recent">Mới cập nhật</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedCourses.length > 0 && (
              <div className="flex items-center gap-4 p-4 mt-4 rounded-lg bg-blue-50">
                <span className="text-sm font-semibold text-blue-900">
                  Đã chọn {selectedCourses.length} khóa học
                </span>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    Xuất bản
                  </button>
                  <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    Lưu trữ
                  </button>
                  <button className="px-4 py-2 text-sm text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50">
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Courses Grid */}
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center gap-3 px-6">
              <input
                type="checkbox"
                checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                onChange={selectAllCourses}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-600">
                Chọn tất cả ({filteredCourses.length} khóa học)
              </span>
            </div>

            {/* Course Cards */}
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Checkbox */}
                    <div className="flex items-start pt-2">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => toggleCourseSelection(course.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </div>

                    {/* Thumbnail */}
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="object-cover w-48 h-32 rounded-lg"
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              course.status === 'published' ? 'bg-green-100 text-green-700' :
                              course.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {course.status === 'published' ? 'Đã xuất bản' :
                               course.status === 'draft' ? 'Bản nháp' : 'Đã lưu trữ'}
                            </span>
                          </div>
                          <p className="mb-3 text-sm text-gray-600 line-clamp-2">{course.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded">{course.category}</span>
                            <span className="px-2 py-1 bg-gray-100 rounded">{course.level}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.duration}
                            </span>
                            <span>{course.lessons} bài học</span>
                          </div>
                        </div>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setShowDropdown(showDropdown === course.id ? null : course.id)}
                            className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                          {showDropdown === course.id && <CourseDropdown courseId={course.id} />}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <div className="flex items-center gap-1 mb-1 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            Học viên
                          </div>
                          <div className="font-bold text-gray-900">{course.students.toLocaleString()}</div>
                          <div className="text-xs font-semibold text-green-600">{course.enrollmentTrend}</div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 mb-1 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            Doanh thu
                          </div>
                          <div className="font-bold text-gray-900">₫{(course.revenue / 1000000).toFixed(1)}M</div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 mb-1 text-sm text-gray-600">
                            <Star className="w-4 h-4" />
                            Đánh giá
                          </div>
                          <div className="font-bold text-gray-900">{course.rating}</div>
                          <div className="text-xs text-gray-500">({course.reviews} reviews)</div>
                        </div>

                        <div>
                          <div className="mb-1 text-sm text-gray-600">Giá bán</div>
                          <div className="font-bold text-gray-900">{formatCurrency(course.price)}</div>
                        </div>

                        <div>
                          <div className="mb-1 text-sm text-gray-600">Cập nhật</div>
                          <div className="text-sm text-gray-900">{new Date(course.lastUpdated).toLocaleDateString('vi-VN')}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <Eye className="w-4 h-4" />
                          Xem trước
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                          <Edit className="w-4 h-4" />
                          Chỉnh sửa
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                          <TrendingUp className="w-4 h-4" />
                          Xem thống kê
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">Không tìm thấy khóa học</h3>
              <p className="mb-6 text-gray-600">Thử thay đổi bộ lọc hoặc tạo khóa học mới</p>
              <button className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl">
                <Plus className="w-5 h-5" />
                Tạo khóa học đầu tiên
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}