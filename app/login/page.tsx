"use client";

import Link from "next/link";
import AuthCard from "../../components/AuthCard";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthCard title="Đăng nhập">
        <form>
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Nhập email của bạn"
          />
          <FormInput
            label="Mật khẩu"
            name="password"
            type="password"
            placeholder="••••••••"
          />

          <Button>Đăng nhập</Button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
