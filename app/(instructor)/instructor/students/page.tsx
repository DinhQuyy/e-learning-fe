'use client';

import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  MessageSquare,
  MoreVertical,
  BookOpen,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Calendar,
  Eye,
  Ban,
  UserX,
  Star,
  Activity
} from 'lucide-react';

type Student = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: number;
  completedCourses: number;
  totalSpent: number;
  joinDate: string;
  lastActive: string;
  progress: number;
  status: 'active' | 'inactive';
  certificates: number;
};

const mockStudents: Student[] = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    enrolledCourses: 5,
    completedCourses: 3,
    totalSpent: 4500000,
    joinDate: '2024-01-15',
    lastActive: '2 giờ trước',
    progress: 85,
    status: 'active',
    certificates: 3
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    email: 'tranthibinh@email.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    enrolledCourses: 3,
    completedCourses: 2,
    totalSpent: 3200000,
    joinDate: '2024-02-10',
    lastActive: '1 ngày trước',
    progress: 67,
    status: 'active',
    certificates: 2
  },
  {
    id: 3,
    name: 'Lê Hoàng Cường',
    email: 'lehoangcuong@email.com',
    avatar: 'https://i.pravatar.cc/150?img=7',
    enrolledCourses: 8,
    completedCourses: 5,
    totalSpent: 6800000,
    joinDate: '2023-11-20',
    lastActive: '30 phút trước',
    progress: 92,
    status: 'active',
    certificates: 5
  },
  {
    id: 4,
    name: 'Phạm Thị Dung',
    email: 'phamthidung@email.com',
    avatar: 'https://i.pravatar.cc/150?img=9',
    enrolledCourses: 2,
    completedCourses: 0,
    totalSpent: 1800000,
    joinDate: '2024-03-05',
    lastActive: '2 tuần trước',
    progress: 23,
    status: 'inactive',
    certificates: 0
  },
  {
    id: 5,
    name: 'Võ Minh Em',
    email: 'vominhem@email.com',
    avatar: 'https://i.pravatar.cc/150?img=11',
    enrolledCourses: 6,
    completedCourses: 4,
    totalSpent: 5400000,
    joinDate: '2023-12-01',
    lastActive: '5 giờ trước',
    progress: 78,
    status: 'active',
    certificates: 4
  },
  {
    id: 6,
    name: 'Đặng Văn Phúc',
    email: 'dangvanphuc@email.com',
    avatar: 'https://i.pravatar.cc/150?img=13',
    enrolledCourses: 4,
    completedCourses: 2,
    totalSpent: 3600000,
    joinDate: '2024-01-28',
    lastActive: '1 giờ trước',
    progress: 56,
    status: 'active',
    certificates: 2
  }
];

