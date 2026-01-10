'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Menu,
  X,
  Bell,
  Search,
  BookOpen,
  User,
  Award,
  Heart,
  Eye,
  EyeOff,
  Settings,
  LogOut,
} from 'lucide-react';
import AuthCard from '../AuthCard';
import FormInput from '../FormInput';
import {
  findRememberedAccount,
  getRememberedAccounts,
  removeRememberedAccount,
  upsertRememberedAccount,
  RememberedAccount,
} from '@/lib/remembered-accounts';


type AuthMode = 'login' | 'register' | 'forgot';

const authCopy = {
  loginTitle: '\u0110\u0103ng nh\u1EADp',
  registerTitle: 'T\u1EA1o t\u00E0i kho\u1EA3n m\u1EDBi',
  forgotTitle: 'Quen mat khau',
  forgotDescription: 'Nhap email de nhan link dat lai mat khau.',
  forgotSubmit: 'Gui yeu cau',
  forgotBack: 'Quay lai dang nhap',
  forgotMissing: 'Vui long nhap email.',
  forgotSuccess: 'Neu email ton tai, chung toi da gui huong dan dat lai mat khau.',
  forgotFailed: 'Khong the gui yeu cau quen mat khau.',
  forgotLoading: 'Dang gui...',
  login: '\u0110\u0103ng nh\u1EADp',
  register: '\u0110\u0103ng k\u00FD',
  fullName: 'H\u1ECD v\u00E0 t\u00EAn',
  password: 'M\u1EADt kh\u1EA9u',
  confirmPassword: 'X\u00E1c nh\u1EADn m\u1EADt kh\u1EA9u',
  noAccount: 'Ch\u01B0a c\u00F3 t\u00E0i kho\u1EA3n?',
  haveAccount: '\u0110\u00E3 c\u00F3 t\u00E0i kho\u1EA3n?',
  switchRegister: '\u0110\u0103ng k\u00FD ngay',
  switchLogin: '\u0110\u0103ng nh\u1EADp',
  loginMissing: 'Vui l\u00F2ng nh\u1EADp email v\u00E0 m\u1EADt kh\u1EA9u',
  loginFailed: '\u0110\u0103ng nh\u1EADp th\u1EA5t b\u1EA1i',
  registerMissing: 'Vui l\u00F2ng \u0111i\u1EC1n \u0111\u1EA7y \u0111\u1EE7 th\u00F4ng tin',
  passwordMismatch: 'M\u1EADt kh\u1EA9u x\u00E1c nh\u1EADn kh\u00F4ng kh\u1EDBp',
  registerFailed: '\u0110\u0103ng k\u00FD th\u1EA5t b\u1EA1i',
  registerSuccess:
    '\u0110\u0103ng k\u00FD th\u00E0nh c\u00F4ng! Chuy\u1EC3n sang \u0111\u0103ng nh\u1EADp...',
  loginLoading: '\u0110ang \u0111\u0103ng nh\u1EADp...',
  registerLoading: '\u0110ang \u0111\u0103ng k\u00FD...',
  networkError: 'Kh\u00F4ng th\u1EC3 k\u1EBFt n\u1ED1i t\u1EDBi server',
  myLearning: 'H\u1ECDc t\u1EADp c\u1EE7a t\u00F4i',
  profile: 'H\u1ED3 s\u01A1',
  logout: '\u0110\u0103ng xu\u1EA5t',
  certificates: 'Ch\u1EE9ng ch\u1EC9',
  wishlist: 'Y\u00EAu th\u00EDch',
  settings: 'C\u00E0i \u0111\u1EB7t',
} as const;

export default function PublicNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';

const [showMobileMenu, setShowMobileMenu] = useState(false);
const [showAuthModal, setShowAuthModal] = useState(false);
const [authMode, setAuthMode] = useState<AuthMode>('login');

const [loginEmail, setLoginEmail] = useState('');
const [loginPassword, setLoginPassword] = useState('');
const [showLoginPassword, setShowLoginPassword] = useState(false);
const [loginRememberMe, setLoginRememberMe] = useState(false);
const [rememberedAccounts, setRememberedAccounts] = useState<RememberedAccount[]>([]);
const [loginError, setLoginError] = useState<string | null>(null);
const [loginLoading, setLoginLoading] = useState(false);

