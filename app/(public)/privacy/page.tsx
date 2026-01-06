import { Shield, Lock, Eye, Database, UserCheck, Bell } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: '1. Thông tin Chúng tôi Thu thập',
      content: `Chúng tôi thu thập các loại thông tin sau:

**Thông tin cá nhân:**
- Họ tên, email, số điện thoại
- Địa chỉ (nếu cần thiết)
- Ảnh đại diện (tùy chọn)
- Thông tin thanh toán (được mã hóa và bảo mật)

**Thông tin sử dụng:**
- Lịch sử học tập và tiến độ khóa học
- Tương tác với nội dung và giảng viên
- Các bài kiểm tra và kết quả
- Thời gian truy cập và hoạt động trên nền tảng

**Thông tin kỹ thuật:**
- Địa chỉ IP, loại thiết bị, trình duyệt
- Cookies và công nghệ tương tự
- Dữ liệu phân tích và hiệu suất`
    },
    {
      icon: Eye,
      title: '2. Cách Chúng tôi Sử dụng Thông tin',
      content: `Chúng tôi sử dụng thông tin của bạn để:

**Cung cấp dịch vụ:**
- Tạo và quản lý tài khoản của bạn
- Cho phép truy cập vào các khóa học đã đăng ký
- Xử lý thanh toán và hoàn tiền
- Cung cấp hỗ trợ khách hàng

**Cải thiện trải nghiệm:**
- Cá nhân hóa nội dung và đề xuất khóa học
- Phân tích và cải thiện chất lượng dịch vụ
- Nghiên cứu và phát triển tính năng mới

**Giao tiếp:**
- Gửi thông báo về khóa học và tài khoản
- Thông tin về chương trình khuyến mãi (nếu bạn đồng ý)
- Cập nhật về chính sách và điều khoản

**Bảo mật:**
- Phát hiện và ngăn chặn gian lận
- Bảo vệ an toàn cho người dùng và nền tảng
- Tuân thủ các yêu cầu pháp lý`
    },
    {
      icon: Lock,
      title: '3. Bảo mật Thông tin',
      content: `Chúng tôi cam kết bảo vệ thông tin của bạn:

**Biện pháp kỹ thuật:**
- Mã hóa SSL/TLS cho mọi giao tiếp
- Mã hóa dữ liệu nhạy cảm trong cơ sở dữ liệu
- Tường lửa và hệ thống phát hiện xâm nhập
- Sao lưu dữ liệu định kỳ và an toàn

**Biện pháp tổ chức:**
- Kiểm soát truy cập nghiêm ngặt
- Đào tạo nhân viên về bảo mật
- Kiểm tra bảo mật định kỳ
- Tuân thủ các tiêu chuẩn quốc tế

**Lưu trữ:**
- Dữ liệu được lưu trữ trên máy chủ an toàn
- Tuân thủ quy định về lưu trữ dữ liệu tại Việt Nam
- Chỉ giữ thông tin trong thời gian cần thiết`
    },
    {
      icon: UserCheck,
      title: '4. Chia sẻ Thông tin',
      content: `Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ với:

**Nhà cung cấp dịch vụ:**
- Xử lý thanh toán (được mã hóa)
- Lưu trữ đám mây (được mã hóa)
- Phân tích dữ liệu (dữ liệu ẩn danh)
- Gửi email (chỉ khi cần thiết)

Tất cả các bên thứ ba đều phải tuân thủ các tiêu chuẩn bảo mật nghiêm ngặt.

**Yêu cầu pháp lý:**
- Tuân thủ lệnh tòa án hoặc quy trình pháp lý
- Bảo vệ quyền và an toàn của LearnHub
- Ngăn chặn gian lận hoặc vi phạm`
    },
    {
      icon: Bell,
      title: '5. Quyền của Bạn',
      content: `Bạn có quyền:

**Truy cập và Kiểm soát:**
- Xem thông tin cá nhân mà chúng tôi lưu trữ
- Yêu cầu sửa đổi thông tin không chính xác
- Yêu cầu xóa tài khoản và dữ liệu
- Xuất dữ liệu của bạn

**Quản lý Giao tiếp:**
- Chọn nhận hoặc từ chối email marketing
- Cập nhật tùy chọn thông báo
- Quản lý cookie và theo dõi

**Khiếu nại:**
- Liên hệ với chúng tôi về mối quan ngại bảo mật
- Nộp khiếu nại lên cơ quan có thẩm quyền

Để thực hiện các quyền này, vui lòng liên hệ privacy@learnhub.vn`
    },
    {
      title: '6. Cookies và Công nghệ Theo dõi',
      content: `Chúng tôi sử dụng cookies để:

**Cookies cần thiết:**
- Duy trì phiên đăng nhập
- Lưu trữ tùy chọn của bạn
- Đảm bảo bảo mật

**Cookies phân tích:**
- Hiểu cách người dùng sử dụng nền tảng
- Cải thiện hiệu suất và trải nghiệm
- Dữ liệu được ẩn danh

**Cookies marketing:**
- Hiển thị quảng cáo phù hợp
- Đo lường hiệu quả chiến dịch
- Chỉ khi bạn đồng ý

Bạn có thể quản lý cookies trong cài đặt trình duyệt.`
    },
    {
      title: '7. Bảo vệ Trẻ em',
      content: `Dịch vụ của chúng tôi không dành cho trẻ em dưới 16 tuổi. Chúng tôi không cố ý thu thập thông tin từ trẻ em. Nếu bạn là phụ huynh và phát hiện con bạn đã cung cấp thông tin cho chúng tôi, vui lòng liên hệ để chúng tôi có thể xóa thông tin đó.

Đối với người dùng từ 16-18 tuổi, chúng tôi khuyến khích có sự giám sát của phụ huynh.`
    },
    {
      title: '8. Chuyển giao Dữ liệu Quốc tế',
      content: `Dữ liệu của bạn chủ yếu được lưu trữ tại Việt Nam. Trong một số trường hợp, dữ liệu có thể được chuyển đến các quốc gia khác để xử lý (ví dụ: dịch vụ đám mây). Chúng tôi đảm bảo rằng mọi chuyển giao dữ liệu đều tuân thủ các tiêu chuẩn bảo mật quốc tế và pháp luật hiện hành.`
    },
    {
      title: '9. Thay đổi Chính sách',
      content: `Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Chúng tôi sẽ thông báo về các thay đổi quan trọng qua:
- Email đến địa chỉ đã đăng ký
- Thông báo trên nền tảng
- Cập nhật ngày "Sửa đổi lần cuối" ở đầu tài liệu

Chúng tôi khuyến khích bạn xem lại chính sách này định kỳ.`
    },
    {
      title: '10. Liên hệ',
      content: `Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:

**Bộ phận Bảo mật Dữ liệu:**
Email: privacy@learnhub.vn
Điện thoại: (+84) 123 456 789
Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM, Việt Nam

**Thời gian phản hồi:** 3-5 ngày làm việc

Chúng tôi cam kết xử lý mọi yêu cầu một cách nghiêm túc và kịp thời.`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Chính sách Bảo mật
            </h1>
            <p className="text-xl text-blue-100">
              Cập nhật lần cuối: 06 Tháng 1, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badge */}
      <section className="py-8">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 border-l-4 border-blue-400 rounded-r-lg bg-blue-50">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="mb-2 font-bold text-blue-900">
                    Cam kết Bảo mật
                  </h3>
                  <p className="text-sm leading-relaxed text-blue-800">
                    Tại LearnHub, bảo mật thông tin cá nhân của bạn là ưu tiên hàng đầu. 
                    Chúng tôi sử dụng các công nghệ tiên tiến nhất và tuân thủ các tiêu chuẩn 
                    quốc tế để bảo vệ dữ liệu của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 bg-white shadow-lg rounded-xl md:p-12">
              <div className="space-y-10">
                {sections.map((section, index) => {
                  const Icon = section.icon || Shield;
                  return (
                    <div key={index} className="pb-8 border-b border-gray-200 last:border-0 last:pb-0">
                      <h2 className="flex items-start gap-3 mb-4 text-2xl font-bold text-gray-900">
                        <Icon className="flex-shrink-0 mt-1 text-blue-600 w-7 h-7" />
                        <span>{section.title}</span>
                      </h2>
                      <div className="pl-10 leading-relaxed text-gray-600 whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="pt-8 mt-12 border-t border-gray-200">
                <p className="text-sm text-center text-gray-600">
                  Bằng việc sử dụng LearnHub, bạn xác nhận rằng đã đọc, hiểu và đồng ý với 
                  chính sách bảo mật này.
                </p>
              </div>
            </div>

            {/* Related Links */}
            <div className="grid gap-6 mt-8 md:grid-cols-2">
              <a
                href="/terms"
                className="p-6 transition-all bg-white border-2 border-gray-200 shadow-sm rounded-xl hover:border-blue-500 hover:shadow-lg"
              >
                <h3 className="flex items-center gap-2 mb-2 font-bold text-gray-900">
                  Điều khoản Sử dụng
                  <span className="text-blue-600">→</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Tìm hiểu về các quy định sử dụng dịch vụ của LearnHub
                </p>
              </a>

              <a
                href="/contact"
                className="p-6 transition-all bg-white border-2 border-gray-200 shadow-sm rounded-xl hover:border-blue-500 hover:shadow-lg"
              >
                <h3 className="flex items-center gap-2 mb-2 font-bold text-gray-900">
                  Liên hệ về Bảo mật
                  <span className="text-blue-600">→</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Có thắc mắc? Liên hệ đội ngũ bảo mật của chúng tôi
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}