export default function StudentsManagementPage() {
  const [students] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Stats
  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    inactive: students.filter(s => s.status === 'inactive').length,
    totalRevenue: students.reduce((sum, s) => sum + s.totalSpent, 0),
    avgProgress: Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length),
    totalCertificates: students.reduce((sum, s) => sum + s.certificates, 0)
  };

  const toggleStudentSelection = (id: number) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const StudentDropdown = ({ studentId }: { studentId: number }) => (
    <div className="absolute right-0 z-10 w-48 py-2 bg-white border border-gray-200 rounded-lg shadow-xl top-10">
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50">
        <Eye className="w-4 h-4" /> Xem chi tiết
      </button>
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50">
        <Mail className="w-4 h-4" /> Gửi email
      </button>
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50">
        <MessageSquare className="w-4 h-4" /> Nhắn tin
      </button>
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50">
        <Award className="w-4 h-4" /> Cấp chứng chỉ
      </button>
      <hr className="my-2" />
      <button className="flex items-center w-full gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50">
        <Ban className="w-4 h-4" /> Chặn học viên
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
              <h1 className="text-4xl font-bold text-gray-900">Quản lý học viên</h1>
              <p className="mt-2 text-gray-600">Theo dõi và quản lý tất cả học viên của bạn</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="w-5 h-5" />
                Xuất dữ liệu
              </button>
              <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl">
                <Mail className="w-5 h-5" />
                Gửi email hàng loạt
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-blue-600 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <span className="px-2 py-1 text-xs font-semibold text-green-600 rounded-full bg-green-50">
                  {stats.active} hoạt động
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Tổng học viên</div>
            </div>

            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-purple-600 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">₫{(stats.totalRevenue / 1000000).toFixed(0)}M</div>
              <div className="text-sm text-gray-600">Tổng doanh thu</div>
            </div>

            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-green-600 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.avgProgress}%</div>
              <div className="text-sm text-gray-600">Tiến độ trung bình</div>
            </div>

            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-orange-600 bg-orange-100 rounded-lg">
                  <Award className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalCertificates}</div>
              <div className="text-sm text-gray-600">Chứng chỉ đã cấp</div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm học viên theo tên, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>

              {/* View Toggle */}
              <div className="flex gap-2 p-1 border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  Danh sách
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  Lưới
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedStudents.length > 0 && (
              <div className="flex items-center gap-4 p-4 mt-4 rounded-lg bg-blue-50">
                <span className="text-sm font-semibold text-blue-900">
                  Đã chọn {selectedStudents.length} học viên
                </span>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Mail className="inline w-4 h-4 mr-2" />
                    Gửi email
                  </button>
                  <button className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Award className="inline w-4 h-4 mr-2" />
                    Cấp chứng chỉ
                  </button>
                  <button className="px-4 py-2 text-sm text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50">
                    <Ban className="inline w-4 h-4 mr-2" />
                    Chặn
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Students List/Grid */}
          {viewMode === 'list' ? (
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onChange={selectAllStudents}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <div className="grid flex-1 grid-cols-12 gap-4 text-sm font-semibold text-gray-600">
                    <div className="col-span-3">Học viên</div>
                    <div className="col-span-2">Khóa học</div>
                    <div className="col-span-2">Tiến độ</div>
                    <div className="col-span-2">Doanh thu</div>
                    <div className="col-span-2">Hoạt động</div>
                    <div className="col-span-1">Trạng thái</div>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="px-6 py-4 transition-colors hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      
                      <div className="grid items-center flex-1 grid-cols-12 gap-4">
                        {/* Student Info */}
                        <div className="flex items-center col-span-3 gap-3">
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="object-cover w-12 h-12 rounded-full"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{student.name}</div>
                            <div className="text-sm text-gray-500 truncate">{student.email}</div>
                          </div>
                        </div>

                        {/* Courses */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-900">{student.enrolledCourses}</span>
                            <span className="text-gray-500">đang học</span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            <CheckCircle className="inline w-3 h-3 text-green-600" /> {student.completedCourses} hoàn thành
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{student.progress}%</span>
                          </div>
                          {student.certificates > 0 && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                              <Award className="w-3 h-3" /> {student.certificates} chứng chỉ
                            </div>
                          )}
                        </div>

                        {/* Revenue */}
                        <div className="col-span-2">
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(student.totalSpent)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Tham gia: {new Date(student.joinDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>

                        {/* Last Active */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {student.lastActive}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between col-span-1">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {student.status === 'active' ? 'Active' : 'Inactive'}
                          </span>

                          <div className="relative">
                            <button
                              onClick={() => setShowDropdown(showDropdown === student.id ? null : student.id)}
                              className="p-2 rounded-lg hover:bg-gray-100"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                            {showDropdown === student.id && <StudentDropdown studentId={student.id} />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.map((student) => (
                <div key={student.id} className="p-6 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="object-cover w-16 h-16 rounded-full"
                      />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(showDropdown === student.id ? null : student.id)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      {showDropdown === student.id && <StudentDropdown studentId={student.id} />}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="mb-1 text-lg font-bold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>

                  <div className="mb-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        Khóa học
                      </span>
                      <span className="font-semibold text-gray-900">
                        {student.enrolledCourses} / {student.completedCourses} hoàn thành
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="text-gray-600">Tiến độ</span>
                        <span className="font-semibold text-gray-900">{student.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Doanh thu</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(student.totalSpent)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {student.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {student.lastActive}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredStudents.length === 0 && (
            <div className="p-12 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">Không tìm thấy học viên</h3>
              <p className="text-gray-600">Thử thay đổi bộ lọc tìm kiếm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}