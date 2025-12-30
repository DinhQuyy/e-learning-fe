'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X, Search } from 'lucide-react';

export default function PublicNavbar() {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navLinks = [
    { href: '/courses', label: 'Khóa học' },
    { href: '/about', label: 'Về chúng tôi' },
    { href: '/contact', label: 'Liên hệ' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b shadow-sm bg-white/80 backdrop-blur-md">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              LearnHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="items-center hidden gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="items-center hidden gap-4 md:flex">
            <Link
              href="/login"
              className="text-gray-700 transition-colors hover:text-blue-600"
            >
              Đăng nhập
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
            >
              Đăng ký
            </Link>
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

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="py-4 border-t border-gray-200 md:hidden">
            <div className="space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 space-y-2 border-t">
                <Link
                  href="/login"
                  className="block px-4 py-3 text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 font-semibold text-center text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}