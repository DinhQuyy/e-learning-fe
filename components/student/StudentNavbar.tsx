'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  User,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Settings,
  Award,
  Heart
} from 'lucide-react';

export default function StudentNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Bài học mới',
      message: 'Khóa học Web Development có bài học mới',
      time: '5 phút trước',
      unread: true,
    },
    {
      id: 2,
      title: 'Chứng chỉ sẵn sàng',
      message: 'Chứng chỉ Python Basics đã được cấp',
      time: '1 giờ trước',
      unread: true,
    },
    {
      id: 3,
      title: 'Nhắc nhở',
      message: 'Bạn chưa học hôm nay. Hãy tiếp tục!',
      time: '3 giờ trước',
      unread: false,
    },
  ];

  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'access_token=; path=/; max-age=0';
    document.cookie = 'student_token=; path=/; max-age=0';
    
    // Redirect to login
    router.push('/login');
  };

  const navLinks = [
    { href: '/my-learning', label: 'Học tập của tôi', icon: BookOpen },
    { href: '/courses', label: 'Khám phá', icon: Search },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="hidden text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text sm:block">
              LearnHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-6 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search (Desktop) */}
            <div className="hidden lg:block">
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="text"
                  placeholder="Tìm khóa học..."
                  className="w-64 py-2 pr-4 text-sm border border-gray-300 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 text-gray-600 transition-colors rounded-lg hover:text-gray-900 hover:bg-gray-100"
              >
                <Bell className="w-6 h-6" />
                {notifications.some((n) => n.unread) && (
                  <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 z-20 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl w-80">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Thông báo</h3>
                    </div>
                    <div className="overflow-y-auto max-h-96">
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          className={`w-full px-4 py-3 hover:bg-gray-50 text-left transition-colors ${
                            notif.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {notif.unread && (
                              <div className="w-2 h-2 mt-2 bg-blue-600 rounded-full"></div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {notif.title}
                              </p>
                              <p className="mt-1 text-sm text-gray-600">
                                {notif.message}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-3 text-center border-t border-gray-200">
                      <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        Xem tất cả
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-2 transition-colors rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                  S
                </div>
                <span className="hidden text-sm font-medium text-gray-700 md:block">
                  Student
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  ></div>
                  <div className="absolute right-0 z-20 w-56 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">Student User</p>
                      <p className="text-xs text-gray-500">student@example.com</p>
                    </div>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <User className="w-4 h-4" />
                      Hồ sơ của tôi
                    </Link>

                    <Link
                      href="/my-learning"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <BookOpen className="w-4 h-4" />
                      Học tập của tôi
                    </Link>

                    <Link
                      href="/certificates"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <Award className="w-4 h-4" />
                      Chứng chỉ
                    </Link>

                    <Link
                      href="/wishlist"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <Heart className="w-4 h-4" />
                      Yêu thích
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4" />
                      Cài đặt
                    </Link>

                    <div className="my-2 border-t border-gray-200"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 md:hidden hover:text-gray-900"
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="py-4 border-t border-gray-200 md:hidden">
            <div className="space-y-2">
              {/* Search Mobile */}
              <div className="px-2 mb-4">
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm khóa học..."
                    className="w-full py-2 pr-4 text-sm border border-gray-300 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}