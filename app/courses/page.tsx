"use client";
import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Course = {
  id: number;
  title: string;
  description?: string | null;
  category?: Category | null;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // state cho tìm kiếm & lọc
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | number>("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/courses");
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.message || "Lỗi khi tải khóa học");
        }

        // json.data là mảng khóa học
        setCourses(json.data || []);
      } catch (err: any) {
        console.error("Lỗi lấy khóa học:", err);
        setError(err.message || "Không lấy được danh sách khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Lấy danh sách category duy nhất từ mảng courses
  const categories: Category[] = useMemo(() => {
    const map = new Map<number, Category>();
    courses.forEach((c) => {
      if (c.category?.id && !map.has(c.category.id)) {
        map.set(c.category.id, c.category);
      }
    });
    return Array.from(map.values());
  }, [courses]);

  // Lọc theo search + category
  const filteredCourses = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchSearch =
        !keyword ||
        course.title.toLowerCase().includes(keyword) ||
        (course.description || "").toLowerCase().includes(keyword);

      const matchCategory =
        selectedCategory === "all" ||
        course.category?.id === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [courses, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold mb-6">Danh sách khóa học</h1>

        {/* Thanh tìm kiếm + lọc */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          {/* Ô search */}
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học (tên, mô tả)..."
              className="w-full rounded-xl bg-gray-800 border border-gray-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Lọc theo category */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-xs md:text-sm border ${
                selectedCategory === "all"
                  ? "bg-blue-600 border-blue-500"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm border ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 border-blue-500"
                    : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Trạng thái loading / error */}
        {loading && <p>Đang tải khóa học...</p>}
        {error && (
          <p className="text-red-400 mb-4 text-sm">
            {error}
          </p>
        )}

        {/* Grid danh sách khóa học */}
        {!loading && !error && (
          <>
            {filteredCourses.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Không tìm thấy khóa học nào phù hợp.
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-3 mt-8">
  {filteredCourses.map((course) => (
    <Link
      key={course.id}
      href={`/courses/${course.id}`}   // ✅ dẫn tới trang chi tiết
      className="block rounded-xl bg-slate-800/70 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition p-6"
    >
      <h2 className="text-xl font-semibold text-white">
        {course.title}
      </h2>

      {course.category && (
        <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-300">
          {course.category.name}
        </span>
      )}

      <p className="mt-3 text-sm text-slate-300 line-clamp-2">
        {course.short_description}
      </p>
    </Link>
  ))}
</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
