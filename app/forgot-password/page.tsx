"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import FormInput from "@/components/FormInput";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Vui long nhap email.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Khong the gui yeu cau quen mat khau.");
        return;
      }

      setSuccess(
        "Neu email ton tai, chung toi da gui huong dan dat lai mat khau."
      );
    } catch (err) {
      console.error(err);
      setError("Khong the ket noi toi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <AuthCard title="Quen mat khau">
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Nhap email cua ban"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            {loading ? "Dang gui..." : "Gui yeu cau"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-400">
            Da nho mat khau?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Dang nhap
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
