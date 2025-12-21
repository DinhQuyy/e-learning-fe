'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  Lock,
  Menu,
  X,
  Download,
  MessageSquare,
  Star,
  ChevronDown,
  BookOpen,
  Clock
} from 'lucide-react';

// Mock course data
const courseData = {
  id: 1,
  title: 'Complete Web Development Bootcamp 2024',
  instructor: 'Nguyễn Văn A',
  progress: 65,
  curriculum: [
    {
      id: 1,
      title: 'Giới thiệu và Setup',
      lessons: [
        { id: 1, title: 'Chào mừng đến khóa học', duration: '5:30', completed: true, locked: false },
        { id: 2, title: 'Cài đặt môi trường', duration: '10:00', completed: true, locked: false },
        { id: 3, title: 'Tổng quan về Web Development', duration: '15:00', completed: true, locked: false },
      ],
    },
    {
      id: 2,
      title: 'HTML Fundamentals',
      lessons: [
        { id: 4, title: 'HTML là gì?', duration: '12:00', completed: true, locked: false },
        { id: 5, title: 'Cấu trúc cơ bản HTML', duration: '15:00', completed: true, locked: false },
        { id: 6, title: 'HTML Tags và Elements', duration: '20:00', completed: false, locked: false },
        { id: 7, title: 'Forms và Input', duration: '18:00', completed: false, locked: false },
      ],
    },
    {
      id: 3,
      title: 'CSS Styling',
      lessons: [
        { id: 8, title: 'CSS Selectors', duration: '15:00', completed: false, locked: false },
        { id: 9, title: 'Box Model', duration: '20:00', completed: false, locked: false },
        { id: 10, title: 'Flexbox', duration: '25:00', completed: false, locked: false },
        { id: 11, title: 'CSS Grid', duration: '22:00', completed: false, locked: true },
      ],
    },
    {
      id: 4,
      title: 'JavaScript Basics',
      lessons: [
        { id: 12, title: 'Variables và Data Types', duration: '18:00', completed: false, locked: true },
        { id: 13, title: 'Functions', duration: '22:00', completed: false, locked: true },
        { id: 14, title: 'Objects và Arrays', duration: '25:00', completed: false, locked: true },
      ],
    },
  ],
};

const currentLesson = {
  id: 6,
  title: 'HTML Tags và Elements',
  description: 'Học về các HTML tags phổ biến và cách sử dụng chúng hiệu quả',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  duration: '20:00',
  resources: [
    { name: 'HTML Cheat Sheet.pdf', size: '2.4 MB' },
    { name: 'Code Examples.zip', size: '1.8 MB' },
  ],
};

export default function LearningPage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [expandedSection, setExpandedSection] = useState<number>(2);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'qa'>('overview');

  // Calculate overall progress
  const totalLessons = courseData.curriculum.reduce((sum, section) => sum + section.lessons.length, 0);
  const completedLessons = courseData.curriculum.reduce(
    (sum, section) => sum + section.lessons.filter((l) => l.completed).length,
    0
  );

  // Find current lesson index
  const allLessons = courseData.curriculum.flatMap((section) => section.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link
            href="/my-learning"
            className="flex items-center gap-2 text-gray-300 transition-colors hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden md:inline">Quay lại khóa học</span>
          </Link>
        </div>

        <div className="flex-1 hidden max-w-2xl mx-4 md:block">
          <h1 className="text-lg font-semibold text-white truncate">
            {courseData.title}
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex-1 h-2 overflow-hidden bg-gray-700 rounded-full">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-400">
              {completedLessons}/{totalLessons}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-300 transition-colors rounded-lg hover:bg-gray-700 hover:text-white">
            <Star className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video & Content Area */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Video Player */}
          <div className="w-full bg-black aspect-video">
            <iframe
              src={currentLesson.videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Lesson Info */}
          <div className="p-6 bg-white border-b">
            <div className="max-w-5xl mx-auto">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                {currentLesson.title}
              </h2>
              <p className="mb-4 text-gray-600">{currentLesson.description}</p>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {prevLesson ? (
                  <button className="flex items-center gap-2 px-6 py-3 font-semibold transition-all border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600">
                    <ChevronLeft className="w-5 h-5" />
                    Bài trước
                  </button>
                ) : (
                  <div></div>
                )}

                {nextLesson && !nextLesson.locked && (
                  <button className="flex items-center gap-2 px-6 py-3 ml-auto font-semibold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700">
                    Bài tiếp theo
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all bg-green-600 rounded-lg hover:bg-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="max-w-5xl px-6 mx-auto">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 border-b-2 transition-colors font-semibold ${
                    activeTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tổng quan
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`py-4 border-b-2 transition-colors font-semibold ${
                    activeTab === 'resources'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tài liệu
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`py-4 border-b-2 transition-colors font-semibold ${
                    activeTab === 'qa'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Hỏi đáp
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              {activeTab === 'overview' && (
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="mb-4 text-xl font-bold">Về bài học này</h3>
                  <p className="mb-6 text-gray-700">{currentLesson.description}</p>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Bạn sẽ học được:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Hiểu về các HTML tags cơ bản</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Cách sử dụng semantic HTML</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Best practices khi viết HTML</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="mb-4 text-xl font-bold">Tài liệu bài học</h3>
                  <div className="space-y-3">
                    {currentLesson.resources.map((resource, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 transition-colors border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                            <Download className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-sm text-gray-500">{resource.size}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 font-semibold text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                          Tải xuống
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="mb-4 text-xl font-bold">Hỏi đáp</h3>
                  <div className="py-12 text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="mb-4 text-gray-600">Chưa có câu hỏi nào</p>
                    <button className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                      Đặt câu hỏi đầu tiên
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Curriculum */}
        {showSidebar && (
          <div className="flex-shrink-0 overflow-y-auto bg-white border-l w-80 md:w-96">
            <div className="sticky top-0 z-10 p-4 bg-white border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">Nội dung khóa học</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {completedLessons}/{totalLessons} bài học • {courseData.progress}%
              </div>
            </div>

            <div className="divide-y">
              {courseData.curriculum.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() =>
                      setExpandedSection(expandedSection === section.id ? 0 : section.id)
                    }
                    className="flex items-center justify-between w-full p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center flex-1 gap-3 text-left">
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          expandedSection === section.id ? 'rotate-180' : ''
                        }`}
                      />
                      <div>
                        <div className="font-semibold">{section.title}</div>
                        <div className="text-sm text-gray-500">
                          {section.lessons.length} bài học
                        </div>
                      </div>
                    </div>
                  </button>

                  {expandedSection === section.id && (
                    <div className="bg-gray-50">
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          className={`w-full p-4 pl-12 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left ${
                            lesson.id === currentLesson.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                          }`}
                          disabled={lesson.locked}
                        >
                          <div className="flex-shrink-0">
                            {lesson.locked ? (
                              <Lock className="w-4 h-4 text-gray-400" />
                            ) : lesson.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${
                              lesson.locked ? 'text-gray-400' : 'text-gray-900'
                            }`}>
                              {lesson.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {lesson.duration}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}