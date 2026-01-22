'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockQuizzes } from '@/data/mockQuizzes';
import Button from '@/components/Button';
import {
  Plus,
  Sparkles,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  BarChart3,
  Clock,
  Users,
  Target,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';

export default function InstructorQuizzesPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const courseId = params.id;

  // Filter quizzes for this course
  const courseQuizzes = mockQuizzes.filter(q => q.courseId === courseId);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredQuizzes = courseQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'published' && quiz.isPublished) ||
      (filterStatus === 'draft' && !quiz.isPublished);
    
    return matchesSearch && matchesStatus;
  });

  const handleTogglePublish = (quizId: string) => {
    // In real app, update via API
    console.log('Toggle publish:', quizId);
    setActiveMenu(null);
  };

  const handleDelete = (quizId: string) => {
    if (confirm('Bạn có chắc muốn xóa bài quiz này?')) {
      console.log('Delete quiz:', quizId);
      setActiveMenu(null);
    }
  };

  const handleDuplicate = (quizId: string) => {
    console.log('Duplicate quiz:', quizId);
    setActiveMenu(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý Quiz</h1>
              <p className="mt-1 text-gray-600">
                {filteredQuizzes.length} bài quiz
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push(`/instructor/courses/${courseId}/quizzes/create`)}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Tạo thủ công
              </Button>
              <Button
                onClick={() => router.push(`/instructor/courses/${courseId}/quizzes/ai-generate`)}
                variant="primary"
                className="flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Tạo bằng AI
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        {/* Filters */}
        <div className="p-4 mb-6 bg-white shadow-sm rounded-xl">
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm bài quiz..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {courseQuizzes.length}
              </span>
            </div>
            <div className="text-sm text-gray-600">Tổng số quiz</div>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {courseQuizzes.filter(q => q.isPublished).length}
              </span>
            </div>
            <div className="text-sm text-gray-600">Đã xuất bản</div>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <EyeOff className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {courseQuizzes.filter(q => !q.isPublished).length}
              </span>
            </div>
            <div className="text-sm text-gray-600">Bản nháp</div>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                1,234
              </span>
            </div>
            <div className="text-sm text-gray-600">Lượt làm bài</div>
          </div>
        </div>

        {/* Quiz List */}
        {filteredQuizzes.length === 0 ? (
          <div className="p-12 text-center bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full">
              <CheckCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Chưa có bài quiz nào
            </h3>
            <p className="mb-6 text-gray-600">
              Tạo bài quiz đầu tiên để kiểm tra kiến thức học viên
            </p>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => router.push(`/instructor/courses/${courseId}/quizzes/create`)}
                variant="secondary"
              >
                Tạo thủ công
              </Button>
              <Button
                onClick={() => router.push(`/instructor/courses/${courseId}/quizzes/ai-generate`)}
                variant="primary"
                className="flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Tạo bằng AI
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {quiz.title}
                        </h3>
                        {quiz.isPublished ? (
                          <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                            Đã xuất bản
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                            Bản nháp
                          </span>
                        )}
                      </div>
                      <p className="mb-3 text-sm text-gray-600">
                        {quiz.description}
                      </p>
                      {quiz.lessonName && (
                        <div className="text-sm text-gray-500">
                          📚 {quiz.lessonName}
                        </div>
                      )}
                    </div>

                    {/* Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === quiz.id ? null : quiz.id)}
                        className="p-2 transition-colors rounded-lg hover:bg-gray-100"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {activeMenu === quiz.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveMenu(null)}
                          />
                          <div className="absolute right-0 z-20 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
                            <Link
                              href={`/instructor/courses/${courseId}/quizzes/${quiz.id}`}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4" />
                              Xem chi tiết
                            </Link>
                            <Link
                              href={`/instructor/courses/${courseId}/quizzes/${quiz.id}/edit`}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <Edit2 className="w-4 h-4" />
                              Chỉnh sửa
                            </Link>
                            <Link
                              href={`/instructor/courses/${courseId}/quizzes/${quiz.id}/analytics`}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <BarChart3 className="w-4 h-4" />
                              Thống kê
                            </Link>
                            <button
                              onClick={() => handleDuplicate(quiz.id)}
                              className="flex items-center w-full gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                            >
                              <Copy className="w-4 h-4" />
                              Nhân bản
                            </button>
                            <button
                              onClick={() => handleTogglePublish(quiz.id)}
                              className="flex items-center w-full gap-3 px-4 py-3 text-sm text-gray-700 transition-colors border-t border-gray-200 hover:bg-gray-50"
                            >
                              {quiz.isPublished ? (
                                <>
                                  <EyeOff className="w-4 h-4" />
                                  Ẩn quiz
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" />
                                  Xuất bản
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(quiz.id)}
                              className="flex items-center w-full gap-3 px-4 py-3 text-sm text-red-600 transition-colors border-t border-gray-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Xóa
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded bg-blue-50">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {quiz.questions.length}
                        </div>
                        <div className="text-xs text-gray-600">Câu hỏi</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded bg-purple-50">
                        <Target className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {quiz.totalPoints}
                        </div>
                        <div className="text-xs text-gray-600">Điểm</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded bg-green-50">
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {quiz.timeLimit || '∞'}
                        </div>
                        <div className="text-xs text-gray-600">Phút</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded bg-yellow-50">
                        <Users className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {Math.floor(Math.random() * 100)}
                        </div>
                        <div className="text-xs text-gray-600">Lượt làm</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded text-xs font-semibold ${
                        quiz.difficulty === 'easy'
                          ? 'bg-green-100 text-green-700'
                          : quiz.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {quiz.difficulty === 'easy' ? 'Dễ' : quiz.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 pt-4 mt-4 border-t border-gray-200">
                    <Button
                      onClick={() => router.push(`/instructor/courses/${courseId}/quizzes/${quiz.id}/edit`)}
                      variant="secondary"
                      className="flex items-center justify-center flex-1 gap-2 text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      onClick={() => router.push(`/instructor/courses/${courseId}/quizzes/${quiz.id}/analytics`)}
                      variant="secondary"
                      className="flex items-center justify-center flex-1 gap-2 text-sm"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Thống kê
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}