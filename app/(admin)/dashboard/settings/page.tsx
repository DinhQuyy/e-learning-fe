'use client';

import { useState } from 'react';
import { 
  Save, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Mail,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'E-Learning Platform',
    siteDescription: 'Nền tảng học trực tuyến hiện đại',
    adminEmail: 'admin@elearning.com',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    maintenance: false,
  });

  const tabs = [
    { id: 'general', label: 'Chung', icon: Globe },
    { id: 'profile', label: 'Hồ sơ', icon: User },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'security', label: 'Bảo mật', icon: Shield },
    { id: 'appearance', label: 'Giao diện', icon: Palette },
  ];

  const handleSave = () => {
    alert('Lưu cài đặt thành công!');
  };

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
                    General Settings
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
                      value={settings.siteName}
                      onChange={(e) =>
                        setSettings({ ...settings, siteName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          siteDescription: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Admin Email
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
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Khu vực
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
                        checked={settings.maintenance}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            maintenance: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Maintenance Mode
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

            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Profile Settings
                  </h2>
                  <p className="text-sm text-gray-600">
                    Cập nhật thông tin cá nhân
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold text-white bg-blue-600 rounded-full">
                    A
                  </div>
                  <div>
                    <button className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                      Thay đổi ảnh đại diện
                    </button>
                    <p className="mt-2 text-xs text-gray-500">
                      JPG, PNG. Max 2MB
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Họ
                      </label>
                      <input
                        type="text"
                        defaultValue="Admin"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Tên
                      </label>
                      <input
                        type="text"
                        defaultValue="User"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@elearning.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      defaultValue="+84 123 456 789"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Notification Preferences
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
                          Email Notifications
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
                          Push Notifications
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
                          Weekly Report
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
                    Security Settings
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
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Two-Factor Authentication
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Bảo mật 2 lớp giúp bảo vệ tài khoản của bạn tốt hơn
                  </p>
                  <button className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-900">
                    Appearance Settings
                  </h2>
                  <p className="text-sm text-gray-600">
                    Tùy chỉnh giao diện hệ thống
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Màu nền giao diện
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-4 bg-white border-2 border-blue-600 rounded-lg">
                        <div className="w-full h-12 mb-2 rounded bg-linear-to-br from-blue-500 to-purple-600"></div>
                        <p className="text-sm font-medium">Light</p>
                      </button>
                      <button className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300">
                        <div className="w-full h-12 mb-2 rounded bg-linear-to-br from-gray-800 to-gray-900"></div>
                        <p className="text-sm font-medium">Dark</p>
                      </button>
                      <button className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300">
                        <div className="w-full h-12 mb-2 rounded bg-linear-to-br from-blue-500 via-purple-600 to-gray-900"></div>
                        <p className="text-sm font-medium">Auto</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Bảng màu
                    </label>
                    <div className="flex gap-3">
                      <button className="w-12 h-12 bg-blue-600 border-2 border-gray-300 rounded-lg"></button>
                      <button className="w-12 h-12 bg-green-600 border-2 border-gray-200 rounded-lg"></button>
                      <button className="w-12 h-12 bg-purple-600 border-2 border-gray-200 rounded-lg"></button>
                      <button className="w-12 h-12 bg-red-600 border-2 border-gray-200 rounded-lg"></button>
                      <button className="w-12 h-12 bg-orange-600 border-2 border-gray-200 rounded-lg"></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
              <button className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50">
                Huỷ
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