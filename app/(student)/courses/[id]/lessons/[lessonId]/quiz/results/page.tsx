'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { mockQuizzes, mockAttempts } from '@/data/mockQuizzes';
import QuestionCard from '@/components/quiz/QuestionCard';
import Button from '@/components/Button';
import {
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Award,
  TrendingUp,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function QuizResultsPage({
  params
}: {
  params: { id: string; lessonId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.id;
  const lessonId = params.lessonId;
  const attemptId = searchParams.get('attemptId');

  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // Find quiz and attempt
  const quiz = mockQuizzes.find(q => q.lessonId === lessonId);
  const attempt = mockAttempts.find(a => a.id === attemptId);

  if (!quiz || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Không tìm thấy kết quả
          </h1>
          <Button onClick={() => router.push(`/courses/${courseId}`)}>
            Quay về khóa học
          </Button>
        </div>
      </div>
    );
  }

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const correctCount = attempt.answers.filter(a => a.isCorrect).length;
  const incorrectCount = attempt.answers.length - correctCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container px-4 py-6 mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-gray-600">Kết quả làm bài</p>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Result Card */}
          <div className="mb-8 overflow-hidden bg-white shadow-lg rounded-xl">
            {/* Result Header */}
            <div className={`p-8 text-center ${
              attempt.passed
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              {attempt.passed ? (
                <Trophy className="w-20 h-20 mx-auto mb-4 text-white" />
              ) : (
                <XCircle className="w-20 h-20 mx-auto mb-4 text-white" />
              )}
              <h2 className="mb-2 text-3xl font-bold text-white">
                {attempt.passed ? 'Chúc mừng! Bạn đã đạt!' : 'Chưa đạt yêu cầu'}
              </h2>
              <p className="text-white text-opacity-90">
                {attempt.passed
                  ? 'Bạn đã hoàn thành xuất sắc bài quiz này!'
                  : 'Đừng nản lòng, hãy ôn tập và thử lại!'}
              </p>
            </div>

            {/* Score Details */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8 md:grid-cols-4">
                <div className="text-center">
                  <div className="mb-2 text-4xl font-bold text-gray-900">
                    {attempt.percentage}%
                  </div>
                  <div className="text-sm text-gray-600">Điểm số</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {attempt.score} / {attempt.maxScore} điểm
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-2 text-4xl font-bold text-green-600">
                    {correctCount}
                  </div>
                  <div className="text-sm text-gray-600">Đúng</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.round((correctCount / attempt.answers.length) * 100)}%
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-2 text-4xl font-bold text-red-600">
                    {incorrectCount}
                  </div>
                  <div className="text-sm text-gray-600">Sai</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.round((incorrectCount / attempt.answers.length) * 100)}%
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-2 text-4xl font-bold text-blue-600">
                    {Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Thời gian</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {Math.floor(attempt.timeSpent / 60)} phút
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Tiến độ hoàn thành
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {attempt.percentage}%
                  </span>
                </div>
                <div className="w-full h-4 overflow-hidden bg-gray-200 rounded-full">
                  <div
                    className={`h-full transition-all ${
                      attempt.passed
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : 'bg-gradient-to-r from-red-500 to-rose-600'
                    }`}
                    style={{ width: `${attempt.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">0%</span>
                  <span className="text-xs font-medium text-blue-600">
                    Điểm đạt: {quiz.passingScore}%
                  </span>
                  <span className="text-xs text-gray-500">100%</span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 mb-8 md:grid-cols-3">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Độ chính xác</div>
                      <div className="text-xl font-bold text-gray-900">
                        {Math.round((correctCount / attempt.answers.length) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">TB mỗi câu</div>
                      <div className="text-xl font-bold text-gray-900">
                        {Math.round(attempt.timeSpent / attempt.answers.length)}s
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Lần thử</div>
                      <div className="text-xl font-bold text-gray-900">
                        {attempt.attemptNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  onClick={() => router.push(`/courses/${courseId}/lessons/${lessonId}`)}
                  variant="secondary"
                  className="flex items-center justify-center flex-1 gap-2"
                >
                  <Home className="w-5 h-5" />
                  Về bài học
                </Button>
                
                {!attempt.passed && quiz.maxAttempts && attempt.attemptNumber < quiz.maxAttempts && (
                  <Button
                    onClick={() => router.push(`/courses/${courseId}/lessons/${lessonId}/quiz`)}
                    variant="primary"
                    className="flex items-center justify-center flex-1 gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Làm lại ({quiz.maxAttempts - attempt.attemptNumber} lần còn lại)
                  </Button>
                )}

                {attempt.passed && (
                  <Button
                    onClick={() => router.push(`/courses/${courseId}`)}
                    variant="primary"
                    className="flex items-center justify-center flex-1 gap-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Tiếp tục học
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Review Answers */}
          {quiz.showCorrectAnswers && (
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h2 className="mb-6 text-xl font-bold text-gray-900">
                Xem lại đáp án
              </h2>

              <div className="space-y-4">
                {quiz.questions.map((question, index) => {
                  const studentAnswer = attempt.answers.find(a => a.questionId === question.id);
                  const isExpanded = expandedQuestions.has(question.id);

                  return (
                    <div
                      key={question.id}
                      className="overflow-hidden border border-gray-200 rounded-lg"
                    >
                      {/* Question Header */}
                      <button
                        onClick={() => toggleQuestion(question.id)}
                        className="flex items-center justify-between w-full p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            studentAnswer?.isCorrect
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {studentAnswer?.isCorrect ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              Câu {index + 1}
                            </div>
                            <div className="text-sm text-gray-600">
                              {studentAnswer?.pointsEarned || 0} / {question.points} điểm
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>

                      {/* Question Content */}
                      {isExpanded && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                          <QuestionCard
                            question={question}
                            questionNumber={index + 1}
                            totalQuestions={quiz.questions.length}
                            onAnswer={() => {}}
                            showResult={true}
                            savedAnswer={studentAnswer}
                            disabled={true}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}