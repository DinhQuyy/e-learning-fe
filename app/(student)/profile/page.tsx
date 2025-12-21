'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Camera,
  Save,
  X,
  Award,
  BookOpen,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Student User',
    email: 'student@example.com',
    phone: '+84 123 456 789',
    location: 'Hồ Chí Minh, Việt Nam',
    bio: 'Đam mê học tập và phát triển bản thân. Hiện đang theo học các khóa Web Development và Data Science.',
    website: 'https://example.com',
    linkedin: 'linkedin.com/in/student',
    github: 'github.com/student',
  });

  const stats = [
    { icon: BookOpen, label: 'Khóa học đang học', value: '4', color: 'blue' },
    { icon: Award, label: 'Chứng chỉ', value: '8', color: 'green' },
    { icon: Clock, label: 'Giờ học', value: '156', color: 'purple' },
    { icon: TrendingUp, label: 'Điểm trung bình', value: '4.5', color: 'orange' },
  ];

  const certificates = [
    {
      id: 1,
      title: 'Python Programming Complete',
      issueDate: 'Tháng 11, 2024',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      issueDate: 'Tháng 10, 2024',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    },
    {
      id: 3,
      title: 'UI/UX Design Basics',
      issueDate: 'Tháng 9, 2024',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    },
  ];

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
            {/* Cover Photo */}
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
              <button className="absolute flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors rounded-lg bottom-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white">
                <Camera className="w-4 h-4" />
                Đổi ảnh bìa
              </button>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8">
              <div className="flex flex-col items-start gap-6 mb-6 -mt-16 md:flex-row md:items-end">
                {/* Avatar */}
                <div className="relative">
                  <div className="flex items-center justify-center w-32 h-32 text-4xl font-bold text-white border-4 border-white rounded-full shadow-lg bg-gradient-to-br from-blue-600 to-purple-600">
                    S
                  </div>
                  <button className="absolute flex items-center justify-center w-8 h-8 transition-colors bg-white rounded-full shadow-lg bottom-2 right-2 hover:bg-gray-100">
                    <Camera className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Name & Actions */}
                <div className="flex-1 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {formData.name}
                      </h1>
                      <p className="mt-1 text-gray-600">Học viên</p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-2 font-semibold text-gray-700 transition-all border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600"
                      >
                        <Edit2 className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">{formData.bio}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const colors = {
                    blue: 'bg-blue-100 text-blue-600',
                    green: 'bg-green-100 text-green-600',
                    purple: 'bg-purple-100 text-purple-600',
                    orange: 'bg-orange-100 text-orange-600',
                  };

                  return (
                    <div key={index} className="p-4 text-center rounded-lg bg-gray-50">
                      <div className={`w-10 h-10 ${colors[stat.color as keyof typeof colors]} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Profile Details */}
            <div className="space-y-8 lg:col-span-2">
              {/* Personal Information */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Thông tin cá nhân
                  </h2>
                  {isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4" />
                        Lưu
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4" />
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <Phone className="w-4 h-4" />
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.phone}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      <MapPin className="w-4 h-4" />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.location}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                      Giới thiệu
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{formData.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Certificates */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  Chứng chỉ ({certificates.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="overflow-hidden transition-all border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg group"
                    >
                      <div className="relative h-32 bg-gradient-to-br from-blue-600 to-purple-600">
                        <img
                          src={cert.thumbnail}
                          alt={cert.title}
                          className="object-cover w-full h-full transition-opacity opacity-20 group-hover:opacity-30"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Award className="w-12 h-12 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="mb-1 font-semibold text-gray-900 line-clamp-2">
                          {cert.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {cert.issueDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Links & Settings */}
            <div className="space-y-8">
              {/* Social Links */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Liên kết
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {formData.website}
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      LinkedIn
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.linkedin}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedin: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <a
                        href={`https://${formData.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {formData.linkedin}
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      GitHub
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.github}
                        onChange={(e) =>
                          setFormData({ ...formData, github: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <a
                        href={`https://${formData.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {formData.github}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Cài đặt tài khoản
                </h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
                    Đổi mật khẩu
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
                    Cài đặt thông báo
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
                    Quyền riêng tư
                  </button>
                  <button className="w-full px-4 py-2 text-sm text-left text-red-600 transition-colors rounded-lg hover:bg-red-50">
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}