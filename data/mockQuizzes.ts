import { Quiz, QuizAttempt, QuizStats } from '@/types/quiz';

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Kiểm tra JavaScript Cơ bản',
    description: 'Bài kiểm tra về các khái niệm cơ bản trong JavaScript',
    courseId: 'course-1',
    courseName: 'Web Development Fundamentals',
    lessonId: 'lesson-3',
    lessonName: 'JavaScript Basics',
    
    instructorId: 'inst-1',
    instructorName: 'Nguyễn Văn Giảng Viên',
    
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'JavaScript là gì?',
        description: 'Chọn định nghĩa chính xác nhất',
        points: 10,
        difficulty: 'easy',
        answers: [
          { id: 'a1', text: 'Ngôn ngữ lập trình phía client', isCorrect: false },
          { id: 'a2', text: 'Ngôn ngữ lập trình đa nền tảng', isCorrect: true },
          { id: 'a3', text: 'Framework CSS', isCorrect: false },
          { id: 'a4', text: 'Database system', isCorrect: false },
        ],
        explanation: 'JavaScript là ngôn ngữ lập trình đa nền tảng, có thể chạy trên browser, server (Node.js), mobile...',
      },
      {
        id: 'q2',
        type: 'multiple_answer',
        question: 'Những cách nào sau đây để khai báo biến trong JavaScript?',
        points: 15,
        difficulty: 'medium',
        answers: [
          { id: 'a1', text: 'var', isCorrect: true },
          { id: 'a2', text: 'let', isCorrect: true },
          { id: 'a3', text: 'const', isCorrect: true },
          { id: 'a4', text: 'define', isCorrect: false },
          { id: 'a5', text: 'variable', isCorrect: false },
        ],
        explanation: 'Có 3 cách khai báo biến: var (ES5), let và const (ES6+)',
      },
      {
        id: 'q3',
        type: 'true_false',
        question: 'JavaScript và Java là cùng một ngôn ngữ?',
        points: 5,
        difficulty: 'easy',
        correctAnswer: false,
        explanation: 'JavaScript và Java là hai ngôn ngữ hoàn toàn khác nhau về cú pháp và mục đích sử dụng.',
      },
      {
        id: 'q4',
        type: 'fill_blank',
        question: 'Từ khóa nào dùng để tạo hàm trong JavaScript?',
        description: 'Gõ từ khóa (chữ thường)',
        points: 10,
        difficulty: 'easy',
        correctText: 'function',
        caseSensitive: false,
        explanation: 'Từ khóa "function" được sử dụng để định nghĩa hàm trong JavaScript.',
      },
      {
        id: 'q5',
        type: 'matching',
        question: 'Nối các khái niệm với định nghĩa đúng',
        points: 20,
        difficulty: 'hard',
        pairs: [
          { id: 'p1', left: 'Array', right: 'Mảng - danh sách các phần tử' },
          { id: 'p2', left: 'Object', right: 'Đối tượng - tập hợp key-value' },
          { id: 'p3', left: 'Function', right: 'Hàm - khối code có thể tái sử dụng' },
          { id: 'p4', left: 'String', right: 'Chuỗi ký tự' },
        ],
        explanation: 'Hiểu rõ các kiểu dữ liệu cơ bản là nền tảng quan trọng trong JavaScript.',
      },
    ],
    
    timeLimit: 30,
    passingScore: 70,
    maxAttempts: 3,
    shuffleQuestions: true,
    shuffleAnswers: true,
    showCorrectAnswers: true,
    showExplanations: true,
    
    totalPoints: 60,
    estimatedTime: 25,
    difficulty: 'medium',
    
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    isPublished: true,
  },
  {
    id: 'quiz-2',
    title: 'React Hooks & State Management',
    description: 'Bài kiểm tra về React Hooks và quản lý state',
    courseId: 'course-1',
    courseName: 'Web Development Fundamentals',
    lessonId: 'lesson-8',
    lessonName: 'React Advanced',
    
    instructorId: 'inst-1',
    instructorName: 'Nguyễn Văn Giảng Viên',
    
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'Hook nào dùng để quản lý state trong React?',
        points: 10,
        difficulty: 'easy',
        answers: [
          { id: 'a1', text: 'useState', isCorrect: true },
          { id: 'a2', text: 'useClass', isCorrect: false },
          { id: 'a3', text: 'setState', isCorrect: false },
          { id: 'a4', text: 'useData', isCorrect: false },
        ],
        explanation: 'useState là hook cơ bản nhất để quản lý state trong functional components.',
      },
      {
        id: 'q2',
        type: 'multiple_answer',
        question: 'Những hooks nào sau đây là built-in của React?',
        points: 15,
        difficulty: 'medium',
        answers: [
          { id: 'a1', text: 'useEffect', isCorrect: true },
          { id: 'a2', text: 'useContext', isCorrect: true },
          { id: 'a3', text: 'useReducer', isCorrect: true },
          { id: 'a4', text: 'useRouter', isCorrect: false },
          { id: 'a5', text: 'useQuery', isCorrect: false },
        ],
        explanation: 'useEffect, useContext, useReducer là built-in hooks. useRouter (Next.js) và useQuery (React Query) là custom hooks.',
      },
      {
        id: 'q3',
        type: 'true_false',
        question: 'useEffect chạy sau mỗi lần component render?',
        points: 10,
        difficulty: 'medium',
        correctAnswer: true,
        explanation: 'Mặc định useEffect chạy sau mỗi render. Có thể điều khiển bằng dependency array.',
      },
    ],
    
    timeLimit: 20,
    passingScore: 75,
    maxAttempts: 2,
    shuffleQuestions: false,
    shuffleAnswers: true,
    showCorrectAnswers: true,
    showExplanations: true,
    
    totalPoints: 35,
    estimatedTime: 15,
    difficulty: 'medium',
    
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
    isPublished: true,
  },
  {
    id: 'quiz-3',
    title: 'Python Data Structures',
    description: 'Kiểm tra kiến thức về cấu trúc dữ liệu trong Python',
    courseId: 'course-2',
    courseName: 'Python for Beginners',
    lessonId: 'lesson-5',
    lessonName: 'Lists and Dictionaries',
    
    instructorId: 'inst-1',
    instructorName: 'Nguyễn Văn Giảng Viên',
    
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'Cấu trúc dữ liệu nào trong Python là mutable (có thể thay đổi)?',
        points: 10,
        difficulty: 'easy',
        answers: [
          { id: 'a1', text: 'Tuple', isCorrect: false },
          { id: 'a2', text: 'List', isCorrect: true },
          { id: 'a3', text: 'String', isCorrect: false },
          { id: 'a4', text: 'Integer', isCorrect: false },
        ],
        explanation: 'List là mutable, có thể thay đổi phần tử. Tuple, String, Integer là immutable.',
      },
    ],
    
    timeLimit: 15,
    passingScore: 60,
    maxAttempts: undefined,
    shuffleQuestions: true,
    shuffleAnswers: true,
    showCorrectAnswers: false,
    showExplanations: false,
    
    totalPoints: 10,
    estimatedTime: 10,
    difficulty: 'easy',
    
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-14T11:00:00Z',
    isPublished: false,
  },
];

