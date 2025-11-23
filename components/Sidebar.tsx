"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r || "");
  }, []);

  return (
    <div className="w-64 h-screen p-4 bg-white border-r">
      <h2 className="mb-4 text-xl font-bold">Dashboard</h2>

      {role === "student" && (
        <>
          <Link href="/dashboard/student" className="block py-2">Khoá học của tôi</Link>
          <Link href="/dashboard/student/progress" className="block py-2">Tiến độ học</Link>
        </>
      )}

      {role === "instructor" && (
        <>
          <Link href="/dashboard/instructor" className="block py-2">Quản lý khoá học</Link>
          <Link href="/dashboard/instructor/create" className="block py-2">Tạo khoá học</Link>
        </>
      )}

      {role === "admin" && (
        <>
          <Link href="/dashboard/admin" className="block py-2">Quản lý người dùng</Link>
          <Link href="/dashboard/admin/reports" className="block py-2">Báo cáo</Link>
        </>
      )}
    </div>
  );
}