'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import {
  findRememberedAccount,
  getRememberedAccounts,
  removeRememberedAccount,
  upsertRememberedAccount,
  RememberedAccount,
} from '@/lib/remembered-accounts';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [rememberedAccounts, setRememberedAccounts] = useState<RememberedAccount[]>([]);
  const [authMode, setAuthMode] = useState<'login' | 'forgot'>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRememberedAccounts(getRememberedAccounts());
  }, []);

  useEffect(() => {
    const matched = findRememberedAccount(formData.email);
    if (matched) {
      setFormData((prev) => ({ ...prev, password: matched.password }));
      setRememberMe(true);
    }
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication - sau này sẽ thay bằng API call thật
    setTimeout(() => {
      if (formData.email === 'admin@elearning.com' && formData.password === 'admin123') {
        if (rememberMe) {
          upsertRememberedAccount({ email: formData.email, password: formData.password });
        } else {
          removeRememberedAccount(formData.email);
        }
        setRememberedAccounts(getRememberedAccounts());

        // Set cookie
        document.cookie = 'admin_token=mock-admin-token; path=/; max-age=86400';
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError('Email hoặc mật khẩu không đúng');
        setLoading(false);
      }
    }, 1000);
  };

  const openForgotPassword = () => {
    setForgotEmail(formData.email);
    setForgotError('');
    setForgotSuccess('');
    setError('');
    setAuthMode('forgot');
  };

  const closeForgotPassword = () => {
    setForgotError('');
    setForgotSuccess('');
    setError('');
    setAuthMode('login');
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail) {
      setForgotError('Vui long nhap email.');
      return;
    }

    try {
      setForgotLoading(true);
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setForgotError(data?.message || 'Khong the gui yeu cau quen mat khau.');
        return;
      }

      setForgotSuccess(
        'Neu email ton tai, chung toi da gui huong dan dat lai mat khau.'
      );
    } catch (err) {
      console.error(err);
      setForgotError('Khong the ket noi toi server.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white rounded-2xl">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-blue-200">Đăng nhập vào trang quản trị</p>
        </div>

        {/* Login Form */}
        <div className="p-8 bg-white shadow-2xl rounded-2xl">
          {authMode === 'login' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="px-4 py-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhap email cua ban"
                    list="admin-remembered-email-list"
                    autoComplete="email"
                    required
                  />
                  <datalist id="admin-remembered-email-list">
                    {rememberedAccounts.map((account) => (
                      <option key={account.email} value={account.email} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Mat khau
                </label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full py-3 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Ghi nho dang nhap
                </label>
                <button
                  type="button"
                  onClick={openForgotPassword}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Quen mat khau?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Dang dang nhap...' : 'Dang nhap'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <p className="text-sm text-gray-500">
                Nhap email de nhan link dat lai mat khau.
              </p>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(event) => setForgotEmail(event.target.value)}
                    className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {forgotError && (
                <p className="text-sm text-center text-red-500">{forgotError}</p>
              )}
              {forgotSuccess && (
                <p className="text-sm text-center text-green-600">{forgotSuccess}</p>
              )}

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {forgotLoading ? 'Dang gui...' : 'Gui yeu cau'}
              </button>

              <p className="text-center text-sm text-gray-500">
                <button
                  type="button"
                  onClick={closeForgotPassword}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Quay lai dang nhap
                </button>
              </p>
            </form>
          )}
          {/* Demo Credentials */}
          {/* <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
            <p className="mb-2 text-sm font-semibold text-blue-900">
              🔑 Demo Credentials:
            </p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>Email: <span className="font-mono">admin@elearning.com</span></p>
              <p>Password: <span className="font-mono">admin123</span></p>
            </div>
          </div> */}
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-blue-200 transition-colors hover:text-white">
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
