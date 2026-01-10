import Link from 'next/link';
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';

const contactCards = [
  {
    title: 'Email',
    detail: 'support@learnhub.vn',
    description: 'Gửi email để được hỗ trợ nhanh chóng.',
    icon: Mail,
  },
  {
    title: 'Hotline',
    detail: '1900 123 456',
    description: 'Hỗ trợ 24/7 tất cả ngày trong tuần.',
    icon: Phone,
  },
  {
    title: 'Văn phòng',
    detail: '89 Nguyễn Huệ, Quận 1, TP.HCM',
    description: 'Ghé thăm chúng tôi trong giờ hành chính.',
    icon: MapPin,
  },
  {
    title: 'Giờ làm việc',
    detail: '08:30 - 18:00 (Thứ 2 - Thứ 6)',
    description: 'Luôn sẵn sàng hỗ trợ bạn.',
    icon: Clock,
  },
];

const faqs = [
  {
    question: 'Tôi có thể học thử trước khi đăng ký không?',
    answer: 'Có. Nhiều khóa học có bài học miễn phí để bạn trải nghiệm.',
  },
  {
    question: 'Thời hạn truy cập khóa học là bao lâu?',
    answer: 'Bạn có thể truy cập trọn đời sau khi đăng ký thành công.',
  },
  {
    question: 'Tôi cần hỗ trợ kỹ thuật thì làm thế nào?',
    answer: 'Gửi email hoặc chat trực tiếp, đội ngũ sẽ phản hồi trong 24 giờ.',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                <MessageCircle className="h-4 w-4" />
                Hỗ trợ nhanh - phản hồi trong 24 giờ
              </span>
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Liên hệ với LearnHub
              </h1>
              <p className="text-lg leading-relaxed text-gray-600">
                Chúng tôi luôn sẵn sàng lắng nghe câu hỏi, góp ý hoặc đề xuất hợp
                tác từ bạn. Hãy để lại thông tin, đội ngũ LearnHub sẽ kết nối ngay.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
                >
                  Tìm hiểu về LearnHub
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
                >
                  Xem khóa học
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-xl backdrop-blur">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
                    <Send className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email phản hồi</p>
                      <p className="font-semibold text-gray-900">
                        hello@learnhub.vn
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-purple-50 p-4">
                    <Phone className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Hotline ưu tiên</p>
                      <p className="font-semibold text-gray-900">
                        028 7300 9988
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-600">
                    Đội ngũ chăm sóc học viên sẽ xác nhận yêu cầu của bạn trong
                    vòng 24 giờ làm việc.
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl" />
              <div className="absolute -right-8 top-10 h-40 w-40 rounded-full bg-purple-200/40 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="mt-1 font-medium text-gray-800">
                    {card.detail}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900">
                Gửi yêu cầu cho chúng tôi
              </h2>
              <p className="mt-3 text-gray-600">
                Điền thông tin dưới đây để đội ngũ LearnHub hỗ trợ bạn nhanh nhất.
              </p>
              <form className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Chủ đề
                  </label>
                  <input
                    type="text"
                    placeholder="Bạn cần hỗ trợ về khóa học, thanh toán..."
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Nội dung
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Mô tả chi tiết yêu cầu của bạn"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
                >
                  Gửi yêu cầu
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Bản đồ văn phòng
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Bản đồ đang được cập nhật. Bạn có thể liên hệ hotline để được
                  hướng dẫn đường đi nhanh nhất.
                </p>
                <div className="mt-4 flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white text-sm text-gray-500">
                  Khu vực hiển thị bản đồ
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">
                  Câu hỏi thường gặp
                </h3>
                <div className="mt-4 space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="rounded-2xl bg-gray-50 p-4">
                      <p className="font-semibold text-gray-900">
                        {faq.question}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/courses"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Xem thêm tài nguyên học tập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
