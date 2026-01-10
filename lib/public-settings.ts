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
  siteDescription: 'Online learning platform with 1,200+ high-quality courses.',
  maintenance: false,
  announcementEnabled: false,
  announcementText: 'We are working on updates. Some features may be unavailable.',
  heroBadge: 'Over 50,000 students trust us',
  heroTitle: 'Learn smarter,',
  heroHighlight: 'grow every day',
  heroSubtitle:
    'Top online learning platform with 1,200+ courses, expert instructors, and trusted certificates.',
  heroImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
  searchPlaceholder: 'Search for a course...',
  searchButtonLabel: 'Search',
  heroPrimaryCtaLabel: 'Browse courses',
  heroPrimaryCtaHref: '/courses',
  heroSecondaryCtaLabel: 'Learn more',
  heroSecondaryCtaHref: '/about',
  showStats: true,
  stats: [
    { label: 'Students', value: '50,000+' },
    { label: 'Courses', value: '1,200+' },
    { label: 'Instructors', value: '500+' },
    { label: 'Certificates', value: '30,000+' },
  ],
  showCategories: true,
  categoriesTitle: 'Browse by category',
  categoriesSubtitle: 'Explore 1,200+ courses across many fields',
  showFeaturedCourses: true,
  featuredTitle: 'Featured courses',
  featuredSubtitle: 'Most loved by students',
  featuredCtaLabel: 'View all',
  featuredCtaHref: '/courses',
  showFeatures: true,
  featuresTitle: 'Why choose LearnHub?',
  featuresSubtitle: 'Modern learning experience with powerful features',
  features: [
    {
      title: 'High quality video',
      description: 'Learn from Full HD lessons with clear audio.',
    },
    {
      title: 'Personal learning path',
      description: 'Guided learning from basics to advanced.',
    },
    {
      title: 'Learn anywhere',
      description: 'Access on any device and study at your own pace.',
    },
    {
      title: 'Trusted certificates',
      description: 'Earn certificates recognized by employers.',
    },
  ],
  showCta: true,
  ctaTitle: 'Ready to start your learning journey?',
  ctaSubtitle: 'Join 50,000+ students learning and growing every day.',
  ctaButtonLabel: 'Get started for free',
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
