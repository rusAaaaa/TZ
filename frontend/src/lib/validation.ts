import { z } from 'zod';

const optionSchema = z.object({
  label: z.string().min(1, 'Option label cannot be empty'),
  isCorrect: z.boolean().default(false),
  order: z.number().int().min(0),
});

const questionSchema = z
  .object({
    text: z.string().min(1, 'Question text is required'),
    type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
    order: z.number().int().min(0),
    options: z.array(optionSchema).default([]),
  })
  .refine(
    (q) => {
      if (q.type === 'BOOLEAN') return q.options.length === 2;
      if (q.type === 'CHECKBOX') return q.options.length >= 2;
      return true;
    },
    { message: 'BOOLEAN needs 2 options; CHECKBOX needs at least 2.' },
  );

export const createQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required').max(255),
  questions: z.array(questionSchema).min(1, 'Add at least one question'),
});

export type CreateQuizSchema = z.infer<typeof createQuizSchema>;
