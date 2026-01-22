"use client";
import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  Users
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận 1, TP.HCM, Việt Nam',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Số điện thoại',
      content: '(+84) 123 456 789',
      link: 'tel:+84123456789',
      color: 'green'
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@learnhub.vn',
      link: 'mailto:contact@learnhub.vn',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      content: 'T2 - T6: 9:00 - 18:00',
      color: 'orange'
    }
  ];

  const quickHelp = [
    {
      icon: MessageSquare,
      title: 'Chat trực tiếp',
      description: 'Trò chuyện với đội hỗ trợ của chúng tôi',
      action: 'Bắt đầu chat'
    },
    {
      icon: HelpCircle,
      title: 'Trung tâm hỗ trợ',
      description: 'Tìm câu trả lời cho các câu hỏi thường gặp',
      action: 'Xem FAQ'
    },
    {
      icon: Users,
      title: 'Cộng đồng',
      description: 'Tham gia cộng đồng học viên',
      action: 'Tham gia ngay'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 text-5xl font-bold">Liên hệ với chúng tôi</h1>
            <p className="text-xl text-blue-100">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. 
              Hãy để lại thông tin và chúng tôi sẽ phản hồi sớm nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="grid gap-6 mb-16 md:grid-cols-2 lg:grid-cols-4 -mt-28">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const colors = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
                orange: 'bg-orange-100 text-orange-600'
              };

              return (
                <div key={index} className="p-6 transition-shadow bg-white shadow-lg rounded-xl hover:shadow-xl">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${colors[info.color as keyof typeof colors]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">{info.title}</h3>
                  {info.link ? (
                    <a href={info.link} className="text-gray-600 transition-colors hover:text-blue-600">
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.content}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="p-8 bg-white shadow-lg rounded-xl">
                <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  Gửi tin nhắn cho chúng tôi
                </h2>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="0123 456 789"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Chủ đề *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="general">Câu hỏi chung</option>
                        <option value="course">Về khóa học</option>
                        <option value="technical">Hỗ trợ kỹ thuật</option>
                        <option value="partnership">Hợp tác</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Tin nhắn *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="flex items-center justify-center w-full gap-2 px-8 py-4 font-semibold text-white transition-all rounded-lg md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl"
                  >
                    <Send className="w-5 h-5" />
                    Gửi tin nhắn
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Help Sidebar */}
            <div className="space-y-6">
              <div className="p-6 bg-white shadow-lg rounded-xl">
                <h3 className="mb-4 text-xl font-bold text-gray-900">
                  Hỗ trợ nhanh
                </h3>
                <div className="space-y-4">
                  {quickHelp.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="p-4 transition-colors border border-gray-200 rounded-lg hover:border-blue-500">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="mb-1 font-semibold text-gray-900">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <button className="w-full text-sm font-semibold text-center text-blue-600 hover:text-blue-700">
                          {item.action} →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map */}
              <div className="overflow-hidden bg-white shadow-lg rounded-xl">
                <div className="h-64 bg-gray-200">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4967826873936!2d106.69522831533431!3d10.775394392321492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc9%3A0xb55e9d1c59091db7!2sHCMC!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h4 className="mb-1 font-semibold text-gray-900">
                    Văn phòng LearnHub
                  </h4>
                  <p className="text-sm text-gray-600">
                    123 Đường ABC, Quận 1, TP.HCM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Câu hỏi thường gặp
            </h2>
            <p className="mb-8 text-gray-600">
              Có thể bạn sẽ tìm thấy câu trả lời tại đây
            </p>
            <a
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Xem tất cả FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
