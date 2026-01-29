'use client';

import { useEffect, useState } from 'react';
import {
  Save,
  Bell,
  Shield,
  Globe,
  Mail,
  Lock,
  Home,
  CreditCard,
  Percent,
} from 'lucide-react';
import {
  defaultPublicSettings,
  fetchPublicSettings,
  loadPublicSettings,
  savePublicSettings,
  PublicSettings,
} from '@/lib/public-settings.client';

type AdminSettings = {
  adminEmail: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReport: boolean;
  paymentGateway: string;
  paymentPublicKey: string;
  paymentSecretKey: string;
  paymentWebhookSecret: string;
  platformFeePercent: number;
  instructorSharePercent: number;
};

const ADMIN_SETTINGS_KEY = 'elearning.admin-settings';

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  adminEmail: 'admin@elearning.com',
  language: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',
  emailNotifications: true,
  pushNotifications: false,
  weeklyReport: true,
  paymentGateway: 'payos',
  paymentPublicKey: '',
  paymentSecretKey: '',
  paymentWebhookSecret: '',
  platformFeePercent: 20,
  instructorSharePercent: 80,
};

const loadAdminSettings = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_ADMIN_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (!raw) {
      return DEFAULT_ADMIN_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_ADMIN_SETTINGS, ...(parsed ?? {}) };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
};