export const mockAttempts: QuizAttempt[] = [
  {
    id: 'attempt-1',
    quizId: 'quiz-1',
    studentId: 'student-1',
    studentName: 'Student User',
    
    answers: [
      {
        questionId: 'q1',
        selectedAnswerId: 'a2',
        isCorrect: true,
        pointsEarned: 10,
        timeSpent: 45,
      },
      {
        questionId: 'q2',
        selectedAnswerIds: ['a1', 'a2', 'a3'],
        isCorrect: true,
        pointsEarned: 15,
        timeSpent: 78,
      },
      {
        questionId: 'q3',
        selectedBoolean: false,
        isCorrect: true,
        pointsEarned: 5,
        timeSpent: 12,
      },
      {
        questionId: 'q4',
        textAnswer: 'function',
        isCorrect: true,
        pointsEarned: 10,
        timeSpent: 23,
      },
      {
        questionId: 'q5',
        matchedPairs: [
          { leftId: 'p1', rightId: 'p1' },
          { leftId: 'p2', rightId: 'p2' },
          { leftId: 'p3', rightId: 'p3' },
          { leftId: 'p4', rightId: 'p4' },
        ],
        isCorrect: true,
        pointsEarned: 20,
        timeSpent: 134,
      },
    ],
    
    score: 60,
    maxScore: 60,
    percentage: 100,
    passed: true,
    
    timeSpent: 292,
    startedAt: '2024-01-16T14:00:00Z',
    completedAt: '2024-01-16T14:04:52Z',
    
    attemptNumber: 1,
  },
];

export const mockQuizStats: QuizStats = {
  quizId: 'quiz-1',
  totalAttempts: 45,
  averageScore: 78.5,
  passRate: 82.2,
  averageTime: 18.5,
  
  difficultyDistribution: {
    easy: 3,
    medium: 1,
    hard: 1,
  },
  
  questionStats: [
    {
      questionId: 'q1',
      question: 'JavaScript là gì?',
      type: 'multiple_choice',
      difficulty: 'easy',
      totalAttempts: 45,
      correctAttempts: 42,
      correctRate: 93.3,
      averageTimeSpent: 38,
      answerDistribution: [
        { answerId: 'a1', count: 2 },
        { answerId: 'a2', count: 42 },
        { answerId: 'a3', count: 1 },
        { answerId: 'a4', count: 0 },
      ],
    },
    {
      questionId: 'q2',
      question: 'Những cách nào sau đây để khai báo biến trong JavaScript?',
      type: 'multiple_answer',
      difficulty: 'medium',
      totalAttempts: 45,
      correctAttempts: 31,
      correctRate: 68.9,
      averageTimeSpent: 65,
    },
    {
      questionId: 'q5',
      question: 'Nối các khái niệm với định nghĩa đúng',
      type: 'matching',
      difficulty: 'hard',
      totalAttempts: 45,
      correctAttempts: 18,
      correctRate: 40.0,
      averageTimeSpent: 156,
    },
  ],
};