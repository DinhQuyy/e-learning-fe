'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  SlidersHorizontal,
  Star,
  Users,
  Clock,
  Grid3x3,
  List,
  ChevronDown,
  Filter,
  X
} from 'lucide-react';

// Mock data
const allCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    instructor: 'Nguyễn Văn A',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    rating: 4.8,
    reviews: 1547,
    students: 12547,
    price: 1500000,
    originalPrice: 2500000,
    category: 'Web Development',
    level: 'Beginner',
    duration: '45 giờ',
    lessons: 250,
    description: 'Học lập trình web từ A-Z với HTML, CSS, JavaScript, React, Node.js và MongoDB',
    lastUpdated: '2024-01',
    bestseller: true,
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning Masterclass',
    instructor: 'Trần Thị B',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    rating: 4.9,
    reviews: 2134,
    students: 8934,
    price: 2000000,
    originalPrice: 3000000,
    category: 'Data Science',
    level: 'Intermediate',
    duration: '60 giờ',
    lessons: 320,
    description: 'Master Data Science với Python, Pandas, Machine Learning và Deep Learning',
    lastUpdated: '2024-02',
    bestseller: true,
  },
  {
    id: 3,
    title: 'UI/UX Design: Từ Zero đến Hero',
    instructor: 'Lê Minh C',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    rating: 4.7,
    reviews: 892,
    students: 6789,
    price: 1200000,
    originalPrice: 1800000,
    category: 'Design',
    level: 'Beginner',
    duration: '32 giờ',
    lessons: 180,
    description: 'Học UI/UX từ cơ bản với Figma, Adobe XD và nguyên lý thiết kế',
    lastUpdated: '2024-01',
    bestseller: false,
  },
  {
    id: 4,
    title: 'Mobile App Development với React Native',
    instructor: 'Phạm Hoàng D',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    rating: 4.8,
    reviews: 1203,
    students: 5432,
    price: 1800000,
    originalPrice: 2500000,
    category: 'Mobile Development',
    level: 'Advanced',
    duration: '50 giờ',
    lessons: 280,
    description: 'Xây dựng ứng dụng mobile đa nền tảng với React Native',
    lastUpdated: '2024-02',
    bestseller: false,
  },
  {
    id: 5,
    title: 'Python Programming for Beginners',
    instructor: 'Võ Thị E',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
    rating: 4.6,
    reviews: 756,
    students: 8234,
    price: 999000,
    originalPrice: 1500000,
    category: 'Programming',
    level: 'Beginner',
    duration: '28 giờ',
    lessons: 150,
    description: 'Học Python từ cơ bản đến nâng cao cho người mới bắt đầu',
    lastUpdated: '2023-12',
    bestseller: false,
  },
  {
    id: 6,
    title: 'Digital Marketing Masterclass 2024',
    instructor: 'Đặng Văn F',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    rating: 4.7,
    reviews: 1089,
    students: 9876,
    price: 1400000,
    originalPrice: 2000000,
    category: 'Marketing',
    level: 'Intermediate',
    duration: '38 giờ',
    lessons: 200,
    description: 'Master Digital Marketing: SEO, SEM, Social Media, Email Marketing',
    lastUpdated: '2024-01',
    bestseller: true,
  },
];