const saveAdminSettings = (settings: AdminSettings) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    return;
  }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [publicSettings, setPublicSettings] =
    useState<PublicSettings>(defaultPublicSettings);
  const [publicSettingsLoaded, setPublicSettingsLoaded] = useState(false);
  const [settings, setSettings] =
    useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);

  useEffect(() => {
    setPublicSettings(loadPublicSettings());
    setPublicSettingsLoaded(true);

    let isActive = true;
    fetchPublicSettings()
      .then((next) => {
        if (isActive) {
          setPublicSettings(next);
        }
      })
      .catch(() => null);

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    setSettings(loadAdminSettings());
  }, []);

  useEffect(() => {
    if (!publicSettingsLoaded) {
      return;
    }

    const handler = setTimeout(() => {
      void savePublicSettings(publicSettings);
    }, 400);

    return () => clearTimeout(handler);
  }, [publicSettings, publicSettingsLoaded]);

  const tabs = [
    { id: 'general', label: 'Chung', icon: Globe },
    { id: 'landing', label: 'Trang đích', icon: Home },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'payments', label: 'Thanh toán', icon: CreditCard },
    { id: 'revenue', label: 'Chia sẻ doanh thu', icon: Percent },
  ];

  const handleSave = async () => {
    saveAdminSettings(settings);
    await savePublicSettings(publicSettings);
    alert('Đã lưu cài đặt thành công!');
  };

  const revenueTotal =
    settings.platformFeePercent + settings.instructorSharePercent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
        <p className="mt-2 text-gray-600">
          Quản lý cài đặt hệ thống và tài khoản
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Cài đặt chung
                  </h2>
                  <p className="text-sm text-gray-600">
                    Cấu hình chung cho hệ thống
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Tên trang
                    </label>
                    <input
                      type="text"
                      value={publicSettings.siteName}
                      onChange={(e) =>
                        setPublicSettings({
                          ...publicSettings,
                          siteName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <textarea
                      value={publicSettings.siteDescription}
                      onChange={(e) =>
                        setPublicSettings({
                          ...publicSettings,
                          siteDescription: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        Thanh thông báo
                      </span>
                      <input
                        type="checkbox"
                        checked={publicSettings.announcementEnabled}
                        onChange={(e) =>
                          setPublicSettings({
                            ...publicSettings,
                            announcementEnabled: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <textarea
                      value={publicSettings.announcementText}
                      onChange={(e) =>
                        setPublicSettings({
                          ...publicSettings,
                          announcementText: e.target.value,
                        })
                      }
                      rows={2}
                      disabled={!publicSettings.announcementEnabled}
                      className={`mt-3 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        publicSettings.announcementEnabled
                          ? ''
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Email quản trị
                    </label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, adminEmail: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Ngôn ngữ
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          setSettings({ ...settings, language: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">Tiếng Anh</option>
                      </select>
                    </div>

                    <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Múi giờ
                    </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) =>
                          setSettings({ ...settings, timezone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Asia/Ho_Chi_Minh">
                          Asia/Ho Chi Minh (GMT+7)
                        </option>
                        <option value="America/New_York">
                          America/New York (GMT-5)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={publicSettings.maintenance}
                        onChange={(e) =>
                          setPublicSettings({
                            ...publicSettings,
                            maintenance: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Chế độ bảo trì
                        </p>
                        <p className="text-xs text-gray-500">
                          Tạm khóa website để bảo trì
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Landing Page Settings */}
            {activeTab === 'landing' && (
              <div className="space-y-8">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Trang đích
                  </h2>
                  <p className="text-sm text-gray-600">
                    Quản lý nội dung hiển thị trên trang chủ học viên.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Khu vực nổi bật
                      </h3>
                      <p className="text-sm text-gray-600">
                        Tiêu đề chính, banner và tìm kiếm.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Nội dung badge
                        </label>
                        <input
                          type="text"
                          value={publicSettings.heroBadge}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              heroBadge: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Tiêu đề khu vực nổi bật
                        </label>
                        <input
                          type="text"
                          value={publicSettings.heroTitle}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              heroTitle: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Văn bản nổi bật
                        </label>
                        <input
                          type="text"
                          value={publicSettings.heroHighlight}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              heroHighlight: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          URL ảnh khu vực nổi bật
                        </label>
                        <input
                          type="text"
                          value={publicSettings.heroImageUrl}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              heroImageUrl: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Phụ đề khu vực nổi bật
                    </label>
                      <textarea
                        value={publicSettings.heroSubtitle}
                        onChange={(e) =>
                          setPublicSettings({
                            ...publicSettings,
                            heroSubtitle: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Gợi ý tìm kiếm
                        </label>
                        <input
                          type="text"
                          value={publicSettings.searchPlaceholder}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              searchPlaceholder: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Nút tìm kiếm
                        </label>
                        <input
                          type="text"
                          value={publicSettings.searchButtonLabel}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              searchButtonLabel: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Nhãn kêu gọi hành động chính
                        </label>
                        <input
                          type="text"
                          value={publicSettings.heroPrimaryCtaLabel}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              heroPrimaryCtaLabel: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Liên kết kêu gọi hành động chính
                        </label>
                        <input
                          type="text"
                          value={publicSettings.heroPrimaryCtaHref}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              heroPrimaryCtaHref: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Nhãn kêu gọi hành động phụ
                        </label>
                        <input
                          type="text"
                          value={publicSettings.heroSecondaryCtaLabel}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              heroSecondaryCtaLabel: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Liên kết kêu gọi hành động phụ
                        </label>
                        <input
                          type="text"
                          value={publicSettings.heroSecondaryCtaHref}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              heroSecondaryCtaHref: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Hiển thị khu vực
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={publicSettings.showStats}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              showStats: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Hiện thống kê
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={publicSettings.showCategories}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              showCategories: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Hiện danh mục
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={publicSettings.showFeaturedCourses}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              showFeaturedCourses: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Hiện khóa học nổi bật
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={publicSettings.showFeatures}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              showFeatures: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Hiện tính năng
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={publicSettings.showCta}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              showCta: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Hiện kêu gọi hành động cuối trang
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Khu vực danh mục
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          value={publicSettings.categoriesTitle}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              categoriesTitle: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Phụ đề
                        </label>
                        <input
                          type="text"
                          value={publicSettings.categoriesSubtitle}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              categoriesSubtitle: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Khu vực khóa học nổi bật
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          value={publicSettings.featuredTitle}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              featuredTitle: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Phụ đề
                        </label>
                        <input
                          type="text"
                          value={publicSettings.featuredSubtitle}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              featuredSubtitle: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Nhãn liên kết
                        </label>
                        <input
                          type="text"
                          value={publicSettings.featuredCtaLabel}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              featuredCtaLabel: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          URL liên kết
                        </label>
                        <input
                          type="text"
                          value={publicSettings.featuredCtaHref}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              featuredCtaHref: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Khu vực tính năng
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          value={publicSettings.featuresTitle}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              featuresTitle: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Phụ đề
                        </label>
                        <input
                          type="text"
                          value={publicSettings.featuresSubtitle}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              featuresSubtitle: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Thống kê
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {publicSettings.stats.map((stat, index) => (
                        <div key={`stat-${index}`} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Chỉ số {index + 1}
                          </label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const nextStats = [...publicSettings.stats];
                              nextStats[index] = {
                                ...nextStats[index],
                                label: e.target.value,
                              };
                              setPublicSettings({
                                ...publicSettings,
                                stats: nextStats,
                              });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const nextStats = [...publicSettings.stats];
                              nextStats[index] = {
                                ...nextStats[index],
                                value: e.target.value,
                              };
                              setPublicSettings({
                                ...publicSettings,
                                stats: nextStats,
                              });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Danh sách tính năng
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {publicSettings.features.map((feature, index) => (
                        <div key={`feature-${index}`} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Tính năng {index + 1}
                          </label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => {
                              const nextFeatures = [...publicSettings.features];
                              nextFeatures[index] = {
                                ...nextFeatures[index],
                                title: e.target.value,
                              };
                              setPublicSettings({
                                ...publicSettings,
                                features: nextFeatures,
                              });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <textarea
                            value={feature.description}
                            onChange={(e) => {
                              const nextFeatures = [...publicSettings.features];
                              nextFeatures[index] = {
                                ...nextFeatures[index],
                                description: e.target.value,
                              };
                              setPublicSettings({
                                ...publicSettings,
                                features: nextFeatures,
                              });
                            }}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Khu vực kêu gọi hành động cuối
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          value={publicSettings.ctaTitle}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              ctaTitle: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Phụ đề
                        </label>
                        <input
                          type="text"
                          value={publicSettings.ctaSubtitle}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              ctaSubtitle: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Nhãn nút
                        </label>
                        <input
                          type="text"
                          value={publicSettings.ctaButtonLabel}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              ctaButtonLabel: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          URL nút
                        </label>
                        <input
                          type="text"
                          value={publicSettings.ctaButtonHref}
                          onChange={(e) =>
                            setPublicSettings({
                              ...publicSettings,
                              ctaButtonHref: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Tùy chọn thông báo
                  </h2>
                  <p className="text-sm text-gray-600">
                    Quản lý thông báo và email
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Thông báo qua email
                        </p>
                        <p className="text-xs text-gray-500">
                          Nhận thông báo qua email
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Thông báo đẩy
                        </p>
                        <p className="text-xs text-gray-500">
                          Nhận thông báo trên trình duyệt
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          pushNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Báo cáo tuần
                        </p>
                        <p className="text-xs text-gray-500">
                          Báo cáo tuần qua email
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.weeklyReport}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          weeklyReport: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Cài đặt bảo mật
                  </h2>
                  <p className="text-sm text-gray-600">
                    Bảo mật tài khoản
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button className="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                    <Lock className="inline-block w-4 h-4 mr-2" />
                    Cập nhật
                  </button>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Xác thực hai lớp (2FA)
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Tính năng đang phát triển, sẽ mở khi hoàn thiện.
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Sắp ra mắt
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Payments Settings */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Cấu hình thanh toán
                  </h2>
                  <p className="text-sm text-gray-600">
                    Thiết lập cổng thanh toán cho nền tảng.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Cổng thanh toán
                    </label>
                    <select
                      value={settings.paymentGateway}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          paymentGateway: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="payos">PayOS</option>
                      <option value="vnpay">VNPay</option>
                      <option value="stripe">Stripe</option>
                      <option value="manual">Chuyển khoản thủ công</option>
                    </select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Khóa công khai
                      </label>
                      <input
                        type="text"
                        value={settings.paymentPublicKey}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            paymentPublicKey: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Khóa bí mật
                      </label>
                      <input
                        type="password"
                        value={settings.paymentSecretKey}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            paymentSecretKey: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Bí mật webhook
                    </label>
                    <input
                      type="password"
                      value={settings.paymentWebhookSecret}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          paymentWebhookSecret: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Share Settings */}
            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Chia sẻ doanh thu
                  </h2>
                  <p className="text-sm text-gray-600">
                    Thiết lập tỷ lệ chia sẻ giữa nền tảng và giảng viên.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Phí nền tảng (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={settings.platformFeePercent}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          platformFeePercent: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Giảng viên nhận (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={settings.instructorSharePercent}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          instructorSharePercent: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  Tổng hiện tại: <span className="font-semibold">{revenueTotal}%</span>.
                  Gợi ý: 100%.
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
              <button className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



