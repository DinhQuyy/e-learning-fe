'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star,
  Users,
  Clock,
  Globe,
  Award,
  PlayCircle,
  Download,
  CheckCircle2,
  ChevronDown,
  Share2,
  Heart,
  ShoppingCart
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock data (giữ nguyên từ code gốc)
const webDevelopmentCourse = {
  id: 1,
  title: 'Complete Web Development Bootcamp 2024',
  subtitle: 'Trở thành Full-Stack Developer chuyên nghiệp với HTML, CSS, JavaScript, React, Node.js',
  instructor: {
    name: 'Nguyễn Văn A',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3B82F6&color=fff',
    title: 'Senior Full-Stack Developer',
    students: 45000,
    courses: 12,
    rating: 4.8,
  },
  thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  rating: 4.8,
  reviewCount: 1547,
  students: 12547,
  price: 1500000,
  originalPrice: 2500000,
  category: 'Web Development',
  level: 'Beginner',
  duration: '45 giờ',
  lessons: 250,
  language: 'Tiếng Việt',
  lastUpdated: 'Tháng 1, 2024',
  bestseller: true,
  
  description: `Khóa học Web Development toàn diện nhất dành cho người mới bắt đầu. Bạn sẽ học từ HTML/CSS cơ bản đến xây dựng ứng dụng Full-Stack hoàn chỉnh với React và Node.js.`,
  
  whatYouLearn: [
    'HTML5 và CSS3 từ cơ bản đến nâng cao',
    'JavaScript ES6+ và lập trình hướng đối tượng',
    'React.js và React Hooks',
    'Node.js và Express.js',
    'MongoDB và Mongoose',
    'RESTful API Design',
    'Authentication và Authorization',
    'Deploy ứng dụng lên Production',
    'Git và GitHub',
    'Responsive Design và Mobile-First',
    'Best practices và Clean Code',
    'Real-world projects và Portfolio',
  ],
  
  requirements: [
    'Máy tính có kết nối Internet',
    'Không cần kiến thức lập trình trước đó',
    'Đam mê học hỏi và sẵn sàng thử thách',
  ],
  
  curriculum: [
    {
      title: 'Giới thiệu và Setup',
      lessons: 8,
      duration: '45 phút',
      items: [
        { title: 'Chào mừng đến khóa học', duration: '5:30', free: true },
        { title: 'Cài đặt môi trường', duration: '10:00', free: true },
        { title: 'Tổng quan về Web Development', duration: '15:00', free: false },
        { title: 'Cấu trúc khóa học', duration: '8:30', free: false },
      ],
    },
    {
      title: 'HTML Fundamentals',
      lessons: 25,
      duration: '3 giờ',
      items: [
        { title: 'HTML là gì?', duration: '12:00', free: false },
        { title: 'Cấu trúc cơ bản HTML', duration: '15:00', free: false },
        { title: 'HTML Tags và Elements', duration: '20:00', free: false },
        { title: 'Forms và Input', duration: '18:00', free: false },
      ],
    },
    {
      title: 'CSS Styling',
      lessons: 30,
      duration: '4 giờ',
      items: [
        { title: 'CSS Selectors', duration: '15:00', free: false },
        { title: 'Box Model', duration: '20:00', free: false },
        { title: 'Flexbox', duration: '25:00', free: false },
        { title: 'CSS Grid', duration: '22:00', free: false },
      ],
    },
  ],
  
  reviews: [
    {
      id: 1,
      user: 'Trần Văn B',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Van+B',
      rating: 5,
      date: '2 tuần trước',
      comment: 'Khóa học rất chi tiết và dễ hiểu. Giảng viên giải thích rất rõ ràng. Recommend!',
    },
    {
      id: 2,
      user: 'Lê Thị C',
      avatar: 'https://ui-avatars.com/api/?name=Le+Thi+C',
      rating: 5,
      date: '1 tháng trước',
      comment: 'Tốt nhất! Từ không biết gì đến giờ đã làm được website hoàn chỉnh.',
    },
    {
      id: 3,
      user: 'Phạm Văn D',
      avatar: 'https://ui-avatars.com/api/?name=Pham+Van+D',
      rating: 4,
      date: '3 tuần trước',
      comment: 'Nội dung tốt, giảng dạy dễ hiểu. Tuy nhiên phần backend hơi nhanh.',
    },
  ],
};

type CourseData = typeof webDevelopmentCourse;

const createCourseVariant = (
  base: CourseData,
  overrides: Partial<CourseData>
): CourseData => ({
  ...base,
  ...overrides,
  instructor: {
    ...base.instructor,
    ...(overrides.instructor ?? {}),
  },
});

