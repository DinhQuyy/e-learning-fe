"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../../components/AuthCard";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Đăng nhập thất bại");
        return;
      }

      // ✅ Đăng nhập thành công: chuyển sang dashboard (hoặc trang chủ)
      router.push("/dashboard"); // nếu chưa có thì tạm đổi thành "/"
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <AuthCard title="Đăng nhập">
        <form onSubmit={handleLogin}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <FormInput
            label="Mật khẩu"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
          )}

          <Button disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <p className="text-sm text-center text-gray-400 mt-4">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-400 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
