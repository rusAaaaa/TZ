import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Layout from '@/components/Layout';
import QuestionField from '@/components/quiz/QuestionField';
import { Alert, Button, PageHeader } from '@/components/ui';
import { createQuizSchema, CreateQuizSchema } from '@/lib/validation';
import { quizService } from '@/services/quiz.service';

const DEFAULT_QUESTION: CreateQuizSchema['questions'][number] = {
  text: '',
  type: 'BOOLEAN',
  order: 0,
  options: [
    { label: 'True', isCorrect: false, order: 0 },
    { label: 'False', isCorrect: false, order: 1 },
  ],
};

export default function CreateQuizPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<CreateQuizSchema>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      title: '',
      questions: [{ ...DEFAULT_QUESTION }],
    },
    mode: 'onBlur',
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: 'questions' });

  const addQuestion = () => {
    append({ ...DEFAULT_QUESTION, order: fields.length });
  };

  const onSubmit = async (data: CreateQuizSchema) => {
    setSubmitError(null);
    // Assign final order values
    const payload = {
      ...data,
      questions: data.questions.map((q, qi) => ({
        ...q,
        order: qi,
        options: (q.options ?? []).map((o, oi) => ({ ...o, order: oi })),
      })),
    };
    try {
      const created = await quizService.create(payload);
      router.push(`/quizzes/${created.id}`);
    } catch (e: unknown) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  };

  return (
    <Layout title="Create Quiz">
      <PageHeader
        title="Create a New Quiz"
        subtitle="Add a title and as many questions as you need."
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* Quiz title */}
          <div className="card p-5">
            <label className="label" htmlFor="quiz-title">
              Quiz Title <span className="text-red-500">*</span>
            </label>
            <input
              id="quiz-title"
              className="input-field"
              placeholder="e.g. JavaScript Basics"
              {...register('title')}
            />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Questions ({fields.length})
            </h2>

            {fields.map((field, index) => (
              <QuestionField
                key={field.id}
                index={index}
                onRemove={() => {
                  if (fields.length > 1) remove(index);
                }}
              />
            ))}

            {errors.questions?.root && (
              <p className="error-text">{errors.questions.root.message}</p>
            )}
          </div>

          {/* Add question button */}
          <button
            type="button"
            onClick={addQuestion}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-4 text-sm font-medium text-slate-500 transition-colors hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>

          {/* Submit error */}
          {submitError && <Alert type="error" message={submitError} />}

          {/* Submit */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
            <Button variant="secondary" type="button" onClick={() => router.push('/quizzes')}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save Quiz'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Layout>
  );
}