const dataScienceCourse: CourseData = {
  id: 2,
  title: 'Data Science & Machine Learning Masterclass',
  subtitle: 'Build predictive models with Python, pandas, and scikit-learn.',
  instructor: {
    name: 'Linh Tran',
    avatar: 'https://ui-avatars.com/api/?name=Linh+Tran&background=10B981&color=fff',
    title: 'Senior Data Scientist',
    students: 38000,
    courses: 8,
    rating: 4.9,
  },
  thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  rating: 4.9,
  reviewCount: 1320,
  students: 8934,
  price: 2000000,
  originalPrice: 2800000,
  category: 'Data Science',
  level: 'Intermediate',
  duration: '60 hours',
  lessons: 180,
  language: 'English',
  lastUpdated: 'Jan 2024',
  bestseller: true,

  description: `Master the full data science workflow from data cleaning to model
deployment. Build real projects with scikit-learn, evaluate models, and
communicate insights with clear visuals.`,

  whatYouLearn: [
    'Python for data analysis and visualization',
    'Clean and transform data with pandas',
    'Build regression and classification models',
    'Evaluate models with cross-validation',
    'Feature engineering and selection',
    'Unsupervised learning with clustering',
    'Create ML pipelines and deploy models',
    'Capstone project with real datasets',
  ],

  requirements: [
    'Basic Python knowledge',
    'Laptop with internet access',
    'High school math or statistics',
  ],

  curriculum: [
    {
      title: 'Foundations and Tools',
      lessons: 12,
      duration: '4 hours',
      items: [
        { title: 'Environment setup', duration: '12:00', free: true },
        { title: 'Jupyter and notebooks', duration: '14:00', free: true },
        { title: 'NumPy basics', duration: '20:00', free: false },
        { title: 'Pandas essentials', duration: '25:00', free: false },
      ],
    },
    {
      title: 'Machine Learning Core',
      lessons: 24,
      duration: '10 hours',
      items: [
        { title: 'Supervised learning overview', duration: '18:00', free: false },
        { title: 'Regression models', duration: '22:00', free: false },
        { title: 'Classification models', duration: '24:00', free: false },
        { title: 'Model evaluation', duration: '20:00', free: false },
      ],
    },
    {
      title: 'Advanced Topics',
      lessons: 18,
      duration: '8 hours',
      items: [
        { title: 'Feature engineering', duration: '18:00', free: false },
        { title: 'Clustering and PCA', duration: '20:00', free: false },
        { title: 'Time series basics', duration: '22:00', free: false },
        { title: 'Deploying models', duration: '19:00', free: false },
      ],
    },
  ],

  reviews: [
    {
      id: 1,
      user: 'Mai Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Mai+Nguyen',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Clear explanations and practical projects.',
    },
    {
      id: 2,
      user: 'Tuan Pham',
      avatar: 'https://ui-avatars.com/api/?name=Tuan+Pham',
      rating: 5,
      date: '1 month ago',
      comment: 'Great structure and strong focus on model evaluation.',
    },
    {
      id: 3,
      user: 'Hanh Le',
      avatar: 'https://ui-avatars.com/api/?name=Hanh+Le',
      rating: 4,
      date: '3 weeks ago',
      comment: 'Loved the capstone project and the deployment section.',
    },
  ],
};

const designCourse: CourseData = {
  id: 3,
  title: 'UI/UX Design: From Zero to Hero',
  subtitle: 'Design user-centered interfaces with Figma and proven UX methods.',
  instructor: {
    name: 'An Pham',
    avatar: 'https://ui-avatars.com/api/?name=An+Pham&background=6366F1&color=fff',
    title: 'Lead Product Designer',
    students: 22000,
    courses: 6,
    rating: 4.7,
  },
  thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  rating: 4.7,
  reviewCount: 980,
  students: 6789,
  price: 1200000,
  originalPrice: 1900000,
  category: 'Design',
  level: 'Beginner',
  duration: '32 hours',
  lessons: 120,
  language: 'English',
  lastUpdated: 'Feb 2024',
  bestseller: false,

  description: `Learn the complete UI/UX process from research to interactive
prototypes. Build a portfolio-ready case study and master a clean design
handoff for development teams.`,

  whatYouLearn: [
    'User research and personas',
    'Information architecture and user flows',
    'Wireframes and interactive prototypes',
    'Visual hierarchy and typography',
    'Color, spacing, and layout systems',
    'Design systems and components',
    'Handoff and collaboration with developers',
  ],

  requirements: [
    'No prior design experience required',
    'Figma account (free)',
    'Curiosity and willingness to practice',
  ],

  curriculum: [
    {
      title: 'Design Foundations',
      lessons: 10,
      duration: '3 hours',
      items: [
        { title: 'Design principles', duration: '12:00', free: true },
        { title: 'Typography basics', duration: '15:00', free: true },
        { title: 'Color theory', duration: '18:00', free: false },
        { title: 'Layout and grids', duration: '20:00', free: false },
      ],
    },
    {
      title: 'UX Process',
      lessons: 16,
      duration: '6 hours',
      items: [
        { title: 'User research', duration: '18:00', free: false },
        { title: 'Personas and journeys', duration: '20:00', free: false },
        { title: 'Wireframes', duration: '22:00', free: false },
        { title: 'Usability testing', duration: '16:00', free: false },
      ],
    },
    {
      title: 'UI Systems',
      lessons: 14,
      duration: '5 hours',
      items: [
        { title: 'Design systems', duration: '18:00', free: false },
        { title: 'Components and variants', duration: '20:00', free: false },
        { title: 'Responsive layouts', duration: '22:00', free: false },
        { title: 'Developer handoff', duration: '15:00', free: false },
      ],
    },
  ],

  reviews: [
    {
      id: 1,
      user: 'Hoa Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Hoa+Nguyen',
      rating: 5,
      date: '1 week ago',
      comment: 'Loved the practical Figma exercises.',
    },
    {
      id: 2,
      user: 'Minh Tran',
      avatar: 'https://ui-avatars.com/api/?name=Minh+Tran',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Great pacing and clear explanations.',
    },
    {
      id: 3,
      user: 'Quang Le',
      avatar: 'https://ui-avatars.com/api/?name=Quang+Le',
      rating: 5,
      date: '1 month ago',
      comment: 'Helped me build a solid design portfolio.',
    },
  ],
};

