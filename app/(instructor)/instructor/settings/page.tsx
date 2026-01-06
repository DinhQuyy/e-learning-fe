'use client';

import { useState } from 'react';
import {
  Lock,
  Bell,
  CreditCard,
  Globe,
  Shield,
  Mail,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function InstructorSettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tabs = [
    { id: 'account', label: 'Tài khoản', icon: Shield },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
    { id: 'payment', label: 'Thanh toán', icon: CreditCard },
    { id: 'privacy', label: 'Quyền riêng tư', icon: Lock },
  ];

  const [accountSettings, setAccountSettings] = useState({
    email: 'instructor@email.com',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewStudent: true,
    emailNewReview: true,
    emailNewQuestion: true,
    emailWeeklySummary: true,
    emailPromotions: false,
    pushNewStudent: true,
    pushNewReview: false,
    pushNewQuestion: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    bankName: 'Vietcombank',
    accountNumber: '1234567890',
    accountName: 'NGUYEN VAN GIANG VIEN',
    paymentMethod: 'bank'
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnline: true,
    dataSharing: false
  });

  const handleSaveAccount = () => {
    alert('Đã lưu cài đặt tài khoản!');
  };

  const handleChangePassword = () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    alert('Đã thay đổi mật khẩu thành công!');
    setAccountSettings({
      ...accountSettings,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Cài đặt</h1>
            <p className="mt-2 text-gray-600">Quản lý tài khoản và tùy chọn của bạn</p>
          </div>

          {/* Tabs */}
          <div className="mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex overflow-x-auto border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-8">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-6 text-xl font-bold text-gray-900">Thông tin tài khoản</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          Email đăng nhập
                        </label>
                        <input
                          type="email"
                          value={accountSettings.email}
                          onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Ngôn ngữ
                          </label>
                          <select
                            value={accountSettings.language}
                            onChange={(e) => setAccountSettings({ ...accountSettings, language: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                          </select>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Múi giờ
                          </label>
                          <select
                            value={accountSettings.timezone}
                            onChange={(e) => setAccountSettings({ ...accountSettings, timezone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</option>
                            <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                            <option value="Asia/Singapore">Singapore (GMT+8)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handleSaveAccount}
                        className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl"
                      >
                        <Save className="w-5 h-5" />
                        Lưu thay đổi
                      </button>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <h3 className="mb-6 text-xl font-bold text-gray-900">Thay đổi mật khẩu</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          Mật khẩu hiện tại
                        </label>
                        <div className="relative">
                          <input
                            type={showOldPassword ? 'text' : 'password'}
                            value={accountSettings.oldPassword}
                            onChange={(e) => setAccountSettings({ ...accountSettings, oldPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                          >
                            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          Mật khẩu mới
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={accountSettings.newPassword}
                            onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          Xác nhận mật khẩu mới
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={accountSettings.confirmPassword}
                            onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleChangePassword}
                        className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        <Lock className="w-5 h-5" />
                        Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-6 text-xl font-bold text-gray-900">Thông báo Email</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNewStudent', label: 'Học viên mới đăng ký khóa học' },
                        { key: 'emailNewReview', label: 'Đánh giá mới từ học viên' },
                        { key: 'emailNewQuestion', label: 'Câu hỏi mới từ học viên' },
                        { key: 'emailWeeklySummary', label: 'Báo cáo tổng kết hàng tuần' },
                        { key: 'emailPromotions', label: 'Khuyến mãi và tin tức' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{label}</span>
                          </div>
                          <label className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              checked={notificationSettings[key as keyof typeof notificationSettings]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 transition-colors bg-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-600"></div>
                            <div className="absolute w-4 h-4 transition-transform bg-white rounded-full left-1 top-1 peer-checked:translate-x-6"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div>
                    <h3 className="mb-6 text-xl font-bold text-gray-900">Thông báo Push</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'pushNewStudent', label: 'Học viên mới' },
                        { key: 'pushNewReview', label: 'Đánh giá mới' },
                        { key: 'pushNewQuestion', label: 'Câu hỏi mới' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{label}</span>
                          </div>
                          <label className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              checked={notificationSettings[key as keyof typeof notificationSettings]}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 transition-colors bg-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-600"></div>
                            <div className="absolute w-4 h-4 transition-transform bg-white rounded-full left-1 top-1 peer-checked:translate-x-6"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl">
                    <Save className="w-5 h-5" />
                    Lưu cài đặt
                  </button>
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === 'payment' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-6 text-xl font-bold text-gray-900">Phương thức thanh toán</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          Ngân hàng
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.bankName}
                          onChange={(e) => setPaymentSettings({ ...paymentSettings, bankName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          Số tài khoản
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.accountNumber}
                          onChange={(e) => setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          Tên tài khoản
                        </label>
                        <input
                          type="text"
                          value={paymentSettings.accountName}
                          onChange={(e) => setPaymentSettings({ ...paymentSettings, accountName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="mb-1 font-semibold text-blue-900">Chu kỳ thanh toán</h4>
                        <p className="text-sm text-blue-700">
                          Doanh thu sẽ được thanh toán vào ngày 15 hàng tháng cho doanh thu của tháng trước.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl">
                    <Save className="w-5 h-5" />
                    Lưu thông tin
                  </button>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="mb-6 text-xl font-bold text-gray-900">Quyền riêng tư</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'showEmail', label: 'Hiển thị email công khai', description: 'Học viên có thể thấy email của bạn' },
                        { key: 'showPhone', label: 'Hiển thị số điện thoại', description: 'Học viên có thể thấy số điện thoại của bạn' },
                        { key: 'allowMessages', label: 'Cho phép nhận tin nhắn', description: 'Học viên có thể gửi tin nhắn trực tiếp' },
                        { key: 'showOnline', label: 'Hiển thị trạng thái online', description: 'Người khác biết khi bạn đang trực tuyến' },
                        { key: 'dataSharing', label: 'Chia sẻ dữ liệu', description: 'Chia sẻ dữ liệu với đối tác để cải thiện dịch vụ' }
                      ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-start justify-between p-4 rounded-lg bg-gray-50">
                          <div>
                            <div className="mb-1 font-semibold text-gray-900">{label}</div>
                            <div className="text-sm text-gray-600">{description}</div>
                          </div>
                          <label className="relative inline-block w-12 h-6 mt-1">
                            <input
                              type="checkbox"
                              checked={privacySettings[key as keyof typeof privacySettings]}
                              onChange={(e) => setPrivacySettings({
                                ...privacySettings,
                                [key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 transition-colors bg-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-600"></div>
                            <div className="absolute w-4 h-4 transition-transform bg-white rounded-full left-1 top-1 peer-checked:translate-x-6"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl">
                    <Save className="w-5 h-5" />
                    Lưu cài đặt
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 bg-white border-2 border-red-200 shadow-sm rounded-xl">
            <h3 className="mb-4 text-xl font-bold text-red-600">Vùng nguy hiểm</h3>
            <p className="mb-4 text-gray-600">
              Các hành động này không thể hoàn tác. Vui lòng cân nhắc kỹ trước khi thực hiện.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 font-semibold text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50">
                Xóa tất cả dữ liệu
              </button>
              <button className="px-6 py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">
                Đóng tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}