const [forgotEmail, setForgotEmail] = useState('');
const [forgotError, setForgotError] = useState<string | null>(null);
const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
const [forgotLoading, setForgotLoading] = useState(false);

const [registerFullName, setRegisterFullName] = useState('');
const [registerEmail, setRegisterEmail] = useState('');
const [registerPassword, setRegisterPassword] = useState('');
const [showRegisterPassword, setShowRegisterPassword] = useState(false);
const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
const [registerError, setRegisterError] = useState<string | null>(null);
const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
const [registerLoading, setRegisterLoading] = useState(false);
const [showUserMenu, setShowUserMenu] = useState(false);
const [showNotifications, setShowNotifications] = useState(false);
const [courseSearch, setCourseSearch] = useState(searchQuery);
const [showSuggestions, setShowSuggestions] = useState(false);
const [suggestions, setSuggestions] = useState<Array<{ id: string | number; title: string; instructor?: string }>>([]);
const [isSuggesting, setIsSuggesting] = useState(false);
const [user, setUser] = useState<{
  first_name?: string;
  last_name?: string;
  email?: string;
} | null>(null);
const [isLoadingUser, setIsLoadingUser] = useState(true);

  const navLinks = [
    { href: '/courses', label: 'Khóa học' },
    { href: '/about', label: 'Về chúng tôi' },
    { href: '/contact', label: 'Liên hệ' },
  ];

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

  const profileLinks = [
    { href: '/profile', label: authCopy.profile, icon: User },
    { href: '/my-learning', label: authCopy.myLearning, icon: BookOpen },
    { href: '/certificates', label: authCopy.certificates, icon: Award },
    { href: '/wishlist', label: authCopy.wishlist, icon: Heart },
    { href: '/settings', label: authCopy.settings, icon: Settings },
  ];

  useEffect(() => {
    if (!showAuthModal) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showAuthModal]);

  useEffect(() => {
    setLoginError(null);
    setRegisterError(null);
    setRegisterSuccess(null);
    setForgotError(null);
    setForgotSuccess(null);
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
    setShowRegisterConfirmPassword(false);
  }, [authMode]);


  useEffect(() => {
    setRememberedAccounts(getRememberedAccounts());
  }, []);

  useEffect(() => {
    const matched = findRememberedAccount(loginEmail);
    if (matched) {
      setLoginPassword(matched.password);
      setLoginRememberMe(true);
    }
  }, [loginEmail]);
  useEffect(() => {
    if (pathname === '/courses') {
      setCourseSearch(searchQuery);
    }
  }, [pathname, searchQuery]);

  useEffect(() => {
    const term = courseSearch.trim();
    if (!showSuggestions || !term) {
      setSuggestions([]);
      setIsSuggesting(false);
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    const handler = setTimeout(async () => {
      setIsSuggesting(true);
      try {
        const res = await fetch(
          `/api/courses?search=${encodeURIComponent(term)}&limit=6`,
          { cache: 'no-store', signal: controller.signal }
        );
        const data = await res.json().catch(() => null);
        const items = Array.isArray(data?.courses)
          ? data.courses
          : Array.isArray(data?.data)
            ? data.data
            : [];
        if (!isActive) return;
        const mapped = items
          .map((course: any) => ({
            id: course.id,
            title: course.title ?? course.name ?? '',
            instructor:
              course.teacher_name ?? course.instructor_name ?? course.instructor ?? '',
          }))
          .filter((course: any) => course.title);
        setSuggestions(mapped.slice(0, 6));
      } catch (error) {
        if (!isActive) return;
        setSuggestions([]);
      } finally {
        if (isActive) setIsSuggesting(false);
      }
    }, 250);

    return () => {
      isActive = false;
      clearTimeout(handler);
      controller.abort();
    };
  }, [courseSearch, showSuggestions]);


  useEffect(() => {
    let isActive = true;

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!res.ok) {
          if (isActive) setUser(null);
          return;
        }
        const json = await res.json();
        if (isActive) setUser(json?.user ?? null);
      } catch (error) {
        console.error('Fetch user error:', error);
      } finally {
        if (isActive) setIsLoadingUser(false);
      }
    };

    fetchUser();

    return () => {
      isActive = false;
    };
  }, []);

  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setShowMobileMenu(false);
    setShowUserMenu(false);
    setShowNotifications(false);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setLoginError(null);
    setRegisterError(null);
    setRegisterSuccess(null);
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError(null);

    if (!loginEmail || !loginPassword) {
      setLoginError(authCopy.loginMissing);
      return;
    }

    try {
      setLoginLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, remember: loginRememberMe }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setLoginError(data?.message || authCopy.loginFailed);
        return;
      }

      if (loginRememberMe) {
        upsertRememberedAccount({
          email: loginEmail,
          password: loginPassword,
        });
      } else {
        removeRememberedAccount(loginEmail);
      }
      setRememberedAccounts(getRememberedAccounts());

      closeAuthModal();
      router.push('/my-learning');
    } catch (error) {
      console.error(error);
      setLoginError(authCopy.networkError);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setRegisterError(null);
    setRegisterSuccess(null);

    if (
      !registerFullName ||
      !registerEmail ||
      !registerPassword ||
      !registerConfirmPassword
    ) {
      setRegisterError(authCopy.registerMissing);
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError(authCopy.passwordMismatch);
      return;
    }

    try {
      setRegisterLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: registerFullName,
          email: registerEmail,
          password: registerPassword,
          confirm_password: registerConfirmPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setRegisterError(data?.message || authCopy.registerFailed);
        return;
      }

      setRegisterSuccess(authCopy.registerSuccess);
      setTimeout(() => {
        setAuthMode('login');
      }, 800);
    } catch (error) {
      console.error(error);
      setRegisterError(authCopy.networkError);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleCourseSearch = (value?: string) => {
    const term = (value ?? courseSearch).trim();
    const nextUrl = term ? `/courses?search=${encodeURIComponent(term)}` : '/courses';
    router.push(nextUrl);
    setShowSuggestions(false);
    setShowMobileMenu(false);
    setShowNotifications(false);
    setShowUserMenu(false);
  };

  const handleSuggestionSelect = (course: { id: string | number; title: string }) => {
    setCourseSearch(course.title);
    setShowSuggestions(false);
    setShowMobileMenu(false);
    setShowNotifications(false);
    setShowUserMenu(false);
    router.push(`/courses/${course.id}`);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }

    setUser(null);
    setShowUserMenu(false);
    setShowNotifications(false);
    setShowMobileMenu(false);
    setShowSuggestions(false);
    router.refresh();
  };

  const handleForgotPassword = async (event: FormEvent) => {
    event.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    if (!forgotEmail) {
      setForgotError(authCopy.forgotMissing);
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
        setForgotError(data?.message || authCopy.forgotFailed);
        return;
      }

      setForgotSuccess(authCopy.forgotSuccess);
    } catch (error) {
      console.error(error);
      setForgotError(authCopy.networkError);
    } finally {
      setForgotLoading(false);
    }
  };


    const displayName = [user?.first_name, user?.last_name]
      .filter(Boolean)
      .join(' ')
      .trim();
    const userName = displayName || user?.email || 'Student';
    const userEmail = user?.email || (isLoadingUser ? '...' : 'student@example.com');
    const userInitial = (userName || 'S').charAt(0).toUpperCase();
    const showAuthActions = !user && !isLoadingUser;
    const showUserActions = Boolean(user);


  return (
    <>
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

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {showUserActions ? (
              <>
                {/* Search (Desktop) */}
                <div className="hidden lg:block">
                  <div className="relative">
                    <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm khóa học..."
                      value={courseSearch}
                      onChange={(event) => setCourseSearch(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleCourseSearch(event.currentTarget.value);
                        }
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 150);
                      }}
                      className="w-64 py-2 pr-4 text-sm border border-gray-300 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {showSuggestions && courseSearch.trim() && (
                      <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                        {isSuggesting ? (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            Dang tim...
                          </div>
                        ) : suggestions.length ? (
                          suggestions.map((course) => (
                            <button
                              key={course.id}
                              type="button"
                              onMouseDown={(event) => {
                                event.preventDefault();
                                handleSuggestionSelect(course);
                              }}
                              className="w-full px-4 py-2 text-left transition-colors hover:bg-gray-50"
                            >
                              <p className="text-sm font-semibold text-gray-900">
                                {course.title}
                              </p>
                              {course.instructor ? (
                                <p className="text-xs text-gray-500">
                                  {course.instructor}
                                </p>
                              ) : null}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            Khong tim thay khoa hoc
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative p-2 text-gray-600 transition-colors rounded-lg hover:text-gray-900 hover:bg-gray-100"
                  >
                    <Bell className="w-6 h-6" />
                    {notifications.some((n) => n.unread) && (
                      <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
                    )}
                  </button>

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
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-2 transition-colors rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                      {userInitial}
                    </div>
                    <span className="hidden text-sm font-medium text-gray-700 md:block">
                      {isLoadingUser ? '...' : userName}
                    </span>
                  </button>

                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      <div className="absolute right-0 z-20 w-56 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">
                            {isLoadingUser ? '...' : userName}
                          </p>
                          <p className="text-xs text-gray-500">{userEmail}</p>
                        </div>

                        {profileLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                            >
                              <Icon className="w-4 h-4" />
                              {link.label}
                            </Link>
                          );
                        })}

                        <div className="my-2 border-t border-gray-200"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          {authCopy.logout}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : showAuthActions ? (
              <div className="items-center hidden gap-4 md:flex">
                <Link
                  href="/login"
                  className="text-gray-700 transition-colors hover:text-blue-600"
                  onClick={(event) => {
                    event.preventDefault();
                    openAuthModal('login');
                  }}
                >
                  {authCopy.login}
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                  onClick={(event) => {
                    event.preventDefault();
                    openAuthModal('register');
                  }}
                >
                  {authCopy.register}
                </Link>
              </div>
            ) : (
              <span className="text-sm text-gray-400">...</span>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
                setShowUserMenu(false);
                setShowNotifications(false);
              }}
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
                    placeholder="TA?m khA3a h???c..."
                    value={courseSearch}
                    onChange={(event) => setCourseSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleCourseSearch(event.currentTarget.value);
                      }
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                      setTimeout(() => setShowSuggestions(false), 150);
                    }}
                    className="w-full py-2 pr-4 text-sm border border-gray-300 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {showSuggestions && courseSearch.trim() && (
                    <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                      {isSuggesting ? (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Dang tim...
                        </div>
                      ) : suggestions.length ? (
                        suggestions.map((course) => (
                          <button
                            key={course.id}
                            type="button"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              handleSuggestionSelect(course);
                            }}
                            className="w-full px-4 py-2 text-left transition-colors hover:bg-gray-50"
                          >
                            <p className="text-sm font-semibold text-gray-900">
                              {course.title}
                            </p>
                            {course.instructor ? (
                              <p className="text-xs text-gray-500">
                                {course.instructor}
                              </p>
                            ) : null}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          Khong tim thay khoa hoc
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

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
                {showUserActions ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-sm font-semibold text-white">
                        {userInitial}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {isLoadingUser ? '...' : userName}
                        </p>
                        {userEmail ? (
                          <p className="text-xs text-gray-500">{userEmail}</p>
                        ) : null}
                      </div>
                    </div>
                    {profileLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-3 text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-4 py-3 text-left font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      {authCopy.logout}
                    </button>
                  </>
                ) : showAuthActions ? (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                      onClick={(event) => {
                        event.preventDefault();
                        openAuthModal('login');
                      }}
                    >
                      {authCopy.login}
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-3 font-semibold text-center text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={(event) => {
                        event.preventDefault();
                        openAuthModal('register');
                      }}
                    >
                      {authCopy.register}
                    </Link>
                  </>
                ) : (
                  <span className="block px-4 py-3 text-sm text-gray-400">
                    ...
                  </span>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </nav>


      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeAuthModal}
          />
          <div
            className="relative w-full max-w-lg"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeAuthModal}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-gray-600 shadow-sm transition hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </button>
            <AuthCard
              title={
                authMode === 'login'
                  ? authCopy.loginTitle
                  : authMode === 'register'
                  ? authCopy.registerTitle
                  : authCopy.forgotTitle
              }
            >
              <div className="flex rounded-lg bg-gray-100 p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 rounded-md px-3 py-2 font-semibold transition ${
                    authMode === 'login'
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {authCopy.login}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 rounded-md px-3 py-2 font-semibold transition ${
                    authMode === 'register'
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {authCopy.register}
                </button>
              </div>

                            {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="mt-6">
                  <FormInput
                    label="Email"
                    name="login_email"
                    type="email"
                    placeholder="email@example.com"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    list="remembered-login-email-list"
                    autoComplete="email"
                  />
                  <datalist id="remembered-login-email-list">
                    {rememberedAccounts.map((account) => (
                      <option key={account.email} value={account.email} />
                    ))}
                  </datalist>
                  <div className="mb-4">
                    <label
                      htmlFor="login_password"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      {authCopy.password}
                    </label>
                    <div className="relative">
                      <input
                        id="login_password"
                        name="login_password"
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="********"
                        value={loginPassword}
                        onChange={(event) => setLoginPassword(event.target.value)}
                        className="w-full rounded-md border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={loginRememberMe}
                        onChange={(event) => setLoginRememberMe(event.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Ghi nho mat khau
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('forgot')}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Quen mat khau?
                    </button>
                  </div>

                  {loginError && (
                    <p className="mt-2 text-center text-sm text-red-500">{loginError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-2 text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loginLoading ? authCopy.loginLoading : authCopy.login}
                  </button>

                  <p className="mt-4 text-center text-sm text-gray-500">
                    {authCopy.noAccount}{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('register')}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {authCopy.switchRegister}
                    </button>
                  </p>
                </form>
              ) : authMode === 'register' ? (
                <form onSubmit={handleRegister} className="mt-6">
                  <FormInput
                    label={authCopy.fullName}
                    name="register_full_name"
                    placeholder="Nguyen Van A"
                    value={registerFullName}
                    onChange={(event) => setRegisterFullName(event.target.value)}
                  />
                  <FormInput
                    label="Email"
                    name="register_email"
                    type="email"
                    placeholder="email@example.com"
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                  />
                  <div className="mb-4">
                    <label
                      htmlFor="register_password"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      {authCopy.password}
                    </label>
                    <div className="relative">
                      <input
                        id="register_password"
                        name="register_password"
                        type={showRegisterPassword ? 'text' : 'password'}
                        placeholder="********"
                        value={registerPassword}
                        onChange={(event) => setRegisterPassword(event.target.value)}
                        className="w-full rounded-md border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword((prev) => !prev)}
                        aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="register_confirm_password"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      {authCopy.confirmPassword}
                    </label>
                    <div className="relative">
                      <input
                        id="register_confirm_password"
                        name="register_confirm_password"
                        type={showRegisterConfirmPassword ? 'text' : 'password'}
                        placeholder="********"
                        value={registerConfirmPassword}
                        onChange={(event) => setRegisterConfirmPassword(event.target.value)}
                        className="w-full rounded-md border px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterConfirmPassword((prev) => !prev)}
                        aria-label={
                          showRegisterConfirmPassword ? 'Hide password' : 'Show password'
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 transition hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {showRegisterConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {registerError && (
                    <p className="mt-2 text-center text-sm text-red-500">{registerError}</p>
                  )}
                  {registerSuccess && (
                    <p className="mt-2 text-center text-sm text-green-600">
                      {registerSuccess}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-2 text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {registerLoading ? authCopy.registerLoading : authCopy.register}
                  </button>

                  <p className="mt-4 text-center text-sm text-gray-500">
                    {authCopy.haveAccount}{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {authCopy.switchLogin}
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="mt-6">
                  <p className="mb-4 text-sm text-gray-500">{authCopy.forgotDescription}</p>
                  <FormInput
                    label="Email"
                    name="forgot_email"
                    type="email"
                    placeholder="email@example.com"
                    value={forgotEmail}
                    onChange={(event) => setForgotEmail(event.target.value)}
                  />

                  {forgotError && (
                    <p className="mt-2 text-center text-sm text-red-500">{forgotError}</p>
                  )}
                  {forgotSuccess && (
                    <p className="mt-2 text-center text-sm text-green-600">
                      {forgotSuccess}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-2 text-white transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {forgotLoading ? authCopy.forgotLoading : authCopy.forgotSubmit}
                  </button>

                  <p className="mt-4 text-center text-sm text-gray-500">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {authCopy.forgotBack}
                    </button>
                  </p>
                </form>
              )}
            </AuthCard>
          </div>
        </div>
      )}
    </>
  );
}