const mobileDevelopmentCourse: CourseData = {
  id: 4,
  title: 'Mobile App Development with React Native',
  subtitle: 'Build cross-platform apps for iOS and Android.',
  instructor: {
    name: 'Duc Hoang',
    avatar: 'https://ui-avatars.com/api/?name=Duc+Hoang&background=0EA5E9&color=fff',
    title: 'Senior Mobile Engineer',
    students: 16000,
    courses: 5,
    rating: 4.8,
  },
  thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200',
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  rating: 4.8,
  reviewCount: 860,
  students: 5432,
  price: 1800000,
  originalPrice: 2600000,
  category: 'Mobile Development',
  level: 'Advanced',
  duration: '50 hours',
  lessons: 160,
  language: 'English',
  lastUpdated: 'Jan 2024',
  bestseller: true,

  description: `Build production-ready mobile apps with React Native. Learn
navigation, state management, APIs, and performance optimization across iOS
and Android.`,

  whatYouLearn: [
    'React Native fundamentals and tooling',
    'Navigation patterns and routing',
    'State management with Context and Redux',
    'API integration and offline data',
    'Animations and gesture handling',
    'Authentication and secure storage',
    'Testing and debugging mobile apps',
    'Publishing to App Store and Play Store',
  ],

  requirements: [
    'Comfortable with JavaScript',
    'Node.js installed',
    'Android Studio or Xcode',
  ],

  curriculum: [
    {
      title: 'Setup and React Native Basics',
      lessons: 12,
      duration: '4 hours',
      items: [
        { title: 'Environment setup', duration: '14:00', free: true },
        { title: 'Components and props', duration: '18:00', free: false },
        { title: 'Styling and layout', duration: '20:00', free: false },
        { title: 'Debugging tools', duration: '16:00', free: false },
      ],
    },
    {
      title: 'Building Real Screens',
      lessons: 18,
      duration: '7 hours',
      items: [
        { title: 'Navigation', duration: '22:00', free: false },
        { title: 'Forms and validation', duration: '20:00', free: false },
        { title: 'API data', duration: '24:00', free: false },
        { title: 'Offline caching', duration: '18:00', free: false },
      ],
    },
    {
      title: 'Production Ready Apps',
      lessons: 16,
      duration: '6 hours',
      items: [
        { title: 'Auth flows', duration: '18:00', free: false },
        { title: 'Push notifications', duration: '20:00', free: false },
        { title: 'Performance tuning', duration: '22:00', free: false },
        { title: 'App deployment', duration: '19:00', free: false },
      ],
    },
  ],

  reviews: [
    {
      id: 1,
      user: 'Bao Le',
      avatar: 'https://ui-avatars.com/api/?name=Bao+Le',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Best React Native course I have taken.',
    },
    {
      id: 2,
      user: 'My Tran',
      avatar: 'https://ui-avatars.com/api/?name=My+Tran',
      rating: 4,
      date: '3 weeks ago',
      comment: 'Great coverage of navigation and app release.',
    },
    {
      id: 3,
      user: 'Tri Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Tri+Nguyen',
      rating: 5,
      date: '1 month ago',
      comment: 'Solid projects and clear explanations.',
    },
  ],
};

