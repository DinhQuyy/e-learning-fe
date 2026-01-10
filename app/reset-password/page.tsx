"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import FormInput from "@/components/FormInput";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Link dat lai mat khau khong hop le.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Vui long nhap day du thong tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mat khau xac nhan khong khop.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Khong the dat lai mat khau.");
        return;
      }

      setSuccess("Dat lai mat khau thanh cong. Vui long dang nhap lai.");
    } catch (err) {
      console.error(err);
      setError("Khong the ket noi toi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <AuthCard title="Dat lai mat khau">
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Mat khau moi"
            name="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <FormInput
            label="Xac nhan mat khau"
            name="confirm_password"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          {error && (
            <p className="mt-2 text-sm text-center text-red-500">{error}</p>
          )}
          {success && (
            <p className="mt-2 text-sm text-center text-green-500">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Dang xu ly..." : "Cap nhat mat khau"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-400">
            Quay lai{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Dang nhap
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
