import { z } from 'zod';

const QUESTION_TYPES = ['BOOLEAN', 'INPUT', 'CHECKBOX'] as const;

const optionSchema = z.object({
  label: z.string().min(1, 'Option label is required').max(500),
  isCorrect: z.boolean().optional().default(false),
  order: z.number().int().min(0),
});

const questionSchema = z
  .object({
    text: z.string().min(1, 'Question text is required').max(1000),
    type: z.enum(QUESTION_TYPES),
    order: z.number().int().min(0),
    options: z.array(optionSchema).optional().default([]),
  })
  .refine(
    (q) => {
      const opts = q.options ?? [];
      if (q.type === 'BOOLEAN') return opts.length === 2;
      if (q.type === 'CHECKBOX') return opts.length >= 2;
      // INPUT: 0 or 1 options (correct answer hint)
      return true;
    },
    {
      message: 'BOOLEAN questions require exactly 2 options; CHECKBOX requires at least 2 options.',
    },
  );

export const createQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required').max(255),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