const businessCourse: CourseData = {
  id: 5,
  title: 'Business Strategy & Leadership Essentials',
  subtitle: 'Build strategy, lead teams, and make data-driven decisions.',
  instructor: {
    name: 'Trang Vo',
    avatar: 'https://ui-avatars.com/api/?name=Trang+Vo&background=F59E0B&color=fff',
    title: 'Business Strategy Lead',
    students: 14500,
    courses: 7,
    rating: 4.7,
  },
  thumbnail: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=1200',
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  rating: 4.7,
  reviewCount: 980,
  students: 7200,
  price: 1700000,
  originalPrice: 2400000,
  category: 'Business',
  level: 'Intermediate',
  duration: '40 hours',
  lessons: 140,
  language: 'English',
  lastUpdated: 'Mar 2024',
  bestseller: true,

  description: `Develop strategic thinking and leadership skills to run a modern
business. Learn frameworks for market analysis, operations, and team execution
through real case studies.`,

  whatYouLearn: [
    'Strategy frameworks and competitive analysis',
    'Business model design',
    'Financial metrics and unit economics',
    'Operations and process optimization',
    'Leadership and team management',
    'Go-to-market planning',
    'Decision making with data',
    'Case study execution',
  ],

  requirements: [
    'Basic understanding of business',
    'Notebook or laptop',
    'Motivation to lead',
  ],

  curriculum: [
    {
      title: 'Strategy Foundations',
      lessons: 12,
      duration: '4 hours',
      items: [
        { title: 'Vision and mission', duration: '14:00', free: true },
        { title: 'Market analysis', duration: '18:00', free: false },
        { title: 'SWOT and positioning', duration: '20:00', free: false },
        { title: 'Strategic planning', duration: '22:00', free: false },
      ],
    },
    {
      title: 'Operations and Finance',
      lessons: 14,
      duration: '5 hours',
      items: [
        { title: 'Unit economics', duration: '20:00', free: false },
        { title: 'Pricing strategy', duration: '18:00', free: false },
        { title: 'Process design', duration: '19:00', free: false },
        { title: 'KPIs and dashboards', duration: '16:00', free: false },
      ],
    },
    {
      title: 'Leadership and Growth',
      lessons: 16,
      duration: '6 hours',
      items: [
        { title: 'Hiring and culture', duration: '18:00', free: false },
        { title: 'Project execution', duration: '20:00', free: false },
        { title: 'Growth experiments', duration: '22:00', free: false },
        { title: 'Risk management', duration: '17:00', free: false },
      ],
    },
  ],

  reviews: [
    {
      id: 1,
      user: 'Nam Le',
      avatar: 'https://ui-avatars.com/api/?name=Nam+Le',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Practical strategy tools that I can use at work.',
    },
    {
      id: 2,
      user: 'Thao Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Thao+Nguyen',
      rating: 4,
      date: '1 month ago',
      comment: 'Strong leadership section with real examples.',
    },
    {
      id: 3,
      user: 'Huy Tran',
      avatar: 'https://ui-avatars.com/api/?name=Huy+Tran',
      rating: 5,
      date: '2 months ago',
      comment: 'Clear framework for planning and execution.',
    },
  ],
};

const marketingCourse: CourseData = {
  id: 6,
  title: 'Digital Marketing Growth Blueprint',
  subtitle: 'Master SEO, content, social, and paid acquisition to scale growth.',
  instructor: {
    name: 'Lan Pham',
    avatar: 'https://ui-avatars.com/api/?name=Lan+Pham&background=EC4899&color=fff',
    title: 'Growth Marketing Manager',
    students: 17500,
    courses: 6,
    rating: 4.8,
  },
  thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200',
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  rating: 4.8,
  reviewCount: 1100,
  students: 7600,
  price: 1300000,
  originalPrice: 2100000,
  category: 'Marketing',
  level: 'Beginner',
  duration: '28 hours',
  lessons: 95,
  language: 'English',
  lastUpdated: 'Apr 2024',
  bestseller: false,

  description: `Build a full-funnel marketing system with SEO, content, social,
and paid channels. Create campaigns, measure performance, and optimize for
growth.`,

  whatYouLearn: [
    'SEO fundamentals and keyword research',
    'Content strategy and copywriting',
    'Social media growth systems',
    'Paid ads on Meta and Google',
    'Email marketing and automation',
    'Analytics and attribution',
    'Landing page optimization',
    'Growth experiments and reporting',
  ],

  requirements: [
    'No marketing experience required',
    'Laptop with internet access',
    'Willingness to test and iterate',
  ],

  curriculum: [
    {
      title: 'Marketing Foundations',
      lessons: 10,
      duration: '3 hours',
      items: [
        { title: 'Positioning and messaging', duration: '15:00', free: true },
        { title: 'Audience research', duration: '18:00', free: false },
        { title: 'Brand voice', duration: '16:00', free: false },
        { title: 'Channel selection', duration: '19:00', free: false },
      ],
    },
    {
      title: 'Acquisition Channels',
      lessons: 18,
      duration: '7 hours',
      items: [
        { title: 'SEO and content', duration: '20:00', free: false },
        { title: 'Social media', duration: '18:00', free: false },
        { title: 'Paid ads', duration: '22:00', free: false },
        { title: 'Influencer partnerships', duration: '17:00', free: false },
      ],
    },
    {
      title: 'Measurement and Optimization',
      lessons: 14,
      duration: '5 hours',
      items: [
        { title: 'Analytics setup', duration: '18:00', free: false },
        { title: 'Conversion tracking', duration: '20:00', free: false },
        { title: 'A/B testing', duration: '22:00', free: false },
        { title: 'Reporting', duration: '15:00', free: false },
      ],
    },
  ],

  reviews: [
    {
      id: 1,
      user: 'Khanh Do',
      avatar: 'https://ui-avatars.com/api/?name=Khanh+Do',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Great overview of SEO and paid ads.',
    },
    {
      id: 2,
      user: 'Vy Le',
      avatar: 'https://ui-avatars.com/api/?name=Vy+Le',
      rating: 4,
      date: '3 weeks ago',
      comment: 'Solid structure and easy to follow.',
    },
    {
      id: 3,
      user: 'Tung Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Tung+Nguyen',
      rating: 5,
      date: '1 month ago',
      comment: 'The reporting section was very practical.',
    },
  ],
};

