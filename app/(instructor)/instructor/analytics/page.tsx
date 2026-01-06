'use client';

import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Star,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  ShoppingCart,
  Award,
  Target
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock Data
const revenueData = [
  { month: 'T1', revenue: 45, students: 120, courses: 3 },
  { month: 'T2', revenue: 52, students: 145, courses: 4 },
  { month: 'T3', revenue: 48, students: 135, courses: 3 },
  { month: 'T4', revenue: 61, students: 178, courses: 5 },
  { month: 'T5', revenue: 55, students: 156, courses: 4 },
  { month: 'T6', revenue: 67, students: 192, courses: 6 },
  { month: 'T7', revenue: 73, students: 215, courses: 6 },
  { month: 'T8', revenue: 69, students: 198, courses: 5 },
  { month: 'T9', revenue: 78, students: 234, courses: 7 },
  { month: 'T10', revenue: 82, students: 256, courses: 7 },
  { month: 'T11', revenue: 88, students: 278, courses: 8 },
  { month: 'T12', revenue: 95, students: 312, courses: 9 }
];

const categoryData = [
  { name: 'Web Development', value: 35, revenue: 89 },
  { name: 'Data Science', value: 25, revenue: 67 },
  { name: 'Mobile Dev', value: 20, revenue: 52 },
  { name: 'UI/UX Design', value: 12, revenue: 28 },
  { name: 'Other', value: 8, revenue: 19 }
];

const topCourses = [
  { id: 1, title: 'Complete Web Development Bootcamp', students: 847, revenue: 45000000, rating: 4.8, growth: '+12%' },
  { id: 2, title: 'React Advanced Patterns', students: 523, revenue: 28000000, rating: 4.9, growth: '+8%' },
  { id: 3, title: 'Python Data Science', students: 678, revenue: 38000000, rating: 4.8, growth: '+15%' },
  { id: 4, title: 'Node.js Backend Mastery', students: 412, revenue: 22000000, rating: 4.7, growth: '+5%' },
  { id: 5, title: 'Mobile App with React Native', students: 345, revenue: 18000000, rating: 4.6, growth: '+6%' }
];

const conversionData = [
  { stage: 'Lượt xem', value: 12500, percentage: 100 },
  { stage: 'Click vào khóa học', value: 5200, percentage: 42 },
  { stage: 'Thêm giỏ hàng', value: 2100, percentage: 17 },
  { stage: 'Thanh toán', value: 1250, percentage: 10 },
  { stage: 'Hoàn thành', value: 1180, percentage: 9.4 }
];

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#6B7280'];

