'use client';

import { useRouter } from 'next/navigation';
import { mockQuizzes, mockQuizStats } from '@/data/mockQuizzes';
import Button from '@/components/Button';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  BarChart3
} from 'lucide-react';

export default function QuizAnalyticsPage({
  params
}: {
  params: { id: string; quizId: string };
}) {
  const router = useRouter();
  const courseId = params.id;
  const quizId = params.quizId;

  const quiz = mockQuizzes.find(q => q.id === quizId);
  const stats = mockQuizStats;

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Không tìm thấy bài quiz
          </h1>
          <Button onClick={() => router.back()}>Quay lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container px-4 py-6 mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="mt-1 text-gray-600">Thống kê và phân tích</p>
            </div>
            <Button
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalAttempts}
                </div>
                <div className="text-sm text-gray-600">Lượt làm bài</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12% so với tuần trước</span>
            </div>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.averageScore.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Điểm TB</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+5.2% so với trước</span>
            </div>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.passRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Tỷ lệ đạt</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-red-600">
              <TrendingDown className="w-4 h-4" />
              <span>-2.1% so với trước</span>
            </div>
          </div>

          <div className="p-6 bg-white shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.averageTime.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Phút TB</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Thời gian hoàn thành</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          {/* Score Distribution */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Phân bố điểm số
            </h3>
            <div className="space-y-4">
              {[
                { range: '90-100%', count: 15, color: 'bg-green-500' },
                { range: '80-89%', count: 12, color: 'bg-blue-500' },
                { range: '70-79%', count: 8, color: 'bg-yellow-500' },
                { range: '60-69%', count: 6, color: 'bg-orange-500' },
                { range: '0-59%', count: 4, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.range}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {item.range}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.count} học viên
                    </span>
                  </div>
                  <div className="w-full h-3 overflow-hidden bg-gray-100 rounded-full">
                    <div
                      className={`h-full ${item.color} transition-all`}
                      style={{ width: `${(item.count / stats.totalAttempts) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Distribution */}
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Phân bố độ khó câu hỏi
            </h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#10b981"
                      strokeWidth="20"
                      fill="none"
                      strokeDasharray={`${(stats.difficultyDistribution.easy / quiz.questions.length) * 439.8} 439.8`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {quiz.questions.length}
                      </div>
                      <div className="text-sm text-gray-600">Câu hỏi</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 text-center rounded-lg bg-green-50">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.difficultyDistribution.easy}
                  </div>
                  <div className="text-sm text-gray-600">Dễ</div>
                </div>
                <div className="p-4 text-center rounded-lg bg-yellow-50">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.difficultyDistribution.medium}
                  </div>
                  <div className="text-sm text-gray-600">Trung bình</div>
                </div>
                <div className="p-4 text-center rounded-lg bg-red-50">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.difficultyDistribution.hard}
                  </div>
                  <div className="text-sm text-gray-600">Khó</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Performance */}
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Hiệu suất từng câu hỏi
            </h3>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {stats.questionStats.length} câu hỏi
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {stats.questionStats.map((qStat, index) => {
              const isGood = qStat.correctRate >= 70;
              const isMedium = qStat.correctRate >= 40 && qStat.correctRate < 70;
              const isPoor = qStat.correctRate < 40;

              return (
                <div
                  key={qStat.questionId}
                  className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {qStat.question}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              qStat.difficulty === 'easy'
                                ? 'bg-green-100 text-green-700'
                                : qStat.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {qStat.difficulty === 'easy' ? 'Dễ' : qStat.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {qStat.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                      isGood
                        ? 'bg-green-100 text-green-700'
                        : isMedium
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {isGood ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isPoor ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-semibold">
                        {qStat.correctRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="mb-1 text-xs text-gray-600">Số lượt làm</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {qStat.totalAttempts}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-gray-600">Trả lời đúng</div>
                      <div className="text-sm font-semibold text-green-600">
                        {qStat.correctAttempts}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-gray-600">TB thời gian</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {qStat.averageTimeSpent}s
                      </div>
                    </div>
                  </div>

                  {/* Correct Rate Bar */}
                  <div className="w-full h-2 overflow-hidden bg-gray-100 rounded-full">
                    <div
                      className={`h-full transition-all ${
                        isGood
                          ? 'bg-green-500'
                          : isMedium
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${qStat.correctRate}%` }}
                    />
                  </div>

                  {/* Answer Distribution (for multiple choice) */}
                  {qStat.answerDistribution && (
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <div className="mb-2 text-xs font-semibold text-gray-700">
                        Phân bố đáp án được chọn:
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {qStat.answerDistribution.map((dist) => (
                          <div
                            key={dist.answerId}
                            className="flex items-center justify-between p-2 rounded bg-gray-50"
                          >
                            <span className="text-xs text-gray-600">
                              Đáp án {dist.answerId.slice(-1)}
                            </span>
                            <span className="text-xs font-semibold text-gray-900">
                              {dist.count} ({((dist.count / qStat.totalAttempts) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {isPoor && (
                    <div className="p-3 mt-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-red-800">
                          <span className="font-semibold">Khuyến nghị: </span>
                          Câu hỏi này có tỷ lệ đúng thấp. Bạn nên xem xét lại độ khó hoặc cách diễn đạt.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}