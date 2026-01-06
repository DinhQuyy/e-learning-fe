"use client";
import { useState } from 'react';
import { ChevronDown, Search, HelpCircle, BookOpen, CreditCard, Users, Settings } from 'lucide-react';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả', icon: HelpCircle },
    { id: 'general', label: 'Câu hỏi chung', icon: BookOpen },
    { id: 'payment', label: 'Thanh toán', icon: CreditCard },
    { id: 'account', label: 'Tài khoản', icon: Users },
    { id: 'technical', label: 'Kỹ thuật', icon: Settings },
  ];

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: 'LearnHub là gì?',
      answer: 'LearnHub là nền tảng học trực tuyến hàng đầu Việt Nam, cung cấp hơn 1,200 khóa học chất lượng cao trong nhiều lĩnh vực như Web Development, Data Science, Design, Marketing và nhiều hơn nữa. Chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất với giảng viên chuyên môn cao và nội dung được cập nhật liên tục.'
    },
    {
      id: 2,
      category: 'general',
      question: 'Làm thế nào để đăng ký khóa học?',
      answer: 'Để đăng ký khóa học, bạn cần: 1) Tạo tài khoản miễn phí trên LearnHub, 2) Tìm kiếm và chọn khóa học phù hợp, 3) Click "Đăng ký học ngay" hoặc "Thêm vào giỏ hàng", 4) Thanh toán qua các phương thức được hỗ trợ. Sau khi thanh toán thành công, bạn có thể bắt đầu học ngay lập tức.'
    },
    {
      id: 3,
      category: 'general',
      question: 'Tôi có thể học mọi lúc mọi nơi không?',
      answer: 'Có! Sau khi đăng ký, bạn có thể truy cập khóa học 24/7 trên bất kỳ thiết bị nào (máy tính, điện thoại, tablet). Tất cả khóa học đều có quyền truy cập trọn đời, bạn có thể học theo tốc độ của mình và xem lại bất cứ lúc nào.'
    },
    {
      id: 4,
      category: 'payment',
      question: 'Các phương thức thanh toán nào được chấp nhận?',
      answer: 'Chúng tôi chấp nhận nhiều phương thức thanh toán: Thẻ tín dụng/ghi nợ (Visa, Mastercard), Chuyển khoản ngân hàng, Ví điện tử (MoMo, ZaloPay, VNPay), và thanh toán tại cửa hàng tiện lợi. Tất cả giao dịch đều được bảo mật với tiêu chuẩn quốc tế.'
    },
    {
      id: 5,
      category: 'payment',
      question: 'Chính sách hoàn tiền như thế nào?',
      answer: 'Chúng tôi cung cấp chính sách hoàn tiền trong vòng 30 ngày đầu tiên nếu bạn không hài lòng với khóa học. Để được hoàn tiền, bạn chưa hoàn thành quá 30% khóa học. Tiền sẽ được hoàn lại trong vòng 7-10 ngày làm việc sau khi yêu cầu được chấp nhận.'
    },
    {
      id: 6,
      category: 'payment',
      question: 'Có mã giảm giá hoặc khuyến mãi không?',
      answer: 'Có! Chúng tôi thường xuyên có các chương trình khuyến mãi và mã giảm giá. Đăng ký nhận tin để không bỏ lỡ các ưu đãi đặc biệt. Ngoài ra, học viên mới thường nhận được giảm giá cho khóa học đầu tiên.'
    },
    {
      id: 7,
      category: 'account',
      question: 'Làm sao để tạo tài khoản?',
      answer: 'Click vào nút "Đăng ký" ở góc trên cùng, điền thông tin cơ bản (tên, email, mật khẩu), xác nhận email và bạn đã có thể bắt đầu học. Quá trình chỉ mất 1-2 phút. Bạn cũng có thể đăng ký nhanh bằng tài khoản Google hoặc Facebook.'
    },
    {
      id: 8,
      category: 'account',
      question: 'Quên mật khẩu thì làm sao?',
      answer: 'Click vào "Quên mật khẩu?" trên trang đăng nhập, nhập email đã đăng ký. Chúng tôi sẽ gửi link đặt lại mật khẩu đến email của bạn. Link có hiệu lực trong 24 giờ.'
    },
    {
      id: 9,
      category: 'account',
      question: 'Tôi có thể đổi email tài khoản không?',
      answer: 'Có, bạn có thể thay đổi email trong phần "Cài đặt tài khoản". Sau khi thay đổi, bạn cần xác nhận email mới để hoàn tất quá trình.'
    },
    {
      id: 10,
      category: 'technical',
      question: 'Yêu cầu hệ thống để xem video?',
      answer: 'Bạn cần: Kết nối internet ổn định (khuyến nghị 5Mbps+), trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge phiên bản mới nhất), và thiết bị hỗ trợ HTML5. Đối với app mobile, cần iOS 12+ hoặc Android 6+.'
    },
    {
      id: 11,
      category: 'technical',
      question: 'Video bị lag hoặc không load được?',
      answer: 'Thử các cách sau: 1) Kiểm tra kết nối internet, 2) Làm mới trang, 3) Xóa cache trình duyệt, 4) Thử trình duyệt khác, 5) Giảm chất lượng video nếu mạng yếu. Nếu vẫn không được, liên hệ support để được hỗ trợ.'
    },
    {
      id: 12,
      category: 'technical',
      question: 'Tôi có thể tải video về xem offline không?',
      answer: 'Hiện tại, tính năng tải video chỉ có trên app mobile (iOS/Android). Bạn có thể tải một số bài học về xem offline trong app. Video sẽ tự động xóa sau 30 ngày hoặc khi bạn đăng xuất.'
    },
    {
      id: 13,
      category: 'general',
      question: 'Tôi có nhận được chứng chỉ sau khi hoàn thành khóa học không?',
      answer: 'Có! Sau khi hoàn thành 100% khóa học và đạt điểm tối thiểu trong các bài kiểm tra (nếu có), bạn sẽ nhận được chứng chỉ hoàn thành có thể in ra hoặc chia sẻ trên LinkedIn. Chứng chỉ có giá trị về mặt học thuật và được nhiều nhà tuyển dụng công nhận.'
    },
    {
      id: 14,
      category: 'general',
      question: 'Tôi có thể tương tác với giảng viên không?',
      answer: 'Có! Mỗi khóa học có phần Q&A nơi bạn có thể đặt câu hỏi và giảng viên hoặc cộng đồng sẽ trả lời. Một số khóa học còn có buổi live session định kỳ để tương tác trực tiếp với giảng viên.'
    },
    {
      id: 15,
      category: 'account',
      question: 'Tài khoản của tôi có thời hạn sử dụng không?',
      answer: 'Không! Tài khoản của bạn vĩnh viễn và hoàn toàn miễn phí. Các khóa học đã mua cũng có quyền truy cập trọn đời. Bạn có thể quay lại xem lại bất cứ lúc nào, không giới hạn.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="mb-6 text-5xl font-bold">Câu hỏi thường gặp</h1>
            <p className="mb-8 text-xl text-blue-100">
              Tìm câu trả lời cho các câu hỏi phổ biến nhất về LearnHub
            </p>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pl-12 pr-4 text-gray-900 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="container px-4 mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="py-16 text-center">
                <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Không tìm thấy kết quả
                </h3>
                <p className="mb-6 text-gray-600">
                  Thử tìm kiếm với từ khóa khác hoặc liên hệ với chúng tôi
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Liên hệ hỗ trợ
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="overflow-hidden transition-colors bg-white border-2 border-gray-200 shadow-sm rounded-xl hover:border-blue-500"
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="flex items-center justify-between w-full px-6 py-5 text-left transition-colors hover:bg-gray-50"
                    >
                      <span className="pr-4 font-semibold text-gray-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                          expandedId === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedId === faq.id && (
                      <div className="px-6 pt-2 pb-5 leading-relaxed text-gray-600 border-t border-gray-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Vẫn còn thắc mắc?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="px-8 py-4 font-semibold text-blue-600 transition-all bg-white rounded-lg hover:shadow-xl"
              >
                Liên hệ với chúng tôi
              </a>
              <a
                href="/help"
                className="px-8 py-4 font-semibold text-white transition-all border-2 border-white rounded-lg hover:bg-white hover:text-blue-600"
              >
                Trung tâm hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}