const photographyCourse: CourseData = {
  id: 7,
  title: 'Photography Masterclass: Light, Composition, Story',
  subtitle: 'Capture stunning images and edit like a pro.',
  instructor: {
    name: 'Ha Vu',
    avatar: 'https://ui-avatars.com/api/?name=Ha+Vu&background=22C55E&color=fff',
    title: 'Professional Photographer',
    students: 12000,
    courses: 4,
    rating: 4.6,
  },
  thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  rating: 4.6,
  reviewCount: 740,
  students: 5200,
  price: 1100000,
  originalPrice: 1800000,
  category: 'Photography',
  level: 'Beginner',
  duration: '25 hours',
  lessons: 80,
  language: 'English',
  lastUpdated: 'Feb 2024',
  bestseller: false,

  description: `Capture compelling photos with any camera. Learn light,
composition, storytelling, and editing workflows for portraits, landscapes,
and product shots.`,

  whatYouLearn: [
    'Camera settings and exposure triangle',
    'Lighting for portraits and products',
    'Composition and storytelling',
    'Working with natural light',
    'Editing workflow in Lightroom',
    'Color grading and presets',
    'Building a photo portfolio',
  ],

  requirements: [
    'Any camera or smartphone',
    'Basic computer skills',
    'Interest in visual storytelling',
  ],

  curriculum: [
    {
      title: 'Camera Fundamentals',
      lessons: 8,
      duration: '3 hours',
      items: [
        { title: 'Exposure triangle', duration: '12:00', free: true },
        { title: 'Focus and sharpness', duration: '14:00', free: false },
        { title: 'Lenses and focal length', duration: '16:00', free: false },
        { title: 'Shooting modes', duration: '15:00', free: false },
      ],
    },
    {
      title: 'Light and Composition',
      lessons: 12,
      duration: '4 hours',
      items: [
        { title: 'Natural light', duration: '18:00', free: false },
        { title: 'Studio lighting basics', duration: '20:00', free: false },
        { title: 'Composition rules', duration: '22:00', free: false },
        { title: 'Storytelling', duration: '16:00', free: false },
      ],
    },
    {
      title: 'Editing and Delivery',
      lessons: 10,
      duration: '3 hours',
      items: [
        { title: 'Lightroom basics', duration: '18:00', free: false },
        { title: 'Color correction', duration: '20:00', free: false },
        { title: 'Exporting', duration: '15:00', free: false },
        { title: 'Portfolio review', duration: '14:00', free: false },
      ],
    },
  ],

  reviews: [
    {
      id: 1,
      user: 'Nhi Nguyen',
      avatar: 'https://ui-avatars.com/api/?name=Nhi+Nguyen',
      rating: 5,
      date: '1 week ago',
      comment: 'Loved the lighting and composition tips.',
    },
    {
      id: 2,
      user: 'Bao Tran',
      avatar: 'https://ui-avatars.com/api/?name=Bao+Tran',
      rating: 4,
      date: '3 weeks ago',
      comment: 'Great intro to Lightroom and editing.',
    },
    {
      id: 3,
      user: 'Thanh Le',
      avatar: 'https://ui-avatars.com/api/?name=Thanh+Le',
      rating: 4,
      date: '1 month ago',
      comment: 'Solid course for beginners.',
    },
  ],
};

