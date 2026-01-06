import { Search, BookOpen, CreditCard, Users, Settings, MessageSquare, Phone, Mail, Video, FileText, Award, HelpCircle } from 'lucide-react';

export default function HelpPage() {
  const categories = [
    {
      icon: BookOpen,
      title: 'Bắt đầu học',
      description: 'Hướng dẫn cho người mới bắt đầu',
      articles: 12,
      color: 'blue'
    },
    {
      icon: CreditCard,
      title: 'Thanh toán & Giá',
      description: 'Thông tin về thanh toán và hoàn tiền',
      articles: 8,
      color: 'green'
    },
    {
      icon: Users,
      title: 'Quản lý tài khoản',
      description: 'Cài đặt và bảo mật tài khoản',
      articles: 10,
      color: 'purple'
    },
    {
      icon: Video,
      title: 'Vấn đề kỹ thuật',
      description: 'Giải quyết các lỗi phổ biến',
      articles: 15,
      color: 'orange'
    },
    {
      icon: Award,
      title: 'Chứng chỉ',
      description: 'Về chứng chỉ và hoàn thành',
      articles: 6,
      color: 'pink'
    },
    {
      icon: Settings,
      title: 'Cài đặt nâng cao',
      description: 'Tùy chỉnh trải nghiệm học',
      articles: 9,
      color: 'indigo'
    }
  ];

  const popularArticles = [
    {
      title: 'Làm thế nào để đăng ký khóa học?',
      category: 'Bắt đầu học',
      views: '15,420'
    },
    {
      title: 'Chính sách hoàn tiền 30 ngày',
      category: 'Thanh toán',
      views: '12,305'
    },
    {
      title: 'Cách nhận chứng chỉ hoàn thành',
      category: 'Chứng chỉ',
      views: '10,892'
    },
    {
      title: 'Video không load được - Khắc phục',
      category: 'Kỹ thuật',
      views: '9,576'
    },
    {
      title: 'Đổi mật khẩu và email tài khoản',
      category: 'Tài khoản',
      views: '8,234'
    }
  ];

  const quickActions = [
    {
      icon: MessageSquare,
      title: 'Chat trực tiếp',
      description: 'Trò chuyện với đội hỗ trợ',
      action: 'Bắt đầu chat',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Gọi điện',
      description: '(+84) 123 456 789',
      action: 'Gọi ngay',
      color: 'green'
    },
    {
      icon: Mail,
      title: 'Gửi email',
      description: 'support@learnhub.vn',
      action: 'Gửi email',
      color: 'purple'
    }
  ];

  const contactHours = [
    { day: 'Thứ 2 - Thứ 6', time: '9:00 - 18:00' },
    { day: 'Thứ 7', time: '9:00 - 14:00' },
    { day: 'Chủ nhật', time: 'Đóng cửa' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="mb-6 text-5xl font-bold">
              Chúng tôi có thể giúp gì cho bạn?
            </h1>
            <p className="mb-8 text-xl text-blue-100">
              Tìm câu trả lời nhanh chóng hoặc liên hệ với đội hỗ trợ của chúng tôi
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết hỗ trợ..."
                className="w-full py-4 pl-12 pr-4 text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
            </div>

            <p className="mt-4 text-sm text-blue-100">
              Ví dụ: "cách thanh toán", "lấy lại mật khẩu", "chứng chỉ"
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            Danh mục hỗ trợ
          </h2>

          <div className="grid max-w-6xl gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const colors = {
                blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
                green: 'bg-green-100 text-green-600 hover:bg-green-200',
                purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
                orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
                pink: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
                indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              };

              return (
                <a
                  key={index}
                  href="#"
                  className="p-6 transition-all bg-white border-2 border-gray-200 shadow-sm rounded-xl hover:border-blue-500 hover:shadow-lg group"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${colors[category.color as keyof typeof colors]} transition-colors`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                    {category.title}
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">
                    {category.description}
                  </p>
                  <div className="text-sm font-semibold text-blue-600">
                    {category.articles} bài viết →
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Bài viết phổ biến
            </h2>

            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <a
                  key={index}
                  href="#"
                  className="block p-6 transition-all border-2 border-transparent bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-500 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="px-3 py-1 font-medium text-blue-700 bg-blue-100 rounded-full">
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {article.views} lượt xem
                        </span>
                      </div>
                    </div>
                    <div className="text-blue-600 transition-transform group-hover:translate-x-1">
                      →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold text-center text-gray-900">
              Vẫn cần hỗ trợ?
            </h2>
            <p className="mb-12 text-center text-gray-600">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
            </p>

            <div className="grid gap-6 mb-12 md:grid-cols-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const colors = {
                  blue: 'bg-blue-100 text-blue-600',
                  green: 'bg-green-100 text-green-600',
                  purple: 'bg-purple-100 text-purple-600'
                };

                return (
                  <div
                    key={index}
                    className="p-6 text-center transition-all bg-white border-2 border-gray-200 shadow-sm rounded-xl hover:border-blue-500 hover:shadow-lg"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${colors[action.color as keyof typeof colors]}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      {action.title}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      {action.description}
                    </p>
                    <button className="w-full px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                      {action.action}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Contact Hours */}
            <div className="p-8 bg-white border-2 border-gray-200 shadow-sm rounded-xl">
              <h3 className="mb-6 text-xl font-bold text-center text-gray-900">
                Giờ làm việc
              </h3>
              <div className="max-w-md mx-auto space-y-3">
                {contactHours.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
                  >
                    <span className="font-semibold text-gray-900">{item.day}</span>
                    <span className="text-gray-600">{item.time}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-center text-gray-600">
                📧 Email hỗ trợ 24/7: support@learnhub.vn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Không tìm thấy câu trả lời?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Hãy xem thêm các câu hỏi thường gặp hoặc liên hệ trực tiếp với chúng tôi
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/faq"
                className="px-8 py-4 font-semibold text-blue-600 transition-all bg-white rounded-lg hover:shadow-xl"
              >
                Xem FAQ
              </a>
              <a
                href="/contact"
                className="px-8 py-4 font-semibold text-white transition-all border-2 border-white rounded-lg hover:bg-white hover:text-blue-600"
              >
                Liên hệ với chúng tôi
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}