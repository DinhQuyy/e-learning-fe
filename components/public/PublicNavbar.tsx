'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X, Search } from 'lucide-react';

export default function PublicNavbar() {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

  const navLinks = [
    { href: '/courses', label: 'Khóa học' },
    { href: '/about', label: 'Về chúng tôi' },
    { href: '/contact', label: 'Liên hệ' },
  ];

  return (
    <nav 
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md' 
          : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <GraduationCap className="w-8 h-8 text-blue-600 transition-all group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 transition-opacity bg-blue-600 rounded-full opacity-0 blur-xl group-hover:opacity-20"></div>
            </div>
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
                  className={`relative transition-colors group ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                  <span 
                    className={`absolute -bottom-7 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                      isActive 
                        ? 'opacity-100 scale-x-100' 
                        : 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="items-center hidden gap-4 md:flex">
            <Link
              href="/login"
              className="relative font-medium text-gray-700 transition-all hover:text-blue-600 group"
            >
              Đăng nhập
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Đăng ký
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-gray-600 transition-all rounded-lg md:hidden hover:text-gray-900 hover:bg-gray-100 active:scale-95"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6 animate-spin-in" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            showMobileMenu 
              ? 'max-h-96 opacity-100 pb-4' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-2 space-y-1 animate-slide-down">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg transition-all animate-fade-in ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 space-y-2 border-t animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <Link
                href="/login"
                className="block px-4 py-3 text-gray-700 transition-all rounded-lg hover:bg-gray-50"
                onClick={() => setShowMobileMenu(false)}
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="block px-4 py-3 font-semibold text-center text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg active:scale-95"
                onClick={() => setShowMobileMenu(false)}
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden animate-fade-in"
          style={{ top: '64px' }}
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <style jsx>{`
        @keyframes spin-in {
          from {
            transform: rotate(-180deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-spin-in {
          animation: spin-in 0.3s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </nav>
  );
}