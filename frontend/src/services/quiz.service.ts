import { ApiResponse, CreateQuizFormData, QuizDetailDto, QuizSummaryDto } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    const msg = !json.success ? json.error : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return (json as { success: true; data: T }).data;
}

export const quizService = {
  getAll(): Promise<QuizSummaryDto[]> {
    return request<QuizSummaryDto[]>('/quizzes');
  },

  getById(id: string): Promise<QuizDetailDto> {
    return request<QuizDetailDto>(`/quizzes/${id}`);
  },

  create(data: CreateQuizFormData): Promise<QuizDetailDto> {
    return request<QuizDetailDto>('/quizzes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<void> {
    return request<void>(`/quizzes/${id}`, { method: 'DELETE' });
  },
};
