// ─── Shared enums ─────────────────────────────────────────────────────────────

export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

// ─── Request DTOs ────────────────────────────────────────────────────────────

export interface CreateOptionDto {
  label: string;
  isCorrect?: boolean;
  order: number;
}

export interface CreateQuestionDto {
  text: string;
  type: QuestionType;
  order: number;
  options?: CreateOptionDto[];
}

export interface CreateQuizDto {
  title: string;
  questions: CreateQuestionDto[];
}

// ─── Response shapes ─────────────────────────────────────────────────────────

export interface QuizSummary {
  id: string;
  title: string;
  questionCount: number;
  createdAt: Date;
}

export interface OptionResponse {
  id: string;
  label: string;
  isCorrect: boolean;
  order: number;
}

export interface QuestionResponse {
  id: string;
  text: string;
  type: string;
  order: number;
  options: OptionResponse[];
}

export interface QuizDetailResponse {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  questions: QuestionResponse[];
}

// ─── API envelope ────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
