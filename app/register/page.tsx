"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthCard from "../../components/AuthCard";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          data?.message ||
            `Đăng ký thất bại (mã lỗi ${res.status}). Kiểm tra console.`
        );
        console.error("Register error:", data);
        return;
      }

      setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
      // Có thể chờ 1 chút rồi redirect
      setTimeout(() => router.push("/login"), 800);
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối server. Kiểm tra lại kết nối.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <AuthCard title="Tạo tài khoản mới">
        <form onSubmit={handleRegister}>
          <FormInput
            label="Họ và tên"
            name="full_name"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChange={(e: any) => setFullName(e.target.value)}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="abc@gmail.com"
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
          <FormInput
            label="Xác nhận mật khẩu"
            name="confirm_password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-500 mt-2 text-center">
              {success}
            </p>
          )}

          <Button disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>

          <p className="text-sm text-center text-gray-400 mt-4">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
