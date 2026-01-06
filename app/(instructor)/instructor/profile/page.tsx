'use client';

import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  Briefcase,
  Award,
  BookOpen,
  Users,
  DollarSign,
  Edit,
  Save,
  Camera,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

export default function InstructorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?img=68');
  
  const [profileData, setProfileData] = useState({
    fullName: 'Nguyễn Văn Giảng Viên',
    title: 'Senior Full-Stack Developer & Instructor',
    email: 'instructor@email.com',
    phone: '+84 901 234 567',
    location: 'Hồ Chí Minh, Việt Nam',
    bio: 'Với hơn 10 năm kinh nghiệm trong lĩnh vực lập trình web, tôi đam mê chia sẻ kiến thức và giúp đỡ học viên phát triển kỹ năng lập trình. Chuyên về React, Node.js, và các công nghệ web hiện đại.',
    expertise: ['React', 'Node.js', 'TypeScript', 'Next.js', 'MongoDB', 'UI/UX Design'],
    education: 'Đại học Bách Khoa TP.HCM - Khoa Công nghệ Thông tin',
    experience: '10+ năm',
    website: 'https://instructor-website.com',
    facebook: 'instructor.dev',
    twitter: '@instructor',
    linkedin: 'instructor-nguyen',
    youtube: 'InstructorChannel'
  });

  const stats = {
    totalCourses: 12,
    totalStudents: 2847,
    totalRevenue: 245000000,
    avgRating: 4.8,
    totalReviews: 1547,
    joinDate: '2023-01-15'
  };

  const achievements = [
    { icon: Award, label: 'Top Instructor 2024', color: 'text-yellow-600 bg-yellow-100' },
    { icon: Users, label: '2000+ Students', color: 'text-blue-600 bg-blue-100' },
    { icon: BookOpen, label: '10+ Courses', color: 'text-green-600 bg-green-100' },
    { icon: DollarSign, label: 'Top Earner', color: 'text-purple-600 bg-purple-100' }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Đã lưu thông tin!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Hồ sơ của tôi</h1>
              <p className="mt-2 text-gray-600">Quản lý thông tin cá nhân và hồ sơ giảng viên</p>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl"
            >
              {isEditing ? (
                <>
                  <Save className="w-5 h-5" />
                  Lưu thay đổi
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5" />
                  Chỉnh sửa
                </>
              )}
            </button>
          </div>

          {/* Profile Card */}
          <div className="p-8 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={avatar}
                  alt="Profile"
                  className="object-cover w-32 h-32 border-4 border-gray-200 rounded-full"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 text-white bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700">
                    <Camera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full px-4 py-2 mb-2 text-2xl font-bold border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={profileData.title}
                      onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="mb-2 text-3xl font-bold text-gray-900">{profileData.fullName}</h2>
                    <p className="mb-4 text-lg text-gray-600">{profileData.title}</p>
                  </>
                )}
                
                <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{profileData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Tham gia {new Date(stats.joinDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalCourses}</div>
                  <div className="text-xs text-gray-600">Khóa học</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Học viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.avgRating}</div>
                  <div className="text-xs text-gray-600">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">₫{(stats.totalRevenue / 1000000).toFixed(0)}M</div>
                  <div className="text-xs text-gray-600">Doanh thu</div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="p-6 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${achievement.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{achievement.label}</div>
                </div>
              );
            })}
          </div>

          {/* Detailed Information */}
          <div className="space-y-6">
            {/* About Me */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Giới thiệu</h3>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-600">{profileData.bio}</p>
              )}
            </div>

            {/* Contact & Professional Info */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Contact Info */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        {profileData.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Số điện thoại</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        {profileData.phone}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Địa chỉ</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {profileData.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-4 text-xl font-bold text-gray-900">Thông tin chuyên môn</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Học vấn</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.education}
                        onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-600">{profileData.education}</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Kinh nghiệm</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.experience}
                        onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        {profileData.experience}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Chuyên môn</label>
                    <div className="flex flex-wrap gap-2">
                      {profileData.expertise.map((skill, index) => (
                        <span key={index} className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Liên kết mạng xã hội</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      placeholder="Website"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <a href={profileData.website} className="text-blue-600 hover:underline">{profileData.website}</a>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.facebook}
                      onChange={(e) => setProfileData({ ...profileData, facebook: e.target.value })}
                      placeholder="Facebook"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-600">{profileData.facebook}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.twitter}
                      onChange={(e) => setProfileData({ ...profileData, twitter: e.target.value })}
                      placeholder="Twitter"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-600">{profileData.twitter}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.linkedin}
                      onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                      placeholder="LinkedIn"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-600">{profileData.linkedin}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}