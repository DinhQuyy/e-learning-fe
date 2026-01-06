import {
  Target,
  Users,
  Award,
  TrendingUp,
  Heart,
  Zap,
  Shield,
  Globe,
  CheckCircle2,
  Quote
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users, value: '50,000+', label: 'Học viên', color: 'blue' },
    { icon: Award, value: '1,200+', label: 'Khóa học', color: 'purple' },
    { icon: Target, value: '500+', label: 'Giảng viên', color: 'green' },
    { icon: TrendingUp, value: '95%', label: 'Hài lòng', color: 'orange' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Đam mê giáo dục',
      description: 'Chúng tôi tin rằng giáo dục là chìa khóa để thay đổi cuộc sống và xã hội.',
      color: 'red',
    },
    {
      icon: Zap,
      title: 'Đổi mới không ngừng',
      description: 'Luôn cập nhật công nghệ và phương pháp giảng dạy hiện đại nhất.',
      color: 'yellow',
    },
    {
      icon: Shield,
      title: 'Chất lượng cam kết',
      description: 'Mọi khóa học đều được kiểm duyệt kỹ lưỡng đảm bảo chất lượng cao nhất.',
      color: 'blue',
    },
    {
      icon: Globe,
      title: 'Cộng đồng toàn cầu',
      description: 'Kết nối học viên và giảng viên từ khắp nơi trên thế giới.',
      color: 'green',
    },
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3B82F6&color=fff&size=200',
    },
    {
      name: 'Trần Thị B',
      role: 'CTO',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=8B5CF6&color=fff&size=200',
    },
    {
      name: 'Lê Minh C',
      role: 'Head of Education',
      avatar: 'https://ui-avatars.com/api/?name=Le+Minh+C&background=10B981&color=fff&size=200',
    },
    {
      name: 'Phạm Hoàng D',
      role: 'Head of Design',
      avatar: 'https://ui-avatars.com/api/?name=Pham+Hoang+D&background=F59E0B&color=fff&size=200',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
              ✨ Về chúng tôi
            </div>
            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
              Sứ mệnh của{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                LearnHub
              </span>
            </h1>
            <p className="text-xl leading-relaxed text-gray-600">
              Chúng tôi tin rằng giáo dục chất lượng cao nên dành cho tất cả mọi người. 
              LearnHub được tạo ra với mục tiêu dân chủ hóa giáo dục, giúp mọi người 
              có cơ hội học tập và phát triển kỹ năng cho tương lai.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colors = {
                blue: 'bg-blue-100 text-blue-600',
                purple: 'bg-purple-100 text-purple-600',
                green: 'bg-green-100 text-green-600',
                orange: 'bg-orange-100 text-orange-600',
              };

              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${colors[stat.color as keyof typeof colors]}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="mb-2 text-4xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="grid items-center gap-12 mb-16 md:grid-cols-2">
              <div>
                <h2 className="mb-6 text-4xl font-bold text-gray-900">
                  Câu chuyện của chúng tôi
                </h2>
                <div className="space-y-4 leading-relaxed text-gray-600">
                  <p>
                    LearnHub được thành lập vào năm 2025 với một tầm nhìn đơn giản nhưng mạnh mẽ: 
                    làm cho giáo dục chất lượng cao trở nên dễ tiếp cận với tất cả mọi người.
                  </p>
                  <p>
                    Chúng tôi bắt đầu với một nhóm nhỏ các giáo viên đam mê và một ý tưởng lớn. 
                    Ngày nay, chúng tôi tự hào phục vụ hơn 50,000 học viên trên toàn quốc với 
                    hơn 1,200 khóa học trong nhiều lĩnh vực khác nhau.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                  alt="Team"
                  className="shadow-xl rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Giá trị cốt lõi
              </h2>
              <p className="text-xl text-gray-600">
                Những giá trị định hướng mọi hoạt động của chúng tôi
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => {
                const Icon = value.icon;
                const colors = {
                  red: 'bg-red-100 text-red-600',
                  yellow: 'bg-yellow-100 text-yellow-600',
                  blue: 'bg-blue-100 text-blue-600',
                  green: 'bg-green-100 text-green-600',
                };

                return (
                  <div key={index} className="p-6 text-center transition-shadow rounded-xl hover:shadow-lg">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${colors[value.color as keyof typeof colors]}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Đội ngũ lãnh đạo
              </h2>
              <p className="text-xl text-gray-600">
                Những người đứng sau thành công của LearnHub
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <div key={index} className="p-6 text-center transition-all bg-white rounded-xl hover:shadow-xl">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-full"
                  />
                  <h3 className="mb-1 text-xl font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="font-semibold text-blue-600">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6 text-4xl font-bold">
              Tham gia cùng chúng tôi
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Bắt đầu hành trình học tập của bạn ngay hôm nay
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/courses"
                className="px-8 py-4 font-semibold text-blue-600 transition-all bg-white rounded-lg hover:shadow-xl"
              >
                Khám phá khóa học
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