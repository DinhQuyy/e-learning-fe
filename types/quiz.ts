// types/quiz.ts

export type QuestionType = 
  | 'multiple_choice'    // Trắc nghiệm 1 đáp án
  | 'multiple_answer'    // Nhiều đáp án đúng
  | 'true_false'         // Đúng/Sai
  | 'fill_blank'         // Điền vào chỗ trống
  | 'matching';          // Nối đáp án

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  description?: string;
  points: number;
  difficulty: DifficultyLevel;
  
  // For multiple choice/answer
  answers?: QuizAnswer[];
  
  // For true/false
  correctAnswer?: boolean;
  
  // For fill in the blank
  correctText?: string;
  caseSensitive?: boolean;
  
  // For matching
  pairs?: MatchingPair[];
  
  // Explanation shown after answer
  explanation?: string;
  
  // Media
  imageUrl?: string;
  videoUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  lessonId?: string;
  lessonName?: string;
  
  instructorId: string;
  instructorName: string;
  
  questions: QuizQuestion[];
  
  // Settings
  timeLimit?: number; // minutes
  passingScore: number; // percentage
  maxAttempts?: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  
  // Metadata
  totalPoints: number;
  estimatedTime: number; // minutes
  difficulty: DifficultyLevel;
  
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  
  answers: StudentAnswer[];
  
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  
  timeSpent: number; // seconds
  startedAt: string;
  completedAt?: string;
  
  attemptNumber: number;
}

export interface StudentAnswer {
  questionId: string;
  
  // For multiple choice
  selectedAnswerId?: string;
  
  // For multiple answer
  selectedAnswerIds?: string[];
  
  // For true/false
  selectedBoolean?: boolean;
  
  // For fill blank
  textAnswer?: string;
  
  // For matching
  matchedPairs?: { leftId: string; rightId: string }[];
  
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number; // seconds
}

export interface QuizStats {
  quizId: string;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  averageTime: number;
  
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  
  questionStats: QuestionStat[];
}

export interface QuestionStat {
  questionId: string;
  question: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  
  totalAttempts: number;
  correctAttempts: number;
  correctRate: number;
  averageTimeSpent: number;
  
  // For multiple choice - which answers were selected
  answerDistribution?: { answerId: string; count: number }[];
}