export default function RevenueAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('12months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const stats = {
    totalRevenue: 245000000,
    revenueGrowth: '+18.2%',
    totalStudents: 2847,
    studentGrowth: '+24.5%',
    avgOrderValue: 1350000,
    orderGrowth: '+8.3%',
    completionRate: 68,
    completionGrowth: '+5.2%'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Doanh thu & Phân tích</h1>
              <p className="mt-2 text-gray-600">Thống kê và phân tích hiệu suất khóa học</p>
            </div>
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="90days">90 ngày qua</option>
                <option value="12months">12 tháng qua</option>
                <option value="alltime">Tất cả thời gian</option>
              </select>
              <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl">
                <Download className="w-5 h-5" />
                Xuất báo cáo
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-blue-600 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  {stats.revenueGrowth}
                </div>
              </div>
              <div className="mb-1 text-3xl font-bold text-gray-900">
                ₫{(stats.totalRevenue / 1000000).toFixed(0)}M
              </div>
              <div className="text-sm text-gray-600">Tổng doanh thu</div>
            </div>

            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-purple-600 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  {stats.studentGrowth}
                </div>
              </div>
              <div className="mb-1 text-3xl font-bold text-gray-900">
                {stats.totalStudents.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Tổng học viên</div>
            </div>

            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-green-600 bg-green-100 rounded-lg">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  {stats.orderGrowth}
                </div>
              </div>
              <div className="mb-1 text-3xl font-bold text-gray-900">
                {formatCurrency(stats.avgOrderValue)}
              </div>
              <div className="text-sm text-gray-600">Giá trị đơn TB</div>
            </div>

            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 text-orange-600 bg-orange-100 rounded-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  {stats.completionGrowth}
                </div>
              </div>
              <div className="mb-1 text-3xl font-bold text-gray-900">
                {stats.completionRate}%
              </div>
              <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
            </div>
          </div>

          {/* Main Charts */}
          <div className="grid gap-6 mb-6 lg:grid-cols-3">
            {/* Revenue Trend */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm lg:col-span-2 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Xu hướng doanh thu</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedMetric('revenue')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      selectedMetric === 'revenue' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Doanh thu
                  </button>
                  <button
                    onClick={() => setSelectedMetric('students')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      selectedMetric === 'students' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Học viên
                  </button>
                  <button
                    onClick={() => setSelectedMetric('courses')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      selectedMetric === 'courses' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Khóa học
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value) => selectedMetric === 'revenue' ? `₫${value}M` : value}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h3 className="mb-6 text-xl font-bold text-gray-900">Phân bổ theo danh mục</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat, index) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="text-sm text-gray-600">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">{cat.value}%</span>
                      <span className="text-sm text-gray-500">₫{cat.revenue}M</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Courses & Conversion Funnel */}
          <div className="grid gap-6 mb-6 lg:grid-cols-2">
            {/* Top Performing Courses */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h3 className="mb-6 text-xl font-bold text-gray-900">Top khóa học hiệu suất cao</h3>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center gap-4 p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
                    <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 font-semibold text-gray-900 truncate">{course.title}</div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.students}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          {course.rating}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          {course.growth}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₫{(course.revenue / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-gray-500">Doanh thu</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h3 className="mb-6 text-xl font-bold text-gray-900">Phễu chuyển đổi</h3>
              <div className="space-y-3">
                {conversionData.map((stage, index) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">{stage.stage}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{stage.value.toLocaleString()}</span>
                        <span className="text-sm font-bold text-blue-600">{stage.percentage}%</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full h-8 overflow-hidden bg-gray-200 rounded-full">
                        <div
                          className={`h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-semibold transition-all ${
                            index === 0 ? 'bg-blue-600' :
                            index === 1 ? 'bg-blue-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-purple-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${stage.percentage}%` }}
                        >
                          {stage.percentage >= 15 && `${stage.percentage}%`}
                        </div>
                      </div>
                    </div>
                    {index < conversionData.length - 1 && (
                      <div className="flex items-center gap-2 mt-2 ml-2 text-xs text-red-600">
                        <ArrowDown className="w-3 h-3" />
                        Drop: {((conversionData[index].value - conversionData[index + 1].value) / conversionData[index].value * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Best Day */}
            <div className="p-6 text-white shadow-sm bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Ngày bán chạy nhất</div>
                  <div className="text-2xl font-bold">Chủ nhật</div>
                </div>
              </div>
              <div className="text-sm opacity-90">Doanh thu TB: ₫8.2M/ngày</div>
            </div>

            {/* Best Time */}
            <div className="p-6 text-white shadow-sm bg-gradient-to-br from-green-600 to-teal-600 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Giờ vàng</div>
                  <div className="text-2xl font-bold">20:00 - 22:00</div>
                </div>
              </div>
              <div className="text-sm opacity-90">35% giao dịch diễn ra</div>
            </div>

            {/* Avg. Response Time */}
            <div className="p-6 text-white shadow-sm bg-gradient-to-br from-orange-600 to-red-600 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Tỷ lệ xem → mua</div>
                  <div className="text-2xl font-bold">9.4%</div>
                </div>
              </div>
              <div className="text-sm opacity-90">Trên trung bình ngành 6.8%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}