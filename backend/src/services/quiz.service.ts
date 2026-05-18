import { AppError } from '../middleware/errorHandler';
import { CreateQuizInput } from '../validators/quiz.validator';
import { QuizSummary, QuizDetailResponse, OptionResponse, QuestionResponse } from '../types';
import prisma from '../lib/prisma';

// ─── Local result mappers ────────────────────────────────────────────────────

interface RawOption {
  id: string;
  label: string;
  isCorrect: boolean;
  order: number;
}

interface RawQuestion {
  id: string;
  text: string;
  type: string;
  order: number;
  options: RawOption[];
}

interface RawQuiz {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  questions: RawQuestion[];
}

function mapOption(o: RawOption): OptionResponse {
  return { id: o.id, label: o.label, isCorrect: o.isCorrect, order: o.order };
}

function mapQuestion(q: RawQuestion): QuestionResponse {
  return {
    id: q.id,
    text: q.text,
    type: q.type,
    order: q.order,
    options: q.options.map(mapOption),
  };
}

function mapQuiz(quiz: RawQuiz): QuizDetailResponse {
  return {
    id: quiz.id,
    title: quiz.title,
    createdAt: quiz.createdAt,
    updatedAt: quiz.updatedAt,
    questions: quiz.questions.map(mapQuestion),
  };
}

// ─── Service functions ───────────────────────────────────────────────────────

export async function getAllQuizzes(): Promise<QuizSummary[]> {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      _count: { select: { questions: true } },
    },
  });

  type QuizRow = { id: string; title: string; createdAt: Date; _count: { questions: number } };
  return (quizzes as QuizRow[]).map((q) => ({
    id: q.id,
    title: q.title,
    createdAt: q.createdAt,
    questionCount: q._count.questions,
  }));
}

export async function getQuizById(id: string): Promise<QuizDetailResponse> {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: { options: { orderBy: { order: 'asc' } } },
      },
    },
  });

  if (!quiz) {
    throw new AppError(404, `Quiz with id "${id}" not found`);
  }

  return mapQuiz(quiz as RawQuiz);
}

export async function createQuiz(data: CreateQuizInput): Promise<QuizDetailResponse> {
  const quiz = await prisma.quiz.create({
    data: {
      title: data.title,
      questions: {
        create: data.questions.map((q) => ({
          text: q.text,
          type: q.type,
          order: q.order,
          options: {
            create: (q.options ?? []).map((o) => ({
              label: o.label,
              isCorrect: o.isCorrect ?? false,
              order: o.order,
            })),
          },
        })),
      },
    },
    include: {
      questions: {
        orderBy: { order: 'asc' },
        include: { options: { orderBy: { order: 'asc' } } },
      },
    },
  });

  return mapQuiz(quiz as RawQuiz);
}

export async function deleteQuiz(id: string): Promise<void> {
  const existing = await prisma.quiz.findUnique({ where: { id }, select: { id: true } });
  if (!existing) {
    throw new AppError(404, `Quiz with id "${id}" not found`);
  }
  await prisma.$transaction([
    prisma.option.deleteMany({ where: { question: { quizId: id } } }),
    prisma.question.deleteMany({ where: { quizId: id } }),
    prisma.quiz.delete({ where: { id } }),
  ]);
}
