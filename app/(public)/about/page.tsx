import Link from 'next/link';
import {
  Award,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

const stats = [
  { label: 'Học viên đang hoạt động', value: '50,000+', icon: Users },
  { label: 'Khóa học chất lượng', value: '1,200+', icon: BookOpen },
  { label: 'Giảng viên đồng hành', value: '500+', icon: GraduationCap },
  { label: 'Chứng nhận đã cấp', value: '30,000+', icon: Award },
];

const values = [
  {
    title: 'Sứ mệnh rõ ràng',
    description:
      'Giúp mọi người học tập hiệu quả với lộ trình cá nhân hóa và nội dung cập nhật.',
    icon: Target,
  },
  {
    title: 'Chất lượng dẫn đầu',
    description:
      'Chọn lọc giảng viên, kiểm duyệt học liệu và đo lường trải nghiệm theo dữ liệu.',
    icon: ShieldCheck,
  },
  {
    title: 'Cộng đồng truyền cảm hứng',
    description:
      'Kết nối học viên - giảng viên - doanh nghiệp để cùng phát triển.',
    icon: HeartHandshake,
  },
  {
    title: 'Đổi mới liên tục',
    description:
      'Ứng dụng công nghệ để việc học trở nên thú vị, linh hoạt và dễ tiếp cận.',
    icon: Sparkles,
  },
];

const milestones = [
  {
    year: '2019',
    title: 'Ý tưởng khởi nguồn',
    description: 'Bắt đầu từ nhu cầu học tập thực chiến của cộng đồng công nghệ.',
  },
  {
    year: '2021',
    title: 'Ra mắt LearnHub',
    description: 'Mở rộng 200+ khóa học với hệ thống đánh giá minh bạch.',
  },
  {
    year: '2023',
    title: 'Vươn tầm khu vực',
    description: 'Đồng hành cùng doanh nghiệp trong đào tạo nội bộ.',
  },
  {
    year: '2024',
    title: 'Hệ sinh thái học tập',
    description: 'Tối ưu trải nghiệm đa nền tảng, hỗ trợ học mọi lúc mọi nơi.',
  },
];

const team = [
  {
    name: 'Nguyễn Minh An',
    role: 'CEO & Co-founder',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Trần Thu Hà',
    role: 'Head of Learning',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Lê Hoàng Nam',
    role: 'Product Lead',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container px-4 py-16 mx-auto md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                <Rocket className="h-4 w-4" />
                Hành trình xây dựng LearnHub
              </span>
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Về chúng tôi
              </h1>
              <p className="text-lg leading-relaxed text-gray-600">
                LearnHub là nền tảng học tập trực tuyến giúp bạn nâng cao kỹ năng
                một cách bài bản và linh hoạt. Chúng tôi kết hợp công nghệ,
                cộng đồng và nội dung chất lượng để tạo ra trải nghiệm học tập
                truyền cảm hứng.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
                >
                  Khám phá khóa học
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
                >
                  Liên hệ hợp tác
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&auto=format&fit=crop&q=80"
                alt="Team collaboration"
                className="relative z-10 w-full rounded-3xl shadow-2xl"
              />
              <div className="absolute -right-6 top-6 h-48 w-48 rounded-full bg-purple-300/30 blur-3xl" />
              <div className="absolute -bottom-6 -left-6 h-48 w-48 rounded-full bg-blue-300/30 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Giá trị cốt lõi của LearnHub
            </h2>
            <p className="text-lg text-gray-600">
              Chúng tôi đặt người học làm trung tâm, theo đuổi chất lượng và
              không ngừng đổi mới để tạo ra trải nghiệm tốt nhất.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Dấu mốc phát triển
            </h2>
            <p className="text-lg text-gray-600">
              Những cột mốc ghi dấu hành trình xây dựng nền tảng học tập đáng tin
              cậy cho cộng đồng.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {milestones.map((milestone) => (
              <div
                key={milestone.year}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <p className="text-sm font-semibold text-blue-600">
                  {milestone.year}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">
                  {milestone.title}
                </h3>
                <p className="mt-2 text-gray-600">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Đội ngũ dẫn dắt
            </h2>
            <p className="text-lg text-gray-600">
              Những người đứng sau LearnHub đều có nhiều năm kinh nghiệm trong
              giáo dục và sản phẩm số.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-56 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-10 text-white md:p-14">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold">
                  Sẵn sàng đồng hành cùng LearnHub?
                </h2>
                <p className="mt-3 text-lg text-blue-100">
                  Tham gia cộng đồng học tập đầy cảm hứng và bứt phá kỹ năng ngay
                  hôm nay.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:shadow-lg"
                >
                  Bắt đầu miễn phí
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/60 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Hợp tác cùng chúng tôi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
