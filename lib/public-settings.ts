export type PublicStat = {
  label: string;
  value: string;
};

export type PublicFeature = {
  title: string;
  description: string;
};

export type PublicSettings = {
  siteName: string;
  siteDescription: string;
  maintenance: boolean;
  announcementEnabled: boolean;
  announcementText: string;
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImageUrl: string;
  searchPlaceholder: string;
  searchButtonLabel: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  showStats: boolean;
  stats: PublicStat[];
  showCategories: boolean;
  categoriesTitle: string;
  categoriesSubtitle: string;
  showFeaturedCourses: boolean;
  featuredTitle: string;
  featuredSubtitle: string;
  featuredCtaLabel: string;
  featuredCtaHref: string;
  showFeatures: boolean;
  featuresTitle: string;
  featuresSubtitle: string;
  features: PublicFeature[];
  showCta: boolean;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
};

export const defaultPublicSettings: PublicSettings = {
  siteName: 'LearnHub',
  siteDescription: 'Nền tảng học trực tuyến với hơn 1.200 khóa học chất lượng cao.',
  maintenance: false,
  announcementEnabled: false,
  announcementText: 'Chúng tôi đang cập nhật. Một số tính năng có thể không khả dụng.',
  heroBadge: 'Hơn 50.000 học viên tin tưởng',
  heroTitle: 'Học thông minh hơn,',
  heroHighlight: 'tiến bộ mỗi ngày',
  heroSubtitle:
    'Nền tảng học trực tuyến hàng đầu với hơn 1.200 khóa học, giảng viên chuyên gia và chứng chỉ uy tín.',
  heroImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  searchPlaceholder: 'Tìm khóa học...',
  searchButtonLabel: 'Tìm kiếm',
  heroPrimaryCtaLabel: 'Duyệt khóa học',
  heroPrimaryCtaHref: '/courses',
  heroSecondaryCtaLabel: 'Tìm hiểu thêm',
  heroSecondaryCtaHref: '/about',
  showStats: true,
  stats: [
    { label: 'Học viên', value: '50,000+' },
    { label: 'Khóa học', value: '1,200+' },
    { label: 'Giảng viên', value: '500+' },
    { label: 'Chứng chỉ', value: '30,000+' },
  ],
  showCategories: true,
  categoriesTitle: 'Duyệt theo danh mục',
  categoriesSubtitle: 'Khám phá hơn 1.200 khóa học thuộc nhiều lĩnh vực',
  showFeaturedCourses: true,
  featuredTitle: 'Khóa học nổi bật',
  featuredSubtitle: 'Được học viên yêu thích nhất',
  featuredCtaLabel: 'Xem tất cả',
  featuredCtaHref: '/courses',
  showFeatures: true,
  featuresTitle: 'Vì sao chọn LearnHub?',
  featuresSubtitle: 'Trải nghiệm học hiện đại với nhiều tính năng mạnh mẽ',
  features: [
    {
      title: 'Video chất lượng cao',
      description: 'Học từ các bài giảng Full HD với âm thanh rõ ràng.',
    },
    {
      title: 'Lộ trình học cá nhân',
      description: 'Học có hướng dẫn từ cơ bản đến nâng cao.',
    },
    {
      title: 'Học mọi nơi',
      description: 'Truy cập trên mọi thiết bị và học theo tốc độ của bạn.',
    },
    {
      title: 'Chứng chỉ uy tín',
      description: 'Nhận chứng chỉ được nhà tuyển dụng công nhận.',
    },
  ],
  showCta: true,
  ctaTitle: 'Sẵn sàng bắt đầu hành trình học tập của bạn?',
  ctaSubtitle: 'Tham gia cùng hơn 50.000 học viên học tập và phát triển mỗi ngày.',
  ctaButtonLabel: 'Bắt đầu miễn phí',
  ctaButtonHref: '/register',
};

const normalizeStats = (stats: PublicStat[] | undefined) =>
  defaultPublicSettings.stats.map((stat, index) => ({
    ...stat,
    ...(stats?.[index] ?? {}),
  }));

const normalizeFeatures = (features: PublicFeature[] | undefined) =>
  defaultPublicSettings.features.map((feature, index) => ({
    ...feature,
    ...(features?.[index] ?? {}),
  }));

export const normalizePublicSettings = (
  settings: Partial<PublicSettings> | null | undefined
): PublicSettings => {
  const merged = { ...defaultPublicSettings, ...(settings ?? {}) };
  return {
    ...merged,
    stats: normalizeStats(settings?.stats),
    features: normalizeFeatures(settings?.features),
  };
};
