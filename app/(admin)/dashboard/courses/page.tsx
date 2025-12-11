'use client';

import { BookOpen, Plus, Search, Filter, Eye, Edit2, Trash2 } from 'lucide-react';

// Mock data
const mockCourses = [
  {
    id: 1,
    title: 'Next.js Full Stack Development',
    instructor: 'Nguyễn Văn A',
    category: 'Web Development',
    students: 320,
    price: 1500000,
    status: 'published',
    rating: 4.8,
    lessons: 45,
    duration: '12 giờ',
  },
  {
    id: 2,
    title: 'React Native Mobile Apps',
    instructor: 'Trần Thị B',
    category: 'Mobile Development',
    students: 280,
    price: 1200000,
    status: 'published',
    rating: 4.7,
    lessons: 38,
    duration: '10 giờ',
  },
  {
    id: 3,
    title: 'TypeScript Mastery',
    instructor: 'Lê Văn C',
    category: 'Programming',
    students: 250,
    price: 1000000,
    status: 'published',
    rating: 4.9,
    lessons: 30,
    duration: '8 giờ',
  },
  {
    id: 4,
    title: 'Python for Data Science',
    instructor: 'Phạm Thị D',
    category: 'Data Science',
    students: 180,
    price: 1800000,
    status: 'draft',
    rating: 0,
    lessons: 50,
    duration: '15 giờ',
  },
];

export default function CoursesPage() {
  const getStatusBadge = (status: string) => {
    return status === 'published'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Courses Management</h1>
        <p className="mt-2 text-gray-600">
          Quản lý tất cả khóa học trong hệ thống
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Tổng lượng khoá học</p>
          <p className="mt-2 text-3xl font-bold">{mockCourses.length}</p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Đã mở</p>
          <p className="mt-2 text-3xl font-bold">
            {mockCourses.filter((c) => c.status === 'published').length}
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Tổng học viên</p>
          <p className="mt-2 text-3xl font-bold">
            {mockCourses.reduce((sum, c) => sum + c.students, 0)}
          </p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">Đánh giá trung bình</p>
          <p className="mt-2 text-3xl font-bold">4.8</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Search */}
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Tất cả</option>
              <option value="published">Đã mở</option>
              <option value="draft">Chưa mở</option>
            </select>

            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Tất cả</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Development</option>
              <option value="data">Data Science</option>
            </select>
          </div>

          {/* Add Button */}
          <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            Thêm khoá học
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Khoá học
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Giáo viên
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Học viên
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Giá
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Tình trạng
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Tuỳ chọn
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg shrink-0">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {course.lessons} lessons • {course.duration}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.instructor}</div>
                    <div className="text-xs text-gray-500">{course.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.students}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
  <div className="text-sm text-gray-900">
    ₫{Number(course.price).toLocaleString("vi-VN")}
  </div>
</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        course.status
                      )}`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {course.rating > 0 ? (
                        <>
                          <span className="text-sm font-medium text-gray-900">
                            {course.rating}
                          </span>
                          <span className="text-yellow-400">★</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
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