const webDevelopmentCourseAdvanced = createCourseVariant(webDevelopmentCourse, {
  id: 8,
  title: 'Modern Frontend Engineering with React',
  subtitle: 'Build scalable UI systems with React, hooks, and TypeScript.',
  instructor: {
    name: 'Mai Pham',
    avatar: 'https://ui-avatars.com/api/?name=Mai+Pham&background=2563EB&color=fff',
    title: 'Frontend Engineering Lead',
    students: 18000,
    courses: 7,
    rating: 4.7,
  },
  thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
  rating: 4.7,
  reviewCount: 980,
  students: 8420,
  price: 1700000,
  originalPrice: 2400000,
  category: 'Web Development',
  level: 'Intermediate',
  duration: '38 hours',
  lessons: 180,
  language: 'English',
  lastUpdated: 'Mar 2024',
  bestseller: false,
});

const appliedMachineLearningCourse = createCourseVariant(dataScienceCourse, {
  id: 9,
  title: 'Applied Machine Learning for Business',
  subtitle: 'Use ML models to solve real business problems and drive decisions.',
  instructor: {
    name: 'Bao Nguyen',
    avatar: 'https://ui-avatars.com/api/?name=Bao+Nguyen&background=059669&color=fff',
    title: 'Machine Learning Engineer',
    students: 21000,
    courses: 6,
    rating: 4.8,
  },
  thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
  rating: 4.8,
  reviewCount: 910,
  students: 6100,
  price: 2200000,
  originalPrice: 3000000,
  category: 'Data Science',
  level: 'Advanced',
  duration: '48 hours',
  lessons: 150,
  language: 'English',
  lastUpdated: 'Feb 2024',
  bestseller: true,
});

const productDesignCourse = createCourseVariant(designCourse, {
  id: 10,
  title: 'Product Design for SaaS Teams',
  subtitle: 'Design scalable product systems and ship better experiences.',
  instructor: {
    name: 'Hana Le',
    avatar: 'https://ui-avatars.com/api/?name=Hana+Le&background=7C3AED&color=fff',
    title: 'Senior Product Designer',
    students: 14000,
    courses: 5,
    rating: 4.6,
  },
  thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
  rating: 4.6,
  reviewCount: 720,
  students: 5120,
  price: 1400000,
  originalPrice: 2000000,
  category: 'Design',
  level: 'Intermediate',
  duration: '28 hours',
  lessons: 96,
  language: 'English',
  lastUpdated: 'Mar 2024',
  bestseller: false,
});

const entrepreneurshipCourse = createCourseVariant(businessCourse, {
  id: 11,
  title: 'Entrepreneurship & Startup Operations',
  subtitle: 'Launch, validate, and grow a startup with proven frameworks.',
  instructor: {
    name: 'Khanh Do',
    avatar: 'https://ui-avatars.com/api/?name=Khanh+Do&background=F97316&color=fff',
    title: 'Startup Operator',
    students: 11000,
    courses: 4,
    rating: 4.6,
  },
  thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
  rating: 4.6,
  reviewCount: 640,
  students: 4300,
  price: 1600000,
  originalPrice: 2200000,
  category: 'Business',
  level: 'Beginner',
  duration: '30 hours',
  lessons: 110,
  language: 'English',
  lastUpdated: 'Feb 2024',
  bestseller: false,
});

const performanceMarketingCourse = createCourseVariant(marketingCourse, {
  id: 12,
  title: 'Performance Marketing Playbook',
  subtitle: 'Launch and scale high-performing paid campaigns.',
  instructor: {
    name: 'Tung Nguyen',
    avatar: 'https://ui-avatars.com/api/?name=Tung+Nguyen&background=DB2777&color=fff',
    title: 'Performance Marketing Lead',
    students: 15000,
    courses: 5,
    rating: 4.7,
  },
  thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200',
  rating: 4.7,
  reviewCount: 810,
  students: 5850,
  price: 1500000,
  originalPrice: 2300000,
  category: 'Marketing',
  level: 'Intermediate',
  duration: '34 hours',
  lessons: 120,
  language: 'English',
  lastUpdated: 'Mar 2024',
  bestseller: true,
});

const portraitPhotographyCourse = createCourseVariant(photographyCourse, {
  id: 13,
  title: 'Portrait Photography Essentials',
  subtitle: 'Capture flattering portraits with light and posing techniques.',
  instructor: {
    name: 'Nhi Nguyen',
    avatar: 'https://ui-avatars.com/api/?name=Nhi+Nguyen&background=16A34A&color=fff',
    title: 'Portrait Photographer',
    students: 9000,
    courses: 3,
    rating: 4.5,
  },
  thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
  rating: 4.5,
  reviewCount: 520,
  students: 4100,
  price: 1000000,
  originalPrice: 1700000,
  category: 'Photography',
  level: 'Beginner',
  duration: '20 hours',
  lessons: 72,
  language: 'English',
  lastUpdated: 'Mar 2024',
  bestseller: false,
});

const courseDataByKey: Record<string, CourseData> = {
  '1': webDevelopmentCourse,
  'web-development': webDevelopmentCourse,
  '2': dataScienceCourse,
  'data-science': dataScienceCourse,
  '3': designCourse,
  'design': designCourse,
  '4': mobileDevelopmentCourse,
  'mobile-development': mobileDevelopmentCourse,
  '5': businessCourse,
  'business': businessCourse,
  '6': marketingCourse,
  'marketing': marketingCourse,
  '7': photographyCourse,
  'photography': photographyCourse,
  '8': webDevelopmentCourseAdvanced,
  '9': appliedMachineLearningCourse,
  '10': productDesignCourse,
  '11': entrepreneurshipCourse,
  '12': performanceMarketingCourse,
  '13': portraitPhotographyCourse,
};

const normalizeCourseKey = (value: string) =>
  value.trim().toLowerCase().replace(/[\s_]+/g, '-');

const resolveCourseData = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) {
    return courseDataByKey['web-development'];
  }
  const normalized = normalizeCourseKey(raw);
  return courseDataByKey[normalized] ?? courseDataByKey['web-development'];
};

const categoryRedirects: Record<string, string> = {
  'web-development': 'Web Development',
  'data-science': 'Data Science',
  'design': 'Design',
  'business': 'Business',
  'marketing': 'Marketing',
  'photography': 'Photography',
};

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const categoryRedirect = rawId
    ? categoryRedirects[normalizeCourseKey(rawId)]
    : undefined;

  useEffect(() => {
    if (!categoryRedirect) return;
    router.replace(`/courses?category=${encodeURIComponent(categoryRedirect)}`);
  }, [categoryRedirect, router]);

  if (categoryRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-sm text-gray-500">Loading courses...</div>
      </div>
    );
  }

  const courseData = resolveCourseData(rawId);
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [isLiked, setIsLiked] = useState(false);

  const discount = Math.round(
    ((courseData.originalPrice - courseData.price) / courseData.originalPrice) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-white bg-gray-900">
        <div className="container px-4 py-12 mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Content */}
            <div className="space-y-6 lg:col-span-2 animate-fade-in-up">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/" className="transition-colors hover:text-white">Home</Link>
                <span>/</span>
                <Link href="/courses" className="transition-colors hover:text-white">Courses</Link>
                <span>/</span>
                <span className="text-white">{courseData.category}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                {courseData.bestseller && (
                  <span className="px-3 py-1 text-sm font-bold text-yellow-900 bg-yellow-400 rounded-full animate-pulse-subtle">
                    Bestseller
                  </span>
                )}
                <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">
                  {courseData.category}
                </span>
                <span className="px-3 py-1 text-sm text-white bg-gray-700 rounded-full">
                  {courseData.level}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                {courseData.title}
              </h1>

              <p className="text-xl text-gray-300">
                {courseData.subtitle}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 group">
                  <Star className="w-5 h-5 text-yellow-400 transition-transform fill-yellow-400 group-hover:scale-125" />
                  <span className="font-bold">{courseData.rating}</span>
                  <span className="text-gray-400">
                    ({courseData.reviewCount.toLocaleString()} đánh giá)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 group">
                  <Users className="w-5 h-5 transition-transform group-hover:scale-125" />
                  <span>{courseData.students.toLocaleString()} học viên</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 group">
                  <Clock className="w-5 h-5 transition-transform group-hover:scale-125" />
                  <span>{courseData.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 group">
                  <Globe className="w-5 h-5 transition-transform group-hover:scale-125" />
                  <span>{courseData.language}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 group">
                <img
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  className="w-12 h-12 transition-transform rounded-full group-hover:scale-110 group-hover:rotate-6"
                />
                <div>
                  <div className="text-sm text-gray-400">Giảng viên</div>
                  <div className="font-semibold transition-colors group-hover:text-blue-400">{courseData.instructor.name}</div>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                Cập nhật lần cuối: {courseData.lastUpdated}
              </div>
            </div>

            {/* Right Card - Desktop */}
            <div className="hidden lg:block">
              <div className="sticky overflow-hidden bg-white shadow-2xl rounded-xl top-8 animate-fade-in-right">
                {/* Preview */}
                <div className="relative aspect-video group">
                  <img
                    src={courseData.thumbnail}
                    alt={courseData.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <button className="absolute inset-0 flex items-center justify-center transition-colors bg-black/50 hover:bg-black/40 group">
                    <div className="flex items-center justify-center w-16 h-16 transition-all bg-white rounded-full group-hover:scale-125 group-hover:rotate-12">
                      <PlayCircle className="w-8 h-8 text-blue-600" />
                    </div>
                  </button>
                </div>

                {/* Price & CTA */}
                <div className="p-6 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <div className="text-3xl font-bold text-gray-900">
                      ₫{courseData.price.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-400 line-through">
                      ₫{courseData.originalPrice.toLocaleString()}
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {discount}% OFF
                    </div>
                  </div>

                  <button className="w-full py-4 text-lg font-bold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105 active:scale-95">
                    Đăng ký học ngay
                  </button>

                  <button className="w-full py-3 font-semibold text-gray-700 transition-all border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 hover:scale-105 active:scale-95">
                    Thêm vào giỏ hàng
                  </button>

                  <div className="text-sm text-center text-gray-600">
                    30 ngày đảm bảo hoàn tiền
                  </div>

                  <div className="pt-4 space-y-3 text-sm border-t">
                    <div className="font-semibold">Khóa học bao gồm:</div>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-2 group">
                        <Clock className="w-4 h-4 transition-all group-hover:text-blue-600 group-hover:scale-125" />
                        {courseData.duration} video
                      </div>
                      <div className="flex items-center gap-2 group">
                        <Download className="w-4 h-4 transition-all group-hover:text-blue-600 group-hover:scale-125" />
                        Tài liệu tải xuống
                      </div>
                      <div className="flex items-center gap-2 group">
                        <Award className="w-4 h-4 transition-all group-hover:text-blue-600 group-hover:scale-125" />
                        Chứng chỉ hoàn thành
                      </div>
                      <div className="flex items-center gap-2 group">
                        <Globe className="w-4 h-4 transition-all group-hover:text-blue-600 group-hover:scale-125" />
                        Truy cập trọn đời
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setIsLiked(!isLiked)}
                      className={`flex-1 py-2 transition-all border border-gray-300 rounded-lg hover:bg-gray-50 hover:scale-105 ${
                        isLiked ? 'bg-red-50 border-red-300' : ''
                      }`}
                    >
                      <Heart className={`w-5 h-5 mx-auto transition-all ${isLiked ? 'fill-red-500 text-red-500 scale-125' : ''}`} />
                    </button>
                    <button className="flex-1 py-2 transition-all border border-gray-300 rounded-lg hover:bg-gray-50 hover:scale-105">
                      <Share2 className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg lg:hidden animate-slide-up">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              ₫{courseData.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400 line-through">
              ₫{courseData.originalPrice.toLocaleString()}
            </div>
          </div>
          <button className="flex-1 py-3 font-bold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl active:scale-95">
            Đăng ký ngay
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-12 mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-12 lg:col-span-2">
            {/* What You'll Learn */}
            <section className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl animate-fade-in-up">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Bạn sẽ học được gì
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {courseData.whatYouLearn.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Course Content */}
            <section className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Nội dung khóa học
              </h2>
              <div className="mb-4 text-sm text-gray-600">
                {courseData.curriculum.length} phần • {courseData.lessons} bài học •{' '}
                {courseData.duration}
              </div>
              <div className="space-y-2">
                {courseData.curriculum.map((section, index) => (
                  <div key={index} className="overflow-hidden transition-all border rounded-lg hover:border-blue-500">
                    <button
                      onClick={() =>
                        setExpandedSection(expandedSection === index ? null : index)
                      }
                      className="flex items-center justify-between w-full px-6 py-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            expandedSection === index ? 'rotate-180' : ''
                          }`}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {section.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {section.lessons} bài học • {section.duration}
                          </div>
                        </div>
                      </div>
                    </button>

                    {expandedSection === index && (
                      <div className="px-6 pb-4 space-y-2 animate-slide-down">
                        {section.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between px-4 py-2 transition-colors rounded hover:bg-gray-50 group"
                          >
                            <div className="flex items-center gap-3">
                              <PlayCircle className="w-4 h-4 text-gray-400 transition-all group-hover:text-blue-600 group-hover:scale-125" />
                              <span className="text-sm text-gray-700 transition-colors group-hover:text-blue-600">
                                {item.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {item.free && (
                                <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
                                  Xem trước
                                </span>
                              )}
                              <span className="text-sm text-gray-500">
                                {item.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Requirements */}
            <section className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Yêu cầu
              </h2>
              <ul className="space-y-3">
                {courseData.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-2 h-2 mt-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Description */}
            <section className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Mô tả
              </h2>
              <div className="prose text-gray-700 whitespace-pre-line max-w-none">
                {courseData.description}
              </div>
            </section>

            {/* Instructor */}
            <section className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Giảng viên
              </h2>
              <div className="flex items-start gap-6 group">
                <img
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  className="w-24 h-24 transition-transform rounded-full group-hover:scale-110 group-hover:rotate-6"
                />
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold">{courseData.instructor.name}</h3>
                  <p className="text-gray-600">{courseData.instructor.title}</p>
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{courseData.instructor.rating} rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{courseData.instructor.students.toLocaleString()} học viên</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      <span>{courseData.instructor.courses} khóa học</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Đánh giá từ học viên
              </h2>
              <div className="space-y-6">
                {courseData.reviews.map((review, index) => (
                  <div 
                    key={review.id} 
                    className="pb-6 border-b last:border-0 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{review.user}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Desktop only, sticky */}
          <div className="hidden lg:block">
            {/* Space for sticky card */}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
