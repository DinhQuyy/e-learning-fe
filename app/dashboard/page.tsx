"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "student") router.push("/dashboard/student");
    if (role === "instructor") router.push("/dashboard/instructor");
    if (role === "admin") router.push("/dashboard/admin");
  }, []);

  return <div>Đang chuyển hướng...</div>;
}