'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgePercent,
  BookOpen,
  Clock,
  Grid3x3,
  Heart,
  List,
  Search,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

type WishlistItem = {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  updatedAt: string;
  addedAt: string;
  tag?: string;
};

const initialWishlist: WishlistItem[] = [];

const recommendedCourses: WishlistItem[] = [
  {
    id: 101,
    title: 'React + Next.js Studio: Build Real Products',
    instructor: 'Linh Tran',
    thumbnail:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800',
    rating: 4.9,
    students: 12450,
    price: 1290000,
    originalPrice: 1990000,
    category: 'Web Development',
    level: 'Intermediate',
    duration: '18h 20m',
    lessons: 126,
    updatedAt: '2025-01-12',
    addedAt: '2025-01-15',
    tag: 'Best Seller',
  },
  {
    id: 102,
    title: 'UI/UX Sprint: Research to Prototype',
    instructor: 'Ha Nguyen',
    thumbnail:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
    rating: 4.7,
    students: 8930,
    price: 990000,
    originalPrice: 1490000,
    category: 'Design',
    level: 'Beginner',
    duration: '12h 10m',
    lessons: 78,
    updatedAt: '2024-12-28',
    addedAt: '2025-01-10',
    tag: 'New',
  },
  {
    id: 103,
    title: 'Data Analytics with Python',
    instructor: 'Minh Vo',
    thumbnail:
      'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800',
    rating: 4.8,
    students: 15640,
    price: 1490000,
    category: 'Data Science',
    level: 'Intermediate',
    duration: '22h 30m',
    lessons: 142,
    updatedAt: '2025-01-02',
    addedAt: '2025-01-13',
  },
];

const categories = [
  'All categories',
  'Web Development',
  'Design',
  'Data Science',
  'Marketing',
  'Business',
];

