'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuestionCard from '@/components/quiz/QuestionCard';
import { Quiz, StudentAnswer } from '@/types/quiz';
import { mockQuizzes } from '@/data/mockQuizzes';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Flag,
  Send
} from 'lucide-react';
import Button from '@/components/Button';

export default function QuizPlayerPage({ 
  params 
}: { 
  params: { id: string; lessonId: string } 
}) {
  const router = useRouter();
  const courseId = params.id;
  const lessonId = params.lessonId;

  // Find quiz for this lesson
  const quiz = mockQuizzes.find(q => q.lessonId === lessonId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, Partial<StudentAnswer>>>(new Map());
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!quiz || !hasStarted || !quiz.timeLimit) return;

    setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, hasStarted]);

  if (!quiz) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Không tìm thấy bài quiz
          </h1>
          <p className="mb-6 text-gray-600">
            Bài quiz cho bài học này chưa được tạo hoặc đã bị xóa.
          </p>
          <Button
            onClick={() => router.push(`/courses/${courseId}/lessons/${lessonId}`)}
          >
            Quay lại bài học
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = answers.size;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: Partial<StudentAnswer>) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, answer);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleToggleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestion.id)) {
      newFlagged.delete(currentQuestion.id);
    } else {
      newFlagged.add(currentQuestion.id);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleSubmit = async () => {
    if (answers.size === 0) {
      alert('Bạn chưa trả lời câu hỏi nào!');
      return;
    }

    if (!confirm(`Bạn có chắc muốn nộp bài? Bạn đã trả lời ${answers.size}/${quiz.questions.length} câu.`)) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Navigate to results
    router.push(`/courses/${courseId}/lessons/${lessonId}/quiz/results?attemptId=attempt-new`);
  };

  const handleStart = () => {
    setHasStarted(true);
  };

  // Start Screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <button
              onClick={() => router.push(`/courses/${courseId}/lessons/${lessonId}`)}
              className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
              Quay lại bài học
            </button>

            {/* Quiz Info Card */}
            <div className="p-8 bg-white shadow-lg rounded-xl">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {quiz.title}
                </h1>
                <p className="text-gray-600">
                  {quiz.description}
                </p>
              </div>

              {/* Quiz Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
                <div className="p-4 text-center rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-gray-900">
                    {quiz.questions.length}
                  </div>
                  <div className="text-sm text-gray-600">Câu hỏi</div>
                </div>
                <div className="p-4 text-center rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-gray-900">
                    {quiz.totalPoints}
                  </div>
                  <div className="text-sm text-gray-600">Điểm</div>
                </div>
                <div className="p-4 text-center rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-gray-900">
                    {quiz.timeLimit || '∞'}
                  </div>
                  <div className="text-sm text-gray-600">Phút</div>
                </div>
                <div className="p-4 text-center rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-gray-900">
                    {quiz.passingScore}%
                  </div>
                  <div className="text-sm text-gray-600">Điểm đạt</div>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-6 mb-8 border border-blue-200 rounded-lg bg-blue-50">
                <h3 className="mb-3 font-semibold text-blue-900">Hướng dẫn làm bài:</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Bạn có {quiz.timeLimit ? `${quiz.timeLimit} phút` : 'không giới hạn thời gian'} để hoàn thành bài quiz</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Điểm đạt tối thiểu: {quiz.passingScore}%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Bạn có thể đánh dấu câu hỏi để xem lại sau</span>
                  </li>
                  {quiz.maxAttempts && (
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Số lần làm tối đa: {quiz.maxAttempts}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Start Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleStart}
                  variant="primary"
                  className="px-8 py-4 text-lg"
                >
                  Bắt đầu làm bài
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Player
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Progress */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-900">
                {currentQuestionIndex + 1} / {quiz.questions.length}
              </span>
              <div className="w-48 h-2 overflow-hidden bg-gray-200 rounded-full">
                <div 
                  className="h-full transition-all bg-gradient-to-r from-blue-600 to-purple-600"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Timer */}
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="font-mono font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFlag}
                className={`p-2 rounded-lg transition-colors ${
                  flaggedQuestions.has(currentQuestion.id)
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Flag className="w-5 h-5" />
              </button>
              
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="primary"
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Nộp bài
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Question Card */}
            <div className="lg:col-span-3">
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={quiz.questions.length}
                onAnswer={handleAnswer}
                savedAnswer={answers.get(currentQuestion.id)}
              />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Câu trước
                </Button>

                <div className="text-sm text-gray-600">
                  {answeredCount} / {quiz.questions.length} đã trả lời
                </div>

                <Button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === quiz.questions.length - 1}
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  Câu sau
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Question Navigator */}
            <div className="lg:col-span-1">
              <div className="sticky p-4 bg-white border border-gray-200 rounded-xl top-24">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Danh sách câu hỏi
                </h3>
                <div className="grid grid-cols-5 gap-2 lg:grid-cols-4">
                  {quiz.questions.map((q, index) => {
                    const isAnswered = answers.has(q.id);
                    const isCurrent = index === currentQuestionIndex;
                    const isFlagged = flaggedQuestions.has(q.id);

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`relative aspect-square rounded-lg font-semibold text-sm transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110'
                            : isAnswered
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="absolute w-3 h-3 text-yellow-500 -top-1 -right-1 fill-yellow-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="pt-4 mt-4 space-y-2 text-xs border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded" />
                    <span className="text-gray-600">Đã trả lời</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded" />
                    <span className="text-gray-600">Chưa trả lời</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-600">Đã đánh dấu</span>
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