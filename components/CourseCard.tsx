"use client";

import React from "react";

export type Course = {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  price?: number | null;
  level?: string | null;
  thumbnail?: string | null;
  // nếu bạn có thêm field khác thì thêm vào đây
};

type Props = {
  course: Course;
};

export default function CourseCard({ course }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition">
      {/* Ảnh khoá học */}
      <div className="h-40 bg-gray-800 flex items-center justify-center">
        {course.thumbnail ? (
          // nếu sau này dùng next/image thì đổi lại
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-sm">No thumbnail</span>
        )}
      </div>

      {/* Nội dung */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-white line-clamp-2">
          {course.title}
        </h3>

        {course.level && (
          <span className="inline-flex w-fit items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-300">
            {course.level}
          </span>
        )}

        {course.description && (
          <p className="text-sm text-gray-400 line-clamp-2">
            {course.description}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between">
          <span className="text-indigo-400 font-semibold">
            {course.price ? course.price.toLocaleString("vi-VN") + " đ" : "Miễn phí"}
          </span>

          <button className="text-xs px-3 py-1 rounded-full border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
