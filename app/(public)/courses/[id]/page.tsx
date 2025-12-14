'use client';

import Link from 'next/link';
import { 
  Star,
  Users,
  Clock,
  Globe,
  Award,
  PlayCircle,
  Download,
  CheckCircle2,
  ChevronDown,
  Share2,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { useState } from 'react';

// Mock data - trong thực tế sẽ fetch từ API dựa vào params.id
const courseData = {
  id: 1,
  title: 'Complete Web Development Bootcamp 2024',
  subtitle: 'Trở thành Full-Stack Developer chuyên nghiệp với HTML, CSS, JavaScript, React, Node.js',
  instructor: {
    name: 'Nguyễn Văn A',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3B82F6&color=fff',
    title: 'Senior Full-Stack Developer',
    students: 45000,
    courses: 12,
    rating: 4.8,
  },
  thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  rating: 4.8,
  reviewCount: 1547,
  students: 12547,
  price: 1500000,
  originalPrice: 2500000,
  category: 'Web Development',
  level: 'Beginner',
  duration: '45 giờ',
  lessons: 250,
  language: 'Tiếng Việt',
  lastUpdated: 'Tháng 1, 2024',
  bestseller: true,
  
  description: `
    Khóa học Web Development toàn diện nhất dành cho người mới bắt đầu. 
    Bạn sẽ học từ HTML/CSS cơ bản đến xây dựng ứng dụng Full-Stack hoàn chỉnh với React và Node.js.
    
    Sau khóa học này, bạn sẽ có thể:
    - Xây dựng website responsive đẹp mắt
    - Làm việc với JavaScript hiện đại (ES6+)
    - Phát triển ứng dụng với React
    - Xây dựng API với Node.js và Express
    - Làm việc với Database (MongoDB, SQL)
  `,
  
  whatYouLearn: [
    'HTML5 và CSS3 từ cơ bản đến nâng cao',
    'JavaScript ES6+ và lập trình hướng đối tượng',
    'React.js và React Hooks',
    'Node.js và Express.js',
    'MongoDB và Mongoose',
    'RESTful API Design',
    'Authentication và Authorization',
    'Deploy ứng dụng lên Production',
    'Git và GitHub',
    'Responsive Design và Mobile-First',
    'Best practices và Clean Code',
    'Real-world projects và Portfolio',
  ],
  
  requirements: [
    'Máy tính có kết nối Internet',
    'Không cần kiến thức lập trình trước đó',
    'Đam mê học hỏi và sẵn sàng thử thách',
  ],
  
  curriculum: [
    {
      title: 'Giới thiệu và Setup',
      lessons: 8,
      duration: '45 phút',
      items: [
        { title: 'Chào mừng đến khóa học', duration: '5:30', free: true },
        { title: 'Cài đặt môi trường', duration: '10:00', free: true },
        { title: 'Tổng quan về Web Development', duration: '15:00', free: false },
        { title: 'Cấu trúc khóa học', duration: '8:30', free: false },
      ],
    },
    {
      title: 'HTML Fundamentals',
      lessons: 25,
      duration: '3 giờ',
      items: [
        { title: 'HTML là gì?', duration: '12:00', free: false },
        { title: 'Cấu trúc cơ bản HTML', duration: '15:00', free: false },
        { title: 'HTML Tags và Elements', duration: '20:00', free: false },
        { title: 'Forms và Input', duration: '18:00', free: false },
      ],
    },
    {
      title: 'CSS Styling',
      lessons: 30,
      duration: '4 giờ',
      items: [
        { title: 'CSS Selectors', duration: '15:00', free: false },
        { title: 'Box Model', duration: '20:00', free: false },
        { title: 'Flexbox', duration: '25:00', free: false },
        { title: 'CSS Grid', duration: '22:00', free: false },
      ],
    },
    {
      title: 'JavaScript Basics',
      lessons: 40,
      duration: '6 giờ',
      items: [
        { title: 'Variables và Data Types', duration: '18:00', free: false },
        { title: 'Functions', duration: '22:00', free: false },
        { title: 'Objects và Arrays', duration: '25:00', free: false },
        { title: 'DOM Manipulation', duration: '30:00', free: false },
      ],
    },
    {
      title: 'React Development',
      lessons: 50,
      duration: '8 giờ',
      items: [
        { title: 'React Components', duration: '25:00', free: false },
        { title: 'State và Props', duration: '30:00', free: false },
        { title: 'Hooks', duration: '35:00', free: false },
        { title: 'Context API', duration: '28:00', free: false },
      ],
    },
    {
      title: 'Backend với Node.js',
      lessons: 45,
      duration: '7 giờ',
      items: [
        { title: 'Node.js Introduction', duration: '20:00', free: false },
        { title: 'Express.js Basics', duration: '30:00', free: false },
        { title: 'RESTful APIs', duration: '35:00', free: false },
        { title: 'Database Integration', duration: '40:00', free: false },
      ],
    },
  ],
  
  reviews: [
    {
      id: 1,
      user: 'Trần Văn B',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Van+B',
      rating: 5,
      date: '2 tuần trước',
      comment: 'Khóa học rất chi tiết và dễ hiểu. Giảng viên giải thích rất rõ ràng. Recommend!',
    },
    {
      id: 2,
      user: 'Lê Thị C',
      avatar: 'https://ui-avatars.com/api/?name=Le+Thi+C',
      rating: 5,
      date: '1 tháng trước',
      comment: 'Tốt nhất! Từ không biết gì đến giờ đã làm được website hoàn chỉnh.',
    },
    {
      id: 3,
      user: 'Phạm Văn D',
      avatar: 'https://ui-avatars.com/api/?name=Pham+Van+D',
      rating: 4,
      date: '3 tuần trước',
      comment: 'Nội dung tốt, giảng dạy dễ hiểu. Tuy nhiên phần backend hơi nhanh.',
    },
  ],
};

export default function CourseDetailPage() {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const discount = Math.round(
    ((courseData.originalPrice - courseData.price) / courseData.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-white bg-gray-900">
        <div className="container px-4 py-12 mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/" className="hover:text-white">Home</Link>
                <span>/</span>
                <Link href="/courses" className="hover:text-white">Courses</Link>
                <span>/</span>
                <span className="text-white">{courseData.category}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                {courseData.bestseller && (
                  <span className="px-3 py-1 text-sm font-bold text-yellow-900 bg-yellow-400 rounded-full">
                    Bestseller
                  </span>
                )}
                <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">
                  {courseData.category}
                </span>
                <span className="px-3 py-1 text-sm text-white bg-gray-700 rounded-full">
                  {courseData.level}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                {courseData.title}
              </h1>

              <p className="text-xl text-gray-300">
                {courseData.subtitle}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{courseData.rating}</span>
                  <span className="text-gray-400">
                    ({courseData.reviewCount.toLocaleString()} đánh giá)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-5 h-5" />
                  <span>{courseData.students.toLocaleString()} học viên</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-5 h-5" />
                  <span>{courseData.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Globe className="w-5 h-5" />
                  <span>{courseData.language}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4">
                <img
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="text-sm text-gray-400">Giảng viên</div>
                  <div className="font-semibold">{courseData.instructor.name}</div>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                Cập nhật lần cuối: {courseData.lastUpdated}
              </div>
            </div>

            {/* Right Card - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky overflow-hidden bg-white shadow-2xl rounded-xl top-8">
                {/* Preview */}
                <div className="relative aspect-video">
                  <img
                    src={courseData.thumbnail}
                    alt={courseData.title}
                    className="object-cover w-full h-full"
                  />
                  <button className="absolute inset-0 flex items-center justify-center transition-colors bg-black/50 hover:bg-black/40 group">
                    <div className="flex items-center justify-center w-16 h-16 transition-transform bg-white rounded-full group-hover:scale-110">
                      <PlayCircle className="w-8 h-8 text-blue-600" />
                    </div>
                  </button>
                </div>

                {/* Price & CTA */}
                <div className="p-6 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <div className="text-3xl font-bold text-gray-900">
                      ₫{courseData.price.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-400 line-through">
                      ₫{courseData.originalPrice.toLocaleString()}
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {discount}% OFF
                    </div>
                  </div>

                  <button className="w-full py-4 text-lg font-bold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl">
                    Đăng ký học ngay
                  </button>

                  <button className="w-full py-3 font-semibold text-gray-700 transition-all border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600">
                    Thêm vào giỏ hàng
                  </button>

                  <div className="text-sm text-center text-gray-600">
                    30 ngày đảm bảo hoàn tiền
                  </div>

                  <div className="pt-4 space-y-3 text-sm border-t">
                    <div className="font-semibold">Khóa học bao gồm:</div>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {courseData.duration} video
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Tài liệu tải xuống
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Chứng chỉ hoàn thành
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Truy cập trọn đời
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Heart className="w-5 h-5 mx-auto" />
                    </button>
                    <button className="flex-1 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Share2 className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg lg:hidden">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              ₫{courseData.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 line-through">
              ₫{courseData.originalPrice.toLocaleString()}
            </div>
          </div>
          <button className="flex-1 py-3 font-bold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            Đăng ký ngay
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12 mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            {/* What You'll Learn */}
            <section className="p-8 bg-white rounded-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Bạn sẽ học được gì
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {courseData.whatYouLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Content */}
            <section className="p-8 bg-white rounded-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Nội dung khóa học
              </h2>
              <div className="mb-4 text-sm text-gray-600">
                {courseData.curriculum.length} phần • {courseData.lessons} bài học •{' '}
                {courseData.duration}
              </div>
              <div className="space-y-2">
                {courseData.curriculum.map((section, index) => (
                  <div key={index} className="border rounded-lg">
                    <button
                      onClick={() =>
                        setExpandedSection(expandedSection === index ? null : index)
                      }
                      className="flex items-center justify-between w-full px-6 py-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            expandedSection === index ? 'rotate-180' : ''
                          }`}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {section.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {section.lessons} bài học • {section.duration}
                          </div>
                        </div>
                      </div>
                    </button>

                    {expandedSection === index && (
                      <div className="px-6 pb-4 space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between px-4 py-2 rounded hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <PlayCircle className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {item.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {item.free && (
                                <span className="text-xs font-semibold text-blue-600">
                                  Xem trước
                                </span>
                              )}
                              <span className="text-sm text-gray-500">
                                {item.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="p-8 bg-white rounded-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Yêu cầu
              </h2>
              <ul className="space-y-3">
                {courseData.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Description */}
            <section className="p-8 bg-white rounded-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Mô tả
              </h2>
              <div className="prose text-gray-700 whitespace-pre-line max-w-none">
                {courseData.description}
              </div>
            </section>

            {/* Instructor */}
            <section className="p-8 bg-white rounded-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Giảng viên
              </h2>
              <div className="flex items-start gap-6">
                <img
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  className="w-24 h-24 rounded-full"
                />
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold">{courseData.instructor.name}</h3>
                  <p className="text-gray-600">{courseData.instructor.title}</p>
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{courseData.instructor.rating} rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{courseData.instructor.students.toLocaleString()} học viên</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      <span>{courseData.instructor.courses} khóa học</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="p-8 bg-white rounded-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Đánh giá từ học viên
              </h2>
              <div className="space-y-6">
                {courseData.reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b last:border-0">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{review.user}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Desktop only, sticky */}
          <div className="hidden lg:block">
            {/* Space for sticky card */}
          </div>
        </div>
      </div>
    </div>
  );
}