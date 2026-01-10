'use client';

import Link from 'next/link';
import {
  GraduationCap, 
  BookOpen, 
  Users, 
  TrendingUp,
  Star,
  Clock,
  PlayCircle,
  Award,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import HeroCourseSearch from '@/components/public/HeroCourseSearch';
import { usePublicSettings } from '@/lib/public-settings.client';

// Mock data
const featuredCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    instructor: 'Nguyễn Văn A',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    rating: 4.8,
    students: 12547,
    price: 1500000,
    category: 'Web Development',
    level: 'Beginner',
    duration: '45 giờ',
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning Masterclass',
    instructor: 'Trần Thị B',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    rating: 4.9,
    students: 8934,
    price: 2000000,
    category: 'Data Science',
    level: 'Intermediate',
    duration: '60 giờ',
  },
  {
    id: 3,
    title: 'UI/UX Design: Từ Zero đến Hero',
    instructor: 'Lê Minh C',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    rating: 4.7,
    students: 6789,
    price: 1200000,
    category: 'Design',
    level: 'Beginner',
    duration: '32 giờ',
  },
  {
    id: 4,
    title: 'Mobile App Development với React Native',
    instructor: 'Phạm Hoàng D',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    rating: 4.8,
    students: 5432,
    price: 1800000,
    category: 'Mobile Development',
    level: 'Advanced',
    duration: '50 giờ',
  },
];

const categories = [
  { name: 'Web Development', icon: '💻', courses: 245 },
  { name: 'Data Science', icon: '📊', courses: 189 },
  { name: 'Design', icon: '🎨', courses: 156 },
  { name: 'Business', icon: '💼', courses: 203 },
  { name: 'Marketing', icon: '📱', courses: 167 },
  { name: 'Photography', icon: '📷', courses: 134 },
];

const statIcons = [Users, BookOpen, GraduationCap, Award];
const featureIcons = [PlayCircle, Target, Zap, Award];
const formatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

export default function LandingPage() {
  const { settings: publicSettings } = usePublicSettings();
  const heroBadge = publicSettings.heroBadge || publicSettings.siteName;

  if (publicSettings.maintenance) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-16">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {publicSettings.siteName}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We are in maintenance mode. Please check back soon.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {publicSettings.siteDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {publicSettings.announcementEnabled && publicSettings.announcementText ? (
        <div className="bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white">
          {publicSettings.announcementText}
        </div>
      ) : null}
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container px-4 py-20 mx-auto md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                {heroBadge}
              </div>
              
              <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
                {publicSettings.heroTitle}
                {publicSettings.heroHighlight ? (
                  <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    {' '}{publicSettings.heroHighlight}
                  </span>
                ) : null}
              </h1>

              <p className="text-xl leading-relaxed text-gray-600">
                {publicSettings.heroSubtitle}
              </p>

              {/* Search Bar */}
              <HeroCourseSearch
                placeholder={publicSettings.searchPlaceholder}
                buttonLabel={publicSettings.searchButtonLabel}
              />

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href={publicSettings.heroPrimaryCtaHref}
                  className="flex items-center gap-2 px-8 py-4 font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-xl"
                >
                  {publicSettings.heroPrimaryCtaLabel}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href={publicSettings.heroSecondaryCtaHref}
                  className="px-8 py-4 font-semibold text-gray-700 transition-all border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:text-blue-600"
                >
                  {publicSettings.heroSecondaryCtaLabel}
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">4.8/5</span>
                  <span className="text-gray-500">(12,547 đánh giá)</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img
                  src={publicSettings.heroImageUrl}
                  alt={publicSettings.siteName}
                  className="shadow-2xl rounded-2xl"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute bg-purple-300 rounded-full -top-4 -right-4 w-72 h-72 blur-3xl opacity-20"></div>
              <div className="absolute bg-blue-300 rounded-full -bottom-4 -left-4 w-72 h-72 blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {publicSettings.showStats ? (
        <section className="py-12 bg-white border-y">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {publicSettings.stats.map((stat, index) => {
                const Icon = statIcons[index] ?? Users;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="mb-1 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Categories Section */}
      {publicSettings.showCategories ? (
        <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              {publicSettings.categoriesTitle}
            </h2>
            <p className="text-xl text-gray-600">
              {publicSettings.categoriesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/courses?category=${category.name}`}
                className="p-6 text-center transition-all bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg group"
              >
                <div className="mb-3 text-4xl transition-transform group-hover:scale-110">
                  {category.icon}
                </div>
                <div className="mb-1 font-semibold text-gray-900">
                  {category.name}
                </div>
                <div className="text-sm text-gray-500">
                  {category.courses} khóa học
                </div>
              </Link>
            ))}
          </div>
        </div>
        </section>
      ) : null}

      {/* Featured Courses */}
      {publicSettings.showFeaturedCourses ? (
        <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
                                        <h2 className="mb-4 text-4xl font-bold text-gray-900">
                {publicSettings.featuredTitle}
              </h2>
                                        <p className="text-xl text-gray-600">
                {publicSettings.featuredSubtitle}
              </p>
            </div>
            <Link
              href={publicSettings.featuredCtaHref}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-blue-600 hover:text-blue-700"
            >
              {publicSettings.featuredCtaLabel}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredCourses.map((course) => (
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
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{formatNumber(course.students)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-2xl font-bold text-gray-900">
                        ₫{formatNumber(course.price)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        </section>
      ) : null}

      {/* Features Section */}
      {publicSettings.showFeatures ? (
        <section className="py-20 text-white bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold">
              {publicSettings.featuresTitle}
            </h2>
                        <p className="text-xl text-blue-100">
              {publicSettings.featuresSubtitle}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {publicSettings.features.map((feature, index) => {
              const Icon = featureIcons[index] ?? Award;
              return (
                <div
                  key={index}
                  className="p-6 transition-all border bg-white/10 backdrop-blur-sm rounded-xl border-white/20 hover:bg-white/20"
                >
                  <Icon className="w-12 h-12 mb-4" />
                  <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        </section>
      ) : null}

      {/* CTA Section */}
      {publicSettings.showCta ? (
        <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
                        <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              {publicSettings.ctaTitle}
            </h2>
                        <p className="mb-8 text-xl text-gray-600">
              {publicSettings.ctaSubtitle}
            </p>
            <Link
              href={publicSettings.ctaButtonHref}
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-xl"
            >
              {publicSettings.ctaButtonLabel}
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
        </section>
      ) : null}
    </div>
  );
}





