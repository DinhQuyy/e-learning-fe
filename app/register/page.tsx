"use client";

import Link from "next/link";
import AuthCard from "../../components/AuthCard";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";


export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <AuthCard title="Tạo tài khoản mới">
        <form>
          <FormInput label="Họ và tên" name="full_name" placeholder="Nguyễn Văn A" />
          <FormInput label="Email" name="email" type="email" placeholder="abc@gmail.com" />
          <FormInput label="Mật khẩu" name="password" type="password" placeholder="••••••••" />
          <FormInput label="Xác nhận mật khẩu" name="confirm_password" type="password" placeholder="••••••••" />

          <Button>Đăng ký</Button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
