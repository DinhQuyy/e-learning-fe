'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Mock authentication - sau này sẽ thay bằng API call thật
    setTimeout(() => {
      if (formData.email === 'admin@elearning.com' && formData.password === 'admin123') {
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
                  placeholder="Nhập email của bạn"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Mật khẩu
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
                  placeholder="••••••••"
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
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

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