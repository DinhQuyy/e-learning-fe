'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import {
  Sparkles,
  FileText,
  Upload,
  Settings,
  Wand2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { QuizQuestion, DifficultyLevel, QuestionType } from '@/types/quiz';

export default function AIQuizGeneratorPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const courseId = params.id;

  const [step, setStep] = useState<'input' | 'generating' | 'review'>('input');
  const [generatedQuestions, setGeneratedQuestions] = useState<QuizQuestion[]>([]);
  
  // Form state
  const [sourceType, setSourceType] = useState<'text' | 'file'>('text');
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [lessonId, setLessonId] = useState('');
  
  // Generation settings
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([
    'multiple_choice',
    'true_false'
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleGenerate = async () => {
    if (!textContent && !file) {
      alert('Vui lòng nhập nội dung hoặc tải file lên!');
      return;
    }

    setStep('generating');

    // Simulate AI generation (in real app, call Claude API)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock generated questions
    const mockQuestions: QuizQuestion[] = Array.from({ length: numQuestions }, (_, i) => ({
      id: `gen-q-${i + 1}`,
      type: questionTypes[Math.floor(Math.random() * questionTypes.length)],
      question: `Câu hỏi được tạo tự động số ${i + 1}?`,
      description: 'Dựa trên nội dung bạn cung cấp',
      points: 10,
      difficulty: difficulty,
      answers: [
        { id: 'a1', text: 'Đáp án A', isCorrect: true },
        { id: 'a2', text: 'Đáp án B', isCorrect: false },
        { id: 'a3', text: 'Đáp án C', isCorrect: false },
        { id: 'a4', text: 'Đáp án D', isCorrect: false },
      ],
      explanation: 'Giải thích chi tiết về đáp án đúng',
    }));

    setGeneratedQuestions(mockQuestions);
    setStep('review');
  };

  const handleRemoveQuestion = (questionId: string) => {
    setGeneratedQuestions(generatedQuestions.filter(q => q.id !== questionId));
  };

  const handleSaveQuiz = async () => {
    // In real app, save to Directus
    console.log('Saving quiz with questions:', generatedQuestions);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    router.push(`/instructor/courses/${courseId}/quizzes`);
  };

  const toggleQuestionType = (type: QuestionType) => {
    if (questionTypes.includes(type)) {
      setQuestionTypes(questionTypes.filter(t => t !== type));
    } else {
      setQuestionTypes([...questionTypes, type]);
    }
  };

  // Input Step
  if (step === 'input') {
    return (
      <div className="min-h-screen py-8 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="mb-4 text-gray-600 hover:text-gray-900"
              >
                ← Quay lại
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    AI Quiz Generator
                  </h1>
                  <p className="text-gray-600">
                    Tạo bài quiz tự động từ nội dung bài giảng
                  </p>
                </div>
              </div>
            </div>

            {/* Main Card */}
            <div className="p-8 bg-white shadow-lg rounded-xl">
              {/* Source Type Selection */}
              <div className="mb-8">
                <label className="block mb-3 text-sm font-semibold text-gray-900">
                  Nguồn nội dung
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSourceType('text')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      sourceType === 'text'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold text-gray-900">Văn bản</div>
                    <div className="text-sm text-gray-600">Nhập hoặc dán nội dung</div>
                  </button>

                  <button
                    onClick={() => setSourceType('file')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      sourceType === 'file'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="font-semibold text-gray-900">Tải file</div>
                    <div className="text-sm text-gray-600">PDF, DOCX, TXT</div>
                  </button>
                </div>
              </div>

              {/* Content Input */}
              <div className="mb-8">
                {sourceType === 'text' ? (
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-900">
                      Nội dung bài giảng
                    </label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Nhập hoặc dán nội dung bài giảng của bạn vào đây...

Ví dụ: JavaScript là ngôn ngữ lập trình phổ biến được sử dụng để tạo các trang web tương tác. Nó có thể chạy trên browser (client-side) hoặc server (Node.js)..."
                      className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {textContent.length} ký tự • Khuyến nghị: tối thiểu 500 ký tự
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-900">
                      Tải file lên
                    </label>
                    <div className="p-8 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      {file ? (
                        <div className="text-center">
                          <div className="mb-1 font-semibold text-gray-900">
                            {file.name}
                          </div>
                          <div className="mb-4 text-sm text-gray-600">
                            {(file.size / 1024).toFixed(2)} KB
                          </div>
                          <Button
                            onClick={() => setFile(null)}
                            variant="secondary"
                            className="text-sm"
                          >
                            Chọn file khác
                          </Button>
                        </div>
                      ) : (
                        <>
                          <p className="mb-2 text-gray-600">
                            Kéo thả file hoặc click để chọn
                          </p>
                          <p className="mb-4 text-sm text-gray-500">
                            Hỗ trợ: PDF, DOCX, TXT (tối đa 10MB)
                          </p>
                          <input
                            type="file"
                            accept=".pdf,.docx,.txt"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload">
                            <Button variant="secondary" className="cursor-pointer">
                              Chọn file
                            </Button>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Selection (Optional) */}
              <div className="mb-8">
                <label className="block mb-3 text-sm font-semibold text-gray-900">
                  Gắn với bài học (không bắt buộc)
                </label>
                <select
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn bài học --</option>
                  <option value="lesson-1">Bài 1: Giới thiệu JavaScript</option>
                  <option value="lesson-2">Bài 2: Biến và kiểu dữ liệu</option>
                  <option value="lesson-3">Bài 3: Hàm và Scope</option>
                </select>
              </div>

              {/* Generation Settings */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Settings className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cài đặt tạo câu hỏi
                  </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Number of Questions */}
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-900">
                      Số lượng câu hỏi
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>5</span>
                      <span className="font-semibold text-blue-600">{numQuestions}</span>
                      <span>30</span>
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-900">
                      Độ khó
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => setDifficulty(level)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            difficulty === level
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {level === 'easy' ? 'Dễ' : level === 'medium' ? 'TB' : 'Khó'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Question Types */}
                <div className="mt-6">
                  <label className="block mb-3 text-sm font-semibold text-gray-900">
                    Loại câu hỏi
                  </label>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {[
                      { type: 'multiple_choice' as QuestionType, label: 'Trắc nghiệm' },
                      { type: 'multiple_answer' as QuestionType, label: 'Nhiều đáp án' },
                      { type: 'true_false' as QuestionType, label: 'Đúng/Sai' },
                      { type: 'fill_blank' as QuestionType, label: 'Điền vào chỗ trống' },
                    ].map(({ type, label }) => (
                      <button
                        key={type}
                        onClick={() => toggleQuestionType(type)}
                        className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                          questionTypes.includes(type)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {questionTypes.includes(type) && (
                          <CheckCircle className="inline w-4 h-4 mr-2" />
                        )}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8 mt-8 border-t border-gray-200">
                <Button
                  onClick={() => router.back()}
                  variant="secondary"
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleGenerate}
                  variant="primary"
                  disabled={!textContent && !file}
                  className="flex items-center justify-center flex-1 gap-2"
                >
                  <Wand2 className="w-5 h-5" />
                  Tạo câu hỏi bằng AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generating Step
  if (step === 'generating') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="relative inline-block mb-8">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <Loader2 className="absolute w-8 h-8 text-blue-600 -top-2 -right-2 animate-spin" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Đang tạo câu hỏi...
          </h2>
          <p className="mb-4 text-gray-600">
            AI đang phân tích nội dung và tạo {numQuestions} câu hỏi cho bạn
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Quá trình này có thể mất 10-30 giây</span>
          </div>
        </div>
      </div>
    );
  }

  // Review Step
  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="p-6 mb-6 bg-white shadow-lg rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">
                  Xem trước và chỉnh sửa
                </h1>
                <p className="text-gray-600">
                  {generatedQuestions.length} câu hỏi đã được tạo
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          {/* Questions List */}
          <div className="mb-6 space-y-4">
            {generatedQuestions.map((question, index) => (
              <div key={question.id} className="p-6 bg-white shadow rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {question.question}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          question.difficulty === 'easy'
                            ? 'bg-green-100 text-green-800'
                            : question.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty === 'easy' ? 'Dễ' : question.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                        </span>
                        <span>•</span>
                        <span>{question.points} điểm</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-600 rounded-lg hover:bg-blue-50">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="p-2 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {question.answers && (
                  <div className="space-y-2">
                    {question.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          answer.isCorrect
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50'
                        }`}
                      >
                        {answer.isCorrect && (
                          <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
                        )}
                        <span className="text-gray-900">{answer.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {question.explanation && (
                  <div className="p-3 mt-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="text-sm">
                      <span className="font-semibold text-blue-900">Giải thích: </span>
                      <span className="text-blue-800">{question.explanation}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-white shadow-lg rounded-xl">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                onClick={() => setStep('input')}
                variant="secondary"
                className="flex-1"
              >
                Tạo lại
              </Button>
              <Button
                onClick={handleSaveQuiz}
                variant="primary"
                className="flex items-center justify-center flex-1 gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Lưu bài quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}