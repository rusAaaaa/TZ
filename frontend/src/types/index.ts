// ─── Question types ───────────────────────────────────────────────────────────

export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

// ─── API response shapes ──────────────────────────────────────────────────────

export interface OptionDto {
  id: string;
  label: string;
  isCorrect: boolean;
  order: number;
}

export interface QuestionDto {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
  options: OptionDto[];
}

export interface QuizSummaryDto {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}

export interface QuizDetailDto {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: QuestionDto[];
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;

// ─── Form types ───────────────────────────────────────────────────────────────

export interface OptionFormData {
  label: string;
  isCorrect: boolean;
  order: number;
}

export interface QuestionFormData {
  text: string;
  type: QuestionType;
  order: number;
  options: OptionFormData[];
}

export interface CreateQuizFormData {
  title: string;
  questions: QuestionFormData[];
}