const sortOptions = [
  { value: 'recent', label: 'Recently saved' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

const formatPrice = (value: number) => `VND ${value.toLocaleString('vi-VN')}`;

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] =
    useState<WishlistItem[]>(initialWishlist);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All categories');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const themeStyles: CSSProperties = {
    '--wishlist-accent': '#2563eb',
    '--wishlist-accent-strong': '#7c3aed',
    '--wishlist-soft': '#eff6ff',
    '--wishlist-ink': '#0f172a',
    '--wishlist-muted': '#64748b',
  };

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return wishlistItems.filter((item) => {
      const matchesCategory =
        category === 'All categories' || item.category === category;
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.instructor.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [wishlistItems, searchTerm, category]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
  }, [filteredItems, sortBy]);

  const stats = useMemo(() => {
    const total = wishlistItems.length;
    const priceDrops = wishlistItems.filter(
      (item) => item.originalPrice && item.originalPrice > item.price
    ).length;
    const newCourses = wishlistItems.filter((item) => item.tag === 'New').length;
    const avgRating = total
      ? wishlistItems.reduce((sum, item) => sum + item.rating, 0) / total
      : 0;

    return {
      total,
      priceDrops,
      newCourses,
      avgRating,
    };
  }, [wishlistItems]);

  const hasFilters = category !== 'All categories' || searchTerm.trim() !== '';

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('All categories');
  };

  const handleRemove = (id: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = (course: WishlistItem) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === course.id)) return prev;
      return [course, ...prev];
    });
  };

  return (
    <div className="min-h-screen bg-slate-50" style={themeStyles}>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div
          className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative px-4 py-12 mx-auto">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--wishlist-accent-strong)] shadow-sm">
                <Heart className="w-4 h-4" />
                Wishlist
              </div>
              <h1 className="mt-4 text-4xl font-bold text-[var(--wishlist-ink)] md:text-5xl">
                Save it now, learn it later.
              </h1>
              <p className="mt-4 max-w-xl text-lg text-[var(--wishlist-muted)]">
                Track courses you love, watch for price drops, and keep your
                next learning plan in one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-xl"
                >
                  Browse courses
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-[var(--wishlist-accent-strong)] shadow-sm transition hover:border-blue-300"
                >
                  Price alerts
                  <BadgePercent className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur wishlist-float">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--wishlist-muted)]">
                    Your wishlist pulse
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-[var(--wishlist-ink)]">
                    {stats.total}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--wishlist-muted)]">
                    courses saved
                  </p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--wishlist-soft)] text-[var(--wishlist-accent-strong)]">
                  <Heart className="w-7 h-7" />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-blue-100 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--wishlist-accent-strong)]">
                    <BadgePercent className="w-4 h-4" />
                    Price drops
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--wishlist-ink)]">
                    {stats.priceDrops}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--wishlist-accent-strong)]">
                    <Sparkles className="w-4 h-4" />
                    New releases
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--wishlist-ink)]">
                    {stats.newCourses}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-blue-100 bg-[var(--wishlist-soft)] p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-[var(--wishlist-muted)]">
                  <span>Average rating</span>
                  <span className="flex items-center gap-1 text-[var(--wishlist-accent-strong)]">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {stats.avgRating.toFixed(1)}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[var(--wishlist-accent)]"
                    style={{
                      width: `${Math.min(stats.avgRating * 20, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 py-10 mx-auto">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved courses..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl border border-blue-200 px-4 py-3 text-sm font-semibold text-[var(--wishlist-accent-strong)] transition hover:border-blue-300"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`rounded-lg p-2 ${
                viewMode === 'grid'
                  ? 'bg-[var(--wishlist-soft)] text-[var(--wishlist-accent-strong)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-lg p-2 ${
                viewMode === 'list'
                  ? 'bg-[var(--wishlist-soft)] text-[var(--wishlist-accent-strong)]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[var(--wishlist-ink)]">
                Saved courses
              </h2>
              <p className="text-sm text-[var(--wishlist-muted)]">
                {sortedItems.length} items in your wishlist
              </p>
            </div>
            {sortedItems.length > 0 && (
              <button
                type="button"
                onClick={() => setWishlistItems([])}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300"
              >
                Clear all
              </button>
            )}
          </div>

          {sortedItems.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-blue-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--wishlist-soft)] text-[var(--wishlist-accent-strong)]">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-[var(--wishlist-ink)]">
                Your wishlist is empty
              </h3>
              <p className="mt-2 text-sm text-[var(--wishlist-muted)]">
                Save courses to track updates, price drops, and upcoming lessons.
              </p>
              <Link
                href="/courses"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-xl"
              >
                Discover courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3 wishlist-stagger">
              {sortedItems.map((item) => {
                const hasDiscount =
                  item.originalPrice && item.originalPrice > item.price;
                const discountPercent = hasDiscount
                  ? Math.round(
                      ((item.originalPrice! - item.price) / item.originalPrice!) *
                        100
                    )
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      {item.tag && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--wishlist-accent-strong)] shadow-sm">
                          {item.tag}
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="absolute right-3 top-3 rounded-full bg-[var(--wishlist-accent)] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col space-y-4 p-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--wishlist-accent-strong)]">
                          {item.category}
                        </p>
                        <h3 className="mt-2 min-h-[3rem] text-lg font-semibold text-[var(--wishlist-ink)] line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="mt-2 min-h-[1.25rem] text-sm text-gray-500">
                          {item.instructor}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {item.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {item.students.toLocaleString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {item.duration}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t pt-4">
                        <div>
                          <p className="text-lg font-bold text-[var(--wishlist-ink)]">
                            {formatPrice(item.price)}
                          </p>
                          {hasDiscount && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(item.originalPrice!)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/courses/${item.id}`}
                            className="rounded-lg bg-[var(--wishlist-soft)] px-3 py-2 text-xs font-semibold text-[var(--wishlist-accent-strong)] transition hover:bg-blue-100"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 transition hover:border-blue-200 hover:text-[var(--wishlist-accent-strong)]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 space-y-4 wishlist-stagger">
              {sortedItems.map((item) => {
                const hasDiscount =
                  item.originalPrice && item.originalPrice > item.price;
                const discountPercent = hasDiscount
                  ? Math.round(
                      ((item.originalPrice! - item.price) / item.originalPrice!) *
                        100
                    )
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg md:flex-row"
                  >
                    <div className="relative h-40 w-full overflow-hidden rounded-xl md:h-36 md:w-56">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      {item.tag && (
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--wishlist-accent-strong)] shadow-sm">
                          {item.tag}
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="absolute right-3 top-3 rounded-full bg-[var(--wishlist-accent)] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="rounded-full bg-[var(--wishlist-soft)] px-3 py-1 font-semibold text-[var(--wishlist-accent-strong)]">
                            {item.category}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">
                            {item.level}
                          </span>
                        </div>
                        <h3 className="mt-3 text-xl font-semibold text-[var(--wishlist-ink)]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          {item.instructor}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {item.rating.toFixed(1)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {item.students.toLocaleString('vi-VN')} learners
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {item.duration}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                        <div>
                          <p className="text-lg font-bold text-[var(--wishlist-ink)]">
                            {formatPrice(item.price)}
                          </p>
                          {hasDiscount && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(item.originalPrice!)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/courses/${item.id}`}
                            className="rounded-lg bg-[var(--wishlist-soft)] px-4 py-2 text-xs font-semibold text-[var(--wishlist-accent-strong)] transition hover:bg-blue-100"
                          >
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 transition hover:border-blue-200 hover:text-[var(--wishlist-accent-strong)]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <section className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-[var(--wishlist-ink)]">
                Recommended for you
              </h3>
              <p className="text-sm text-[var(--wishlist-muted)]">
                Curated picks to start building your next wishlist.
              </p>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--wishlist-accent-strong)]"
            >
              Explore catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3 wishlist-stagger">
            {recommendedCourses.map((item) => {
              const inWishlist = wishlistItems.some(
                (saved) => saved.id === item.id
              );
              const hasDiscount =
                item.originalPrice && item.originalPrice > item.price;

              return (
                <div
                  key={item.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--wishlist-accent-strong)] shadow-sm">
                      <BookOpen className="w-3.5 h-3.5" />
                      {item.level}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col space-y-4 p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--wishlist-accent-strong)]">
                        {item.category}
                      </p>
                      <h4 className="mt-2 min-h-[3rem] text-lg font-semibold text-[var(--wishlist-ink)] line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="mt-2 min-h-[1.25rem] text-sm text-gray-500">
                        {item.instructor}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {item.rating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {item.students.toLocaleString('vi-VN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.duration}
                      </span>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t pt-4">
                      <div>
                        <p className="text-lg font-bold text-[var(--wishlist-ink)]">
                          {formatPrice(item.price)}
                        </p>
                        {hasDiscount && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(item.originalPrice!)}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAdd(item)}
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          inWishlist
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" />
                        {inWishlist ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes wishlist-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes wishlist-rise {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wishlist-float {
          animation: wishlist-float 6s ease-in-out infinite;
        }

        .wishlist-stagger > * {
          animation: wishlist-rise 0.6s ease both;
        }

        .wishlist-stagger > *:nth-child(2) {
          animation-delay: 0.08s;
        }

        .wishlist-stagger > *:nth-child(3) {
          animation-delay: 0.16s;
        }

        .wishlist-stagger > *:nth-child(4) {
          animation-delay: 0.24s;
        }

        .wishlist-stagger > *:nth-child(5) {
          animation-delay: 0.32s;
        }

        .wishlist-stagger > *:nth-child(6) {
          animation-delay: 0.4s;
        }

        @media (prefers-reduced-motion: reduce) {
          .wishlist-float,
          .wishlist-stagger > * {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
