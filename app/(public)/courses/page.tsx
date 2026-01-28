'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  SlidersHorizontal,
  Star,
  Users,
  Clock,
  Grid3x3,
  List,
  X
} from 'lucide-react';

type Category = {
  id: string | number;
  title: string;
};

type Course = {
  id: string | number;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  students: number;
  price: number;
  categoryId: string | number | null;
  categoryName: string;
  level: string;
  duration: string;
  lessons: number;
  description: string;
  lastUpdated: string;
  status: string;
};

const normalize = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const parseDurationHours = (value: unknown) => {
  const match = String(value ?? '').match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
};

const toNumber = (value: unknown) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const buildThumbnailUrl = (value: unknown, directusUrl: string) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (raw.startsWith('http')) return raw;
  return directusUrl ? `${directusUrl}/assets/${raw}` : '';
};

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const durations = ['All Durations', 'Under 10 hours', '10-20 hours', '20+ hours'];
const priceRanges = ['All Prices', 'Free', 'Under 1M', '1M - 2M', '2M+'];

const mockCategories: Category[] = [
  { id: 'web-development', title: 'Web Development' },
  { id: 'data-science', title: 'Data Science' },
  { id: 'design', title: 'Design' },
  { id: 'business', title: 'Business' },
  { id: 'marketing', title: 'Marketing' },
  { id: 'photography', title: 'Photography' },
];

const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    instructor: 'Nguyen Van A',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
    rating: 4.8,
    students: 12547,
    price: 1500000,
    categoryId: 'web-development',
    categoryName: 'Web Development',
    level: 'Beginner',
    duration: '45 hours',
    lessons: 250,
    description: 'Build full-stack web apps with HTML, CSS, JavaScript, React, and Node.js.',
    lastUpdated: '2024-01-12',
    status: 'published',
  },
  {
    id: 8,
    title: 'Modern Frontend Engineering with React',
    instructor: 'Mai Pham',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
    rating: 4.7,
    students: 8420,
    price: 1700000,
    categoryId: 'web-development',
    categoryName: 'Web Development',
    level: 'Intermediate',
    duration: '38 hours',
    lessons: 180,
    description: 'Build modern UI systems with React, hooks, and component-driven design.',
    lastUpdated: '2024-03-04',
    status: 'published',
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning Masterclass',
    instructor: 'Linh Tran',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    rating: 4.9,
    students: 8934,
    price: 2000000,
    categoryId: 'data-science',
    categoryName: 'Data Science',
    level: 'Intermediate',
    duration: '60 hours',
    lessons: 180,
    description: 'Master the full data science workflow with Python and scikit-learn.',
    lastUpdated: '2024-01-20',
    status: 'published',
  },
  {
    id: 9,
    title: 'Applied Machine Learning for Business',
    instructor: 'Bao Nguyen',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    rating: 4.8,
    students: 6100,
    price: 2200000,
    categoryId: 'data-science',
    categoryName: 'Data Science',
    level: 'Advanced',
    duration: '48 hours',
    lessons: 150,
    description: 'Use ML models to solve real business problems and drive decisions.',
    lastUpdated: '2024-02-18',
    status: 'published',
  },
  {
    id: 3,
    title: 'UI/UX Design: From Zero to Hero',
    instructor: 'An Pham',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
    rating: 4.7,
    students: 6789,
    price: 1200000,
    categoryId: 'design',
    categoryName: 'Design',
    level: 'Beginner',
    duration: '32 hours',
    lessons: 120,
    description: 'Learn UX research, wireframing, and high-fidelity UI design.',
    lastUpdated: '2024-02-06',
    status: 'published',
  },
  {
    id: 10,
    title: 'Product Design for SaaS Teams',
    instructor: 'Hana Le',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
    rating: 4.6,
    students: 5120,
    price: 1400000,
    categoryId: 'design',
    categoryName: 'Design',
    level: 'Intermediate',
    duration: '28 hours',
    lessons: 96,
    description: 'Design scalable product systems and collaborate with developers.',
    lastUpdated: '2024-03-10',
    status: 'published',
  },
  {
    id: 5,
    title: 'Business Strategy & Leadership Essentials',
    instructor: 'Trang Vo',
    thumbnail: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=1200',
    rating: 4.7,
    students: 7200,
    price: 1700000,
    categoryId: 'business',
    categoryName: 'Business',
    level: 'Intermediate',
    duration: '40 hours',
    lessons: 140,
    description: 'Build strategic thinking and lead teams with confidence.',
    lastUpdated: '2024-03-22',
    status: 'published',
  },
  {
    id: 11,
    title: 'Entrepreneurship & Startup Operations',
    instructor: 'Khanh Do',
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    rating: 4.6,
    students: 4300,
    price: 1600000,
    categoryId: 'business',
    categoryName: 'Business',
    level: 'Beginner',
    duration: '30 hours',
    lessons: 110,
    description: 'Learn startup fundamentals, operations, and growth strategies.',
    lastUpdated: '2024-02-14',
    status: 'published',
  },
  {
    id: 6,
    title: 'Digital Marketing Growth Blueprint',
    instructor: 'Lan Pham',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200',
    rating: 4.8,
    students: 7600,
    price: 1300000,
    categoryId: 'marketing',
    categoryName: 'Marketing',
    level: 'Beginner',
    duration: '28 hours',
    lessons: 95,
    description: 'Master SEO, content, and paid acquisition to scale growth.',
    lastUpdated: '2024-04-02',
    status: 'published',
  },
  {
    id: 12,
    title: 'Performance Marketing Playbook',
    instructor: 'Tung Nguyen',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200',
    rating: 4.7,
    students: 5850,
    price: 1500000,
    categoryId: 'marketing',
    categoryName: 'Marketing',
    level: 'Intermediate',
    duration: '34 hours',
    lessons: 120,
    description: 'Launch high-performing campaigns across paid channels.',
    lastUpdated: '2024-03-19',
    status: 'published',
  },
  {
    id: 7,
    title: 'Photography Masterclass: Light, Composition, Story',
    instructor: 'Ha Vu',
    thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
    rating: 4.6,
    students: 5200,
    price: 1100000,
    categoryId: 'photography',
    categoryName: 'Photography',
    level: 'Beginner',
    duration: '25 hours',
    lessons: 80,
    description: 'Capture stunning images and edit like a pro.',
    lastUpdated: '2024-02-28',
    status: 'published',
  },
  {
    id: 13,
    title: 'Portrait Photography Essentials',
    instructor: 'Nhi Nguyen',
    thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
    rating: 4.5,
    students: 4100,
    price: 1000000,
    categoryId: 'photography',
    categoryName: 'Photography',
    level: 'Beginner',
    duration: '20 hours',
    lessons: 72,
    description: 'Work with light and poses to shoot flattering portraits.',
    lastUpdated: '2024-03-12',
    status: 'published',
  },
];

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const categoryQuery = searchParams.get('category') ?? '';

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(
    categoryQuery || 'All Categories'
  );
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [selectedPrice, setSelectedPrice] = useState('All Prices');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';
  const categoryOptions = useMemo(() => {
    const options = ['All Categories', ...categories.map((cat) => cat.title)];
    if (categoryQuery && !options.includes(categoryQuery)) {
      options.splice(1, 0, categoryQuery);
    }
    return Array.from(new Set(options));
  }, [categories, categoryQuery]);

  useEffect(() => {
    if (searchQuery !== searchTerm) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (categoryQuery) {
      setSelectedCategory((prev) => (prev === categoryQuery ? prev : categoryQuery));
      return;
    }
    setSelectedCategory((prev) => (prev === 'All Categories' ? prev : 'All Categories'));
  }, [categoryQuery]);

  useEffect(() => {
    const term = searchTerm.trim();
    const category =
      selectedCategory === 'All Categories' ? '' : selectedCategory;
    if (term === searchQuery && category === categoryQuery) {
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams();
      if (term) {
        params.set('search', term);
      }
      if (category) {
        params.set('category', category);
      }
      const nextUrl = params.toString() ? `/courses?${params.toString()}` : '/courses';
      router.replace(nextUrl);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, selectedCategory, searchQuery, categoryQuery, router]);


  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const coursesQuery = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
        const [coursesRes, categoriesRes] = await Promise.all([
          fetch(`/api/courses${coursesQuery}`, { cache: 'no-store' }),
          fetch('/api/categories', { cache: 'no-store' }),
        ]);

        const coursesJson = await coursesRes.json().catch(() => null);
        const categoriesJson = await categoriesRes.json().catch(() => null);

        if (!coursesRes.ok || !coursesJson) {
          throw new Error(coursesJson?.message || 'Unable to load courses.');
        }

        const rawCourses: any[] = Array.isArray(coursesJson?.courses)
          ? coursesJson.courses
          : Array.isArray(coursesJson?.data)
            ? coursesJson.data
            : [];

        const rawCategories: any[] = Array.isArray(categoriesJson?.categories)
          ? categoriesJson.categories
          : Array.isArray(categoriesJson?.data)
            ? categoriesJson.data
            : [];

        const mappedCategories: Category[] = rawCategories.map((c) => ({
          id: c.id,
          title: c.title ?? c.name ?? String(c.id),
        }));

        const categoryMap = new Map<string, string>(
          mappedCategories.map((c) => [String(c.id), c.title])
        );

        const mappedCourses: Course[] = rawCourses.map((c) => {
          const categoryId = c.category ?? null;
          const categoryName =
            categoryId != null ? categoryMap.get(String(categoryId)) ?? String(categoryId) : '';

          return {
            id: c.id,
            title: c.title ?? c.name ?? '',
            instructor: c.teacher_name ?? c.instructor_name ?? c.instructor ?? '',
            thumbnail: buildThumbnailUrl(c.thumbnail, directusUrl),
            rating: toNumber(c.rating ?? c.rating_avg ?? 0),
            students: toNumber(c.students ?? c.students_count ?? 0),
            price: toNumber(c.price ?? 0),
            categoryId,
            categoryName,
            level: c.level ?? '',
            duration: c.duration ?? '',
            lessons: toNumber(c.lessons ?? c.lessons_count ?? 0),
            description: c.description ?? '',
            lastUpdated: c.updated_at ?? c.created_at ?? '',
            status: c.status ?? '',
          };
        });

        const normalizedCategoryTitles = new Set(
          mappedCategories.map((category) => normalize(category.title))
        );
        const nextCategories = [
          ...mappedCategories,
          ...mockCategories.filter(
            (category) => !normalizedCategoryTitles.has(normalize(category.title))
          ),
        ];

        if (!isActive) return;
        setCategories(nextCategories);
        setCourses(mappedCourses);
      } catch (err: any) {
        if (!isActive) return;
        console.error('Courses page load error:', err);
        setError(null);
        setCategories(mockCategories);
        setCourses([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [directusUrl, searchQuery]);

  // Filter courses
  const normalizedRealCategories = useMemo(
    () =>
      new Set(
        courses.map((course) => normalize(course.categoryName)).filter(Boolean)
      ),
    [courses]
  );

  const availableCourses = useMemo(() => {
    const fallbackCourses = mockCourses.filter(
      (course) => !normalizedRealCategories.has(normalize(course.categoryName))
    );

    return [...courses, ...fallbackCourses];
  }, [courses, normalizedRealCategories]);

  const filteredCourses = useMemo(() => {
    const term = normalize(searchTerm);
    const normalizedSelectedCategory = normalize(selectedCategory);
    const hasExactRealCategoryMatch =
      selectedCategory !== 'All Categories' &&
      courses.some(
        (course) => normalize(course.categoryName) === normalizedSelectedCategory
      );
    const allowSingleCategoryFallback =
      selectedCategory !== 'All Categories' &&
      !hasExactRealCategoryMatch &&
      normalizedRealCategories.size === 1;

    return availableCourses.filter((course) => {
      const matchesSearch =
        !term ||
        normalize(course.title).includes(term) ||
        normalize(course.description).includes(term) ||
        normalize(course.instructor).includes(term) ||
        normalize(course.categoryName).includes(term);

      const normalizedCourseCategory = normalize(course.categoryName);
      const matchesCategory =
        selectedCategory === 'All Categories' ||
        normalizedCourseCategory === normalizedSelectedCategory ||
        (allowSingleCategoryFallback &&
          normalizedRealCategories.has(normalizedCourseCategory));
      const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;

      let matchesDuration = true;
      const hours = parseDurationHours(course.duration);
      if (selectedDuration === 'Under 10 hours') {
        matchesDuration = hours > 0 && hours < 10;
      } else if (selectedDuration === '10-20 hours') {
        matchesDuration = hours >= 10 && hours <= 20;
      } else if (selectedDuration === '20+ hours') {
        matchesDuration = hours > 20;
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
  }, [
    availableCourses,
    courses,
    normalizedRealCategories,
    searchTerm,
    selectedCategory,
    selectedLevel,
    selectedDuration,
    selectedPrice,
  ]);

  // Sort courses
  const sortedCourses = useMemo(() => {
    return [...filteredCourses].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.students - a.students;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return String(b.lastUpdated ?? '').localeCompare(String(a.lastUpdated ?? ''));
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }, [filteredCourses, sortBy]);

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
      <div className="relative py-16 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div
          className="absolute rounded-full -top-24 -right-24 h-72 w-72 bg-white/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute rounded-full -bottom-28 -left-20 h-72 w-72 bg-blue-300/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative px-4 mx-auto">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl drop-shadow-sm">
              Khám phá khóa học
            </h1>
            <p className="mb-8 text-xl text-blue-100/95">
              Tìm khóa học phù hợp với bạn trong hơn 1,200 khóa học chất lượng cao
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-2xl bg-white/25 blur-xl"
                  aria-hidden="true"
                />
                <div className="relative flex items-center gap-3 px-4 py-3 transition duration-300 border shadow-2xl rounded-2xl border-white/70 bg-white/95 backdrop-blur focus-within:ring-4 focus-within:ring-white/80">
                  <Search className="w-5 h-5 text-blue-600" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 pr-2 text-gray-900 bg-transparent placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8 mx-auto">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="flex-shrink-0 hidden w-64 lg:block animate-fade-in">
            <div className="sticky p-6 space-y-6 bg-white border border-gray-200 shadow-sm rounded-xl top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Bộ lọc</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Danh mục
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Trình độ
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Thời lượng
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                >
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Giá
                </label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full px-3 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                >
                  {priceRanges.map((price) => (
                    <option key={price} value={price}>{price}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl animate-fade-in">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">
                  {loading ? 'Loading...' : `${sortedCourses.length} khóa học`}
                </span>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 transition-all border border-gray-300 rounded-lg lg:hidden hover:bg-gray-50 hover:border-blue-500"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Bộ lọc
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 transition-all border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
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
                    className={`p-2 rounded transition-all ${
                      viewMode === 'grid'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-all ${
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
            {error && (
              <div className="p-4 mb-4 text-sm text-orange-700 border border-orange-200 rounded-lg bg-orange-50">
                {error}
              </div>
            )}

            {/* Mobile Filters */}
            {showFilters && (
              <div className="p-6 mb-6 space-y-4 bg-white border border-gray-200 shadow-sm lg:hidden rounded-xl animate-slide-down">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Bộ lọc</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Same filters as sidebar */}
                <div className="space-y-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

                                    {/* Courses Grid/List */}
            {loading ? (
              <div className="p-12 text-center bg-white rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">Loading courses...</h3>
                <p className="mb-4 text-gray-600">Please wait while we fetch the latest courses.</p>
              </div>
            ) : sortedCourses.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">No courses found</h3>
                <p className="mb-4 text-gray-600">Try adjusting your filters or search query.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 hover:scale-105"
                >
                  Clear filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {sortedCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="overflow-hidden transition-all bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2">
                      {/* Thumbnail */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">
                            No thumbnail
                          </div>
                        )}
                        <div className="absolute px-3 py-1 text-sm font-semibold rounded-full top-3 right-3 bg-white/90 backdrop-blur-sm">
                          {course.level || 'N/A'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="text-sm font-semibold text-blue-600">
                          {course.categoryName || 'Uncategorized'}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 transition-colors line-clamp-2 group-hover:text-blue-600">
                          {course.title}
                        </h3>

                        <div className="text-sm text-gray-600">
                          {course.instructor || '-'}
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold">
                              {course.rating > 0 ? course.rating.toFixed(1) : '0.0'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students.toLocaleString('vi-VN')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration || '-'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="text-2xl font-bold text-gray-900">
                            đ{course.price.toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedCourses.map((course, index) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block group animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="overflow-hidden transition-all bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-xl">
                      <div className="flex flex-col md:flex-row">
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-full h-48 overflow-hidden bg-gray-100 md:w-80">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">
                              No thumbnail
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-blue-600">
                                  {course.categoryName || 'Uncategorized'}
                                </span>
                                <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                                  {course.level || 'N/A'}
                                </span>
                              </div>

                              <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                                {course.title}
                              </h3>

                              <p className="text-gray-600 line-clamp-2">
                                {course.description || 'No description available.'}
                              </p>

                              <div className="text-sm text-gray-600">
                                {course.instructor || '-'}
                              </div>

                              <div className="flex flex-wrap items-center gap-6 text-sm">
                                {course.rating > 0 ? (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-semibold">{course.rating.toFixed(1)}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-500">No rating</span>
                                )}
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
                                VND {course.price.toLocaleString('vi-VN')}
                              </div>
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

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}