const categories = [
  'All Categories',
  'Web Development',
  'Data Science',
  'Design',
  'Mobile Development',
  'Programming',
  'Marketing',
  'Business',
  'Photography',
];

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const durations = ['All Durations', 'Under 10 hours', '10-20 hours', '20+ hours'];
const priceRanges = [
  'All Prices',
  'Free',
  'Under 1M',
  '1M - 2M',
  '2M+',
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [selectedPrice, setSelectedPrice] = useState('All Prices');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter courses
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
    
    let matchesDuration = true;
    if (selectedDuration === 'Under 10 hours') {
      matchesDuration = parseInt(course.duration) < 10;
    } else if (selectedDuration === '10-20 hours') {
      const hours = parseInt(course.duration);
      matchesDuration = hours >= 10 && hours <= 20;
    } else if (selectedDuration === '20+ hours') {
      matchesDuration = parseInt(course.duration) > 20;
    }

    let matchesPrice = true;
    if (selectedPrice === 'Free') {
      matchesPrice = course.price === 0;
    } else if (selectedPrice === 'Under 1M') {
      matchesPrice = course.price < 1000000;
    } else if (selectedPrice === '1M - 2M') {
      matchesPrice = course.price >= 1000000 && course.price < 2000000;
    } else if (selectedPrice === '2M+') {
      matchesPrice = course.price >= 2000000;
    }

    return matchesSearch && matchesCategory && matchesLevel && matchesDuration && matchesPrice;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.students - a.students;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.lastUpdated.localeCompare(a.lastUpdated);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedLevel('All Levels');
    setSelectedDuration('All Durations');
    setSelectedPrice('All Prices');
    setSearchTerm('');
  };

  const hasActiveFilters = selectedCategory !== 'All Categories' ||
                          selectedLevel !== 'All Levels' ||
                          selectedDuration !== 'All Durations' ||
                          selectedPrice !== 'All Prices' ||
                          searchTerm !== '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="py-16 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Khám phá khóa học
          </h1>
          <p className="mb-8 text-xl text-blue-100">
            Tìm khóa học phù hợp với bạn trong hơn 1,200 khóa học chất lượng cao
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pl-12 pr-4 text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8 mx-auto">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="flex-shrink-0 hidden w-64 lg:block">
            <div className="sticky p-6 space-y-6 bg-white rounded-xl top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Danh mục
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Trình độ
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Thời lượng
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Giá
                </label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priceRanges.map((price) => (
                    <option key={price} value={price}>
                      {price}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-white rounded-xl">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">
                  {sortedCourses.length} khóa học
                </span>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg lg:hidden hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="newest">Mới nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                </select>

                {/* View Mode */}
                <div className="flex gap-2 p-1 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                      viewMode === 'list'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="p-6 mb-6 space-y-4 bg-white lg:hidden rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Same filters as sidebar */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Danh mục
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Add other filters similarly */}
              </div>
            )}

            {/* Courses Grid/List */}
            {sortedCourses.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Không tìm thấy khóa học
                </h3>
                <p className="mb-4 text-gray-600">
                  Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {sortedCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group"
                  >
                    <div className="overflow-hidden transition-all bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-xl">
                      {/* Thumbnail */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                        />
                        {course.bestseller && (
                          <div className="absolute px-3 py-1 text-xs font-bold text-yellow-900 bg-yellow-400 rounded-full top-3 left-3">
                            Bestseller
                          </div>
                        )}
                        <div className="absolute px-3 py-1 text-sm font-semibold rounded-full top-3 right-3 bg-white/90 backdrop-blur-sm">
                          {course.level}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="text-sm font-semibold text-blue-600">
                          {course.category}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 transition-colors line-clamp-2 group-hover:text-blue-600">
                          {course.title}
                        </h3>

                        <div className="text-sm text-gray-600">
                          {course.instructor}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold">{course.rating}</span>
                            <span className="text-gray-500">({course.reviews})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {course.students.toLocaleString('vi-VN')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              ₫{course.price.toLocaleString('vi-VN')}
                            </div>
                            {course.originalPrice > course.price && (
                              <div className="text-sm text-gray-400 line-through">
                                ₫{course.originalPrice.toLocaleString('vi-VN')}
                              </div>
                            )}
                          </div>
                          {course.originalPrice > course.price && (
                            <div className="text-sm font-bold text-green-600">
                              -{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block group"
                  >
                    <div className="overflow-hidden transition-all bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-xl">
                      <div className="flex flex-col md:flex-row">
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-full h-48 overflow-hidden md:w-80">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                          />
                          {course.bestseller && (
                            <div className="absolute px-3 py-1 text-xs font-bold text-yellow-900 bg-yellow-400 rounded-full top-3 left-3">
                              Bestseller
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-blue-600">
                                  {course.category}
                                </span>
                                <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                                  {course.level}
                                </span>
                              </div>

                              <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                                {course.title}
                              </h3>

                              <p className="text-gray-600 line-clamp-2">
                                {course.description}
                              </p>

                              <div className="text-sm text-gray-600">
                                {course.instructor}
                              </div>

                              <div className="flex flex-wrap items-center gap-6 text-sm">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="font-semibold">{course.rating}</span>
                                  <span className="text-gray-500">({course.reviews})</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Users className="w-4 h-4" />
                                  {course.students.toLocaleString('vi-VN')} học viên
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                  <Clock className="w-4 h-4" />
                                  {course.duration}
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-3xl font-bold text-gray-900">
                                ₫{course.price.toLocaleString('vi-VN')}
                              </div>
                              {course.originalPrice > course.price && (
                                <>
                                  <div className="text-sm text-gray-400 line-through">
                                    ₫{course.originalPrice.toLocaleString('vi-VN')}
                                  </div>
                                  <div className="mt-1 text-sm font-bold text-green-600">
                                    -{Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}