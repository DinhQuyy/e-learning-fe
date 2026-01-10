"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "../../components/AuthCard";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import {
  findRememberedAccount,
  getRememberedAccounts,
  removeRememberedAccount,
  upsertRememberedAccount,
  RememberedAccount,
} from "@/lib/remembered-accounts";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [rememberedAccounts, setRememberedAccounts] = useState<RememberedAccount[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);



  useEffect(() => {
    setRememberedAccounts(getRememberedAccounts());
  }, []);

  useEffect(() => {
    const matched = findRememberedAccount(email);
    if (matched) {
      setPassword(matched.password);
      setRememberMe(true);
    }
  }, [email]);
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
        body: JSON.stringify({ email, password, remember: rememberMe }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Đăng nhập thất bại");
        return;
      }

      // ✅ Đăng nhập thành công: chuyển sang dashboard (hoặc trang chủ)
      if (rememberMe) {
        upsertRememberedAccount({ email, password });
      } else {
        removeRememberedAccount(email);
      }
      setRememberedAccounts(getRememberedAccounts());

      router.push("/my-learning"); // nếu chưa có thì tạm đổi thành "/"
    } catch (err) {
      console.error(err);
      setError("Không thể kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  const openForgotPassword = () => {
    setForgotEmail(email);
    setForgotError(null);
    setForgotSuccess(null);
    setShowForgotPassword(true);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotError(null);
    setForgotSuccess(null);
  };

  const handleForgotPassword = async (event: FormEvent) => {
    event.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!forgotEmail) {
      setForgotError("Vui long nhap email.");
      return;
    }

    try {
      setForgotLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setForgotError(data?.message || "Khong the gui yeu cau quen mat khau.");
        return;
      }

      setForgotSuccess(
        "Neu email ton tai, chung toi da gui huong dan dat lai mat khau."
      );
    } catch (err) {
      console.error(err);
      setForgotError("Khong the ket noi toi server.");
    } finally {
      setForgotLoading(false);
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
            list="remembered-email-list"
            autoComplete="email"
          />
          <datalist id="remembered-email-list">
            {rememberedAccounts.map((account) => (
              <option key={account.email} value={account.email} />
            ))}
          </datalist>
          <FormInput
            label="Mật khẩu"
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
              />
              Ghi nhớ mật khẩu
            </label>
            <button
              type="button"
              onClick={openForgotPassword}
              className="text-blue-400 hover:underline"
            >
              Quen mat khau?
            </button>
          </div>

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


{showForgotPassword && (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
    <div
      className="absolute inset-0 bg-black/60"
      onClick={closeForgotPassword}
    />
    <div
      className="relative w-full max-w-md"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={closeForgotPassword}
        className="absolute right-4 top-4 z-10 rounded-full bg-white px-3 py-1 text-sm text-gray-600 shadow hover:text-gray-900"
      >
        X
      </button>
      <AuthCard title="Quen mat khau">
        <form onSubmit={handleForgotPassword}>
          <FormInput
            label="Email"
            name="forgot_email"
            type="email"
            placeholder="Nhap email cua ban"
            value={forgotEmail}
            onChange={(event) => setForgotEmail(event.target.value)}
          />

          {forgotError && (
            <p className="mt-2 text-sm text-center text-red-500">
              {forgotError}
            </p>
          )}
          {forgotSuccess && (
            <p className="mt-2 text-sm text-center text-green-500">
              {forgotSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={forgotLoading}
            className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {forgotLoading ? "Dang gui..." : "Gui yeu cau"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-400">
            <button
              type="button"
              onClick={closeForgotPassword}
              className="text-blue-400 hover:underline"
            >
              Quay lai dang nhap
            </button>
          </p>
        </form>
      </AuthCard>
    </div>
  </div>
)}
    </div>
  );
}
