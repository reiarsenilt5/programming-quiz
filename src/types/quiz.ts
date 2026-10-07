export type CategoryId =
  | 'python'
  | 'php'
  | 'javascript'
  | 'typescript'
  | 'react'
  | 'sql'
  | 'solid'
  | 'modern_fundamentals'
  | 'ai_assistance'
  | 'senior_fullstack'
  | 'devops_cloud';

export type DifficultyLevel = 'Junior' | 'Mid' | 'Senior';

export type QuestionType = 'multiple_choice' | 'find_the_bug' | 'true_false';

export type GameMode = 'practice' | 'time_trial' | 'daily_challenge';

export interface Question {
  id: string;
  categoryId: CategoryId;
  categoryName: string;
  difficulty: DifficultyLevel;
  type: QuestionType;
  title: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  proTip?: string;
}

export interface QuizUserAnswer {
  questionId: string;
  question: Question;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface UserStats {
  totalQuizzesPlayed: number;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
  currentStreakDays: number;
  lastPlayedDate: string;
  categoryAccuracy: Record<CategoryId, { total: number; correct: number }>;
}

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  description: string;
  tag: string;
}
