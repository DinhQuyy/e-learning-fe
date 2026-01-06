import { Briefcase, MapPin, Clock, DollarSign, Users, Heart, Zap, Coffee, Award, TrendingUp, Laptop, Home } from 'lucide-react';

export default function CareersPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Lương thưởng hấp dẫn',
      description: 'Mức lương cạnh tranh + bonus theo hiệu suất'
    },
    {
      icon: Heart,
      title: 'Bảo hiểm toàn diện',
      description: 'Bảo hiểm sức khỏe, xã hội đầy đủ'
    },
    {
      icon: Home,
      title: 'Làm việc linh hoạt',
      description: 'Hybrid/Remote work theo nhu cầu'
    },
    {
      icon: TrendingUp,
      title: 'Phát triển sự nghiệp',
      description: 'Đào tạo và thăng tiến rõ ràng'
    },
    {
      icon: Coffee,
      title: 'Văn hóa năng động',
      description: 'Môi trường trẻ trung, sáng tạo'
    },
    {
      icon: Award,
      title: 'Học tập miễn phí',
      description: 'Truy cập toàn bộ khóa học trên nền tảng'
    },
    {
      icon: Users,
      title: 'Team building',
      description: 'Hoạt động gắn kết định kỳ'
    },
    {
      icon: Laptop,
      title: 'Trang thiết bị hiện đại',
      description: 'Laptop, màn hình, phụ kiện đầy đủ'
    }
  ];

  const openings = [
    {
      id: 1,
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'TP.HCM / Remote',
      type: 'Full-time',
      salary: '30-45M VNĐ',
      requirements: ['React, Node.js 3+ years', 'Database design', 'System architecture'],
      hot: true
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'TP.HCM',
      type: 'Full-time',
      salary: '18-28M VNĐ',
      requirements: ['Figma expert', 'User research', '2+ years experience'],
      hot: true
    },
    {
      id: 3,
      title: 'Content Marketing Manager',
      department: 'Marketing',
      location: 'TP.HCM / Hybrid',
      type: 'Full-time',
      salary: '20-30M VNĐ',
      requirements: ['Content strategy', 'SEO/SEM', 'Social media'],
      hot: false
    },
    {
      id: 4,
      title: 'Data Analyst',
      department: 'Product',
      location: 'TP.HCM',
      type: 'Full-time',
      salary: '18-25M VNĐ',
      requirements: ['SQL, Python', 'Data visualization', 'Business analytics'],
      hot: false
    },
    {
      id: 5,
      title: 'Customer Success Specialist',
      department: 'Support',
      location: 'TP.HCM',
      type: 'Full-time',
      salary: '12-18M VNĐ',
      requirements: ['Customer service', 'Problem solving', 'English fluent'],
      hot: false
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '25-40M VNĐ',
      requirements: ['AWS/GCP', 'CI/CD', 'Kubernetes'],
      hot: true
    }
  ];

  const values = [
    {
      title: 'Học hỏi không ngừng',
      description: 'Chúng tôi khuyến khích mọi người không ngừng học hỏi và phát triển',
      emoji: '📚'
    },
    {
      title: 'Hợp tác & Chia sẻ',
      description: 'Làm việc nhóm hiệu quả, chia sẻ kiến thức và kinh nghiệm',
      emoji: '🤝'
    },
    {
      title: 'Đổi mới sáng tạo',
      description: 'Luôn tìm kiếm những cách làm mới, tốt hơn',
      emoji: '💡'
    },
    {
      title: 'Chất lượng đầu tiên',
      description: 'Cam kết mang đến sản phẩm và dịch vụ chất lượng cao nhất',
      emoji: '⭐'
    }
  ];

  const process = [
    {
      step: '1',
      title: 'Ứng tuyển',
      description: 'Gửi CV và thư giới thiệu'
    },
    {
      step: '2',
      title: 'Sàng lọc',
      description: 'HR review hồ sơ trong 3-5 ngày'
    },
    {
      step: '3',
      title: 'Phỏng vấn',
      description: '1-2 vòng phỏng vấn với team'
    },
    {
      step: '4',
      title: 'Offer',
      description: 'Nhận offer và onboard'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 mb-6 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full">
              💼 Tham gia cùng chúng tôi
            </div>
            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
              Xây dựng tương lai của{' '}
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                giáo dục
              </span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-gray-600">
              Tham gia đội ngũ đam mê, tài năng đang thay đổi cách mọi người học tập. 
              Cùng nhau xây dựng nền tảng giáo dục hàng đầu Việt Nam.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="#openings"
                className="px-8 py-4 font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-xl"
              >
                Xem vị trí tuyển dụng
              </a>
              <a
                href="#culture"
                className="px-8 py-4 font-semibold text-gray-700 transition-all border-2 border-gray-300 rounded-xl hover:border-blue-600 hover:text-blue-600"
              >
                Tìm hiểu văn hóa
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 bg-purple-300 rounded-full w-96 h-96 blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 bg-blue-300 rounded-full w-96 h-96 blur-3xl opacity-20"></div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y">
        <div className="container px-4 mx-auto">
          <div className="grid max-w-5xl grid-cols-2 gap-8 mx-auto md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-gray-900">100+</div>
              <div className="text-gray-600">Nhân viên</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-gray-900">4.8★</div>
              <div className="text-gray-600">Glassdoor Rating</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-gray-900">95%</div>
              <div className="text-gray-600">Hài lòng</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-gray-900">3+</div>
              <div className="text-gray-600">Văn phòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="culture" className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Quyền lợi tại LearnHub
              </h2>
              <p className="text-xl text-gray-600">
                Chúng tôi quan tâm đến sự phát triển toàn diện của bạn
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="p-6 transition-all bg-white border-2 border-gray-200 shadow-sm rounded-xl hover:border-blue-500 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mb-4 text-blue-600 bg-blue-100 rounded-xl">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="mb-2 font-bold text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Giá trị cốt lõi
              </h2>
              <p className="text-xl text-gray-600">
                Những giá trị định hướng cách chúng tôi làm việc
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 text-5xl">{value.emoji}</div>
                  <h3 className="mb-3 text-lg font-bold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="py-20 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Vị trí đang tuyển
              </h2>
              <p className="text-xl text-gray-600">
                Tìm vị trí phù hợp với bạn
              </p>
            </div>

            <div className="space-y-4">
              {openings.map((job) => (
                <div
                  key={job.id}
                  className="p-6 transition-all bg-white border-2 border-gray-200 shadow-sm rounded-xl hover:border-blue-500 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {job.title}
                        </h3>
                        {job.hot && (
                          <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">
                            🔥 HOT
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium text-blue-700 rounded-full bg-blue-50"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 whitespace-nowrap">
                      Ứng tuyển ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="mb-4 text-gray-600">
                Không tìm thấy vị trí phù hợp?
              </p>
              <a
                href="mailto:careers@learnhub.vn"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-gray-700 transition-all border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600"
              >
                Gửi CV tự do
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Quy trình tuyển dụng
              </h2>
              <p className="text-xl text-gray-600">
                Đơn giản và minh bạch
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-4">
              {process.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-2xl font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.description}
                  </p>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-white bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-4xl font-bold">
              Sẵn sàng tạo nên sự khác biệt?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Tham gia LearnHub và cùng chúng tôi xây dựng tương lai của giáo dục
            </p>
            <a
              href="#openings"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-blue-600 transition-all bg-white rounded-xl hover:shadow-xl"
            >
              Xem vị trí tuyển dụng
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}