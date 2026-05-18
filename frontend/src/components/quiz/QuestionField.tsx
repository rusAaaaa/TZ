import { useEffect } from 'react';
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { CreateQuizSchema } from '@/lib/validation';
import { QuestionType } from '@/types';
import { QuestionTypeBadge } from '@/components/ui';

interface QuestionFieldProps {
  index: number;
  onRemove: () => void;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'BOOLEAN', label: 'True / False' },
  { value: 'INPUT', label: 'Short Answer' },
  { value: 'CHECKBOX', label: 'Multiple Choice' },
];

export default function QuestionField({ index, onRemove }: QuestionFieldProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateQuizSchema>();

  const type = watch(`questions.${index}.type`);

  const {
    fields: options,
    append,
    remove,
    replace,
  } = useFieldArray({
    control,
    name: `questions.${index}.options`,
  });

  // When type changes, reset options to sensible defaults
  useEffect(() => {
    if (type === 'BOOLEAN') {
      replace([
        { label: 'True', isCorrect: false, order: 0 },
        { label: 'False', isCorrect: false, order: 1 },
      ]);
    } else if (type === 'INPUT') {
      replace([{ label: '', isCorrect: true, order: 0 }]);
    } else if (type === 'CHECKBOX') {
      replace([
        { label: '', isCorrect: false, order: 0 },
        { label: '', isCorrect: false, order: 1 },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const questionError = errors.questions?.[index];

  return (
    <div className="card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
          {index + 1}
        </span>

        {/* Type selector */}
        <Controller
          control={control}
          name={`questions.${index}.type`}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {QUESTION_TYPES.map((qt) => (
                <button
                  key={qt.value}
                  type="button"
                  onClick={() => field.onChange(qt.value)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                    field.value === qt.value
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {qt.label}
                </button>
              ))}
            </div>
          )}
        />

        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove question"
          className="ml-auto flex-shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Question text */}
      <div>
        <label className="label" htmlFor={`question-${index}-text`}>
          Question
        </label>
        <textarea
          id={`question-${index}-text`}
          rows={2}
          className="input-field resize-none"
          placeholder="Enter your question..."
          {...register(`questions.${index}.text`)}
        />
        {questionError?.text && <p className="error-text">{questionError.text.message}</p>}
      </div>

      {/* Options */}
      <div className="space-y-2">
        {type === 'BOOLEAN' && (
          <div className="space-y-2">
            <p className="label">Correct Answer</p>
            {options.map((opt, oi) => (
              <label
                key={opt.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-2.5 transition-colors hover:bg-slate-50"
              >
                <Controller
                  control={control}
                  name={`questions.${index}.options.${oi}.isCorrect`}
                  render={({ field }) => (
                    <input
                      type="radio"
                      className="h-4 w-4 text-brand-600"
                      checked={field.value}
                      onChange={() => {
                        // Only one can be correct
                        options.forEach((_, i) =>
                          setValue(`questions.${index}.options.${i}.isCorrect`, i === oi),
                        );
                      }}
                    />
                  )}
                />
                <span className="text-sm font-medium text-slate-700">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {type === 'INPUT' && (
          <div>
            <label className="label">
              Expected Answer <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              className="input-field"
              placeholder="e.g. Canberra"
              {...register(`questions.${index}.options.0.label`)}
            />
          </div>
        )}

        {type === 'CHECKBOX' && (
          <div className="space-y-2">
            <p className="label">
              Options <span className="text-slate-400 font-normal">(check the correct ones)</span>
            </p>
            {options.map((opt, oi) => (
              <div key={opt.id} className="flex items-center gap-2">
                <Controller
                  control={control}
                  name={`questions.${index}.options.${oi}.isCorrect`}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-brand-600"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
                <input
                  className="input-field"
                  placeholder={`Option ${oi + 1}`}
                  {...register(`questions.${index}.options.${oi}.label`)}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => remove(oi)}
                    aria-label="Remove option"
                    className="flex-shrink-0 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ label: '', isCorrect: false, order: options.length })}
              className="mt-1 flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add option
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <QuestionTypeBadge type={type} />
      </div>
    </div>
  );
}
