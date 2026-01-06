import { FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Chấp nhận Điều khoản',
      content: `Bằng việc truy cập và sử dụng nền tảng LearnHub, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện được nêu trong tài liệu này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.`
    },
    {
      title: '2. Định nghĩa',
      content: `- "Nền tảng" là website và ứng dụng mobile LearnHub
- "Người dùng" là bất kỳ cá nhân nào truy cập hoặc sử dụng nền tảng
- "Khóa học" là nội dung giáo dục được cung cấp trên nền tảng
- "Giảng viên" là người tạo và cung cấp nội dung khóa học
- "Học viên" là người đăng ký và tham gia các khóa học`
    },
    {
      title: '3. Đăng ký Tài khoản',
      content: `Để sử dụng đầy đủ các tính năng của nền tảng, bạn cần:
- Tạo một tài khoản với thông tin chính xác và đầy đủ
- Duy trì và cập nhật thông tin tài khoản của bạn
- Bảo mật thông tin đăng nhập và chịu trách nhiệm cho mọi hoạt động dưới tài khoản của bạn
- Thông báo ngay cho chúng tôi nếu phát hiện bất kỳ vi phạm bảo mật nào

Bạn phải đủ 16 tuổi trở lên để đăng ký tài khoản. Nếu dưới 18 tuổi, bạn cần có sự đồng ý của phụ huynh hoặc người giám hộ hợp pháp.`
    },
    {
      title: '4. Quyền và Nghĩa vụ của Người dùng',
      content: `Bạn có quyền:
- Truy cập và sử dụng các khóa học đã đăng ký
- Tương tác với giảng viên và học viên khác thông qua các tính năng được cung cấp
- Tải xuống tài liệu học tập cho mục đích cá nhân (nếu được phép)
- Nhận chứng chỉ sau khi hoàn thành khóa học

Bạn cam kết:
- Không chia sẻ tài khoản hoặc thông tin đăng nhập với người khác
- Không sao chép, phân phối lại hoặc bán nội dung khóa học
- Không sử dụng nền tảng cho mục đích phi pháp hoặc gây hại
- Tôn trọng quyền sở hữu trí tuệ của giảng viên và LearnHub
- Tuân thủ mọi quy định pháp luật hiện hành`
    },
    {
      title: '5. Thanh toán và Hoàn tiền',
      content: `Chính sách thanh toán:
- Giá khóa học có thể thay đổi mà không cần thông báo trước
- Thanh toán được xử lý an toàn thông qua các cổng thanh toán được chứng nhận
- Sau khi thanh toán thành công, bạn sẽ nhận được xác nhận qua email
- Tất cả các khoản thanh toán bằng VNĐ trừ khi có quy định khác

Chính sách hoàn tiền:
- Bạn có thể yêu cầu hoàn tiền trong vòng 30 ngày kể từ ngày mua
- Điều kiện: Bạn chưa hoàn thành quá 30% khóa học
- Tiền sẽ được hoàn lại trong vòng 7-10 ngày làm việc
- Một số khóa học đặc biệt có thể có chính sách hoàn tiền khác`
    },
    {
      title: '6. Sở hữu Trí tuệ',
      content: `Tất cả nội dung trên nền tảng, bao gồm nhưng không giới hạn:
- Video bài giảng
- Tài liệu học tập
- Mã nguồn mẫu
- Bài tập và quiz
- Thiết kế giao diện

Đều là tài sản của LearnHub hoặc giảng viên tương ứng và được bảo vệ bởi luật bản quyền và sở hữu trí tuệ. Bạn chỉ được sử dụng nội dung này cho mục đích học tập cá nhân.`
    },
    {
      title: '7. Giới hạn Trách nhiệm',
      content: `LearnHub không chịu trách nhiệm cho:
- Tính chính xác, đầy đủ hoặc cập nhật của nội dung khóa học
- Kết quả học tập hoặc việc làm sau khi hoàn thành khóa học
- Sự gián đoạn hoặc lỗi kỹ thuật của nền tảng
- Thiệt hại phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ
- Mất mát dữ liệu hoặc thông tin

Trách nhiệm tối đa của chúng tôi được giới hạn ở số tiền bạn đã thanh toán cho khóa học cụ thể.`
    },
    {
      title: '8. Chấm dứt Tài khoản',
      content: `Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu:
- Vi phạm bất kỳ điều khoản nào trong tài liệu này
- Có hành vi gian lận hoặc lạm dụng dịch vụ
- Không thanh toán các khoản phí đúng hạn
- Có hành vi gây hại đến người dùng khác hoặc nền tảng

Bạn có thể tự xóa tài khoản bất cứ lúc nào thông qua cài đặt tài khoản. Lưu ý rằng sau khi xóa tài khoản, bạn sẽ mất quyền truy cập vào tất cả các khóa học đã mua.`
    },
    {
      title: '9. Thay đổi Điều khoản',
      content: `Chúng tôi có quyền sửa đổi các điều khoản này bất cứ lúc nào. Các thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trên nền tảng ít nhất 7 ngày trước khi có hiệu lực. Việc tiếp tục sử dụng dịch vụ sau khi các thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các điều khoản mới.`
    },
    {
      title: '10. Luật áp dụng',
      content: `Các điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam. Mọi tranh chấp phát sinh từ hoặc liên quan đến các điều khoản này sẽ được giải quyết tại Tòa án có thẩm quyền ở Thành phố Hồ Chí Minh, Việt Nam.`
    },
    {
      title: '11. Liên hệ',
      content: `Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ:
- Email: legal@learnhub.vn
- Điện thoại: (+84) 123 456 789
- Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM, Việt Nam`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="w-16 h-16 mx-auto mb-4" />
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Điều khoản Sử dụng
            </h1>
            <p className="text-xl text-blue-100">
              Cập nhật lần cuối: 06 Tháng 1, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 border-l-4 border-yellow-400 rounded-r-lg bg-yellow-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="mb-2 font-bold text-yellow-900">
                    Vui lòng đọc kỹ
                  </h3>
                  <p className="text-sm leading-relaxed text-yellow-800">
                    Đây là một tài liệu pháp lý quan trọng. Bằng việc sử dụng dịch vụ của LearnHub, 
                    bạn đồng ý tuân thủ tất cả các điều khoản được nêu dưới đây. Nếu bạn không đồng ý, 
                    vui lòng không sử dụng dịch vụ của chúng tôi.
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
              <div className="prose prose-lg max-w-none">
                {sections.map((section, index) => (
                  <div key={index} className="mb-8 last:mb-0">
                    <h2 className="flex items-start gap-3 mb-4 text-2xl font-bold text-gray-900">
                      <CheckCircle2 className="flex-shrink-0 w-6 h-6 mt-1 text-blue-600" />
                      {section.title}
                    </h2>
                    <div className="leading-relaxed text-gray-600 whitespace-pre-line pl-9">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-8 mt-12 border-t border-gray-200">
                <p className="text-sm text-center text-gray-600">
                  Bằng việc tiếp tục sử dụng LearnHub, bạn xác nhận rằng đã đọc, hiểu và đồng ý với 
                  các điều khoản sử dụng này.
                </p>
              </div>
            </div>

            {/* Related Links */}
            <div className="grid gap-6 mt-8 md:grid-cols-2">
              <a
                href="/privacy"
                className="p-6 transition-all bg-white border-2 border-gray-200 shadow-sm rounded-xl hover:border-blue-500 hover:shadow-lg"
              >
                <h3 className="flex items-center gap-2 mb-2 font-bold text-gray-900">
                  Chính sách Bảo mật
                  <span className="text-blue-600">→</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Tìm hiểu cách chúng tôi thu thập và bảo vệ thông tin của bạn
                </p>
              </a>

              <a
                href="/contact"
                className="p-6 transition-all bg-white border-2 border-gray-200 shadow-sm rounded-xl hover:border-blue-500 hover:shadow-lg"
              >
                <h3 className="flex items-center gap-2 mb-2 font-bold text-gray-900">
                  Liên hệ Hỗ trợ
                  <span className="text-blue-600">→</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Có câu hỏi? Đội ngũ của chúng tôi sẵn sàng giúp đỡ bạn
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}