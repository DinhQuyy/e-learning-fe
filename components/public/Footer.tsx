import Link from 'next/link';
import { GraduationCap, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 mt-20 text-gray-400 bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="grid gap-8 mb-8 md:grid-cols-4">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">LearnHub</span>
            </div>
            <p className="mb-4 text-sm">
              Nền tảng học trực tuyến hàng đầu Việt Nam với hơn 1,200 khóa học chất lượng cao.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-800 rounded-full hover:bg-blue-600"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-800 rounded-full hover:bg-blue-600"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-800 rounded-full hover:bg-blue-600"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-800 rounded-full hover:bg-blue-600"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Về chúng tôi */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-white">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/careers" className="transition-colors hover:text-white">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="transition-colors hover:text-white">
                  Trung tâm hỗ trợ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-white">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-white">
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-white">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Danh mục */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Danh mục</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/courses?category=Web Development"
                  className="transition-colors hover:text-white"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=Data Science"
                  className="transition-colors hover:text-white"
                >
                  Data Science
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=Design"
                  className="transition-colors hover:text-white"
                >
                  Design
                </Link>
              </li>
              <li>
                <Link
                  href="/courses?category=Business"
                  className="transition-colors hover:text-white"
                >
                  Business
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-gray-800 md:flex-row">
          <p className="text-sm text-center md:text-left">
            © 2024 LearnHub. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="transition-colors hover:text-white">
              Điều khoản
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Bảo mật
            </Link>
            <Link href="/sitemap" className="transition-colors hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}