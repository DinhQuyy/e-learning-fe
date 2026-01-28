'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Plus
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/instructor' },
  { name: 'Khóa học', href: '/instructor/courses' },
  { name: 'Học viên', href: '/instructor/students' },
  { name: 'Phân tích', href: '/instructor/analytics' },
];

export default function InstructorNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/instructor" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">EduPlatform</div>
              <div className="text-xs text-gray-500">Instructor</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-1 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Create Course Button */}
            <Link
              href="/instructor/courses/new"
              className="items-center hidden gap-2 px-4 py-2 text-sm font-semibold text-white transition-shadow rounded-lg md:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Tạo khóa học
            </Link>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <img
                  src="https://i.pravatar.cc/150?img=68"
                  alt="Profile"
                  className="w-8 h-8 border-2 border-gray-200 rounded-full"
                />
                <ChevronDown className="hidden w-4 h-4 text-gray-600 md:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 w-56 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <div className="p-4 border-b border-gray-200">
                      <div className="font-semibold text-gray-900">Nguyễn Văn Giảng Viên</div>
                      <div className="text-sm text-gray-500">instructor@email.com</div>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/instructor"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/instructor/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        Hồ sơ
                      </Link>
                      <Link
                        href="/instructor/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" />
                        Cài đặt
                      </Link>
                    </div>
                    <div className="py-2 border-t border-gray-200">
                      <button 
                        onClick={() => {
                          if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                            // Clear session/token here
                            window.location.href = '/';
                          }
                        }}
                        className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 rounded-lg md:hidden hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="py-4 border-t border-gray-200 md:hidden">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href="/instructor/courses/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Plus className="w-4 h-4" />
                Tạo khóa học mới
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}