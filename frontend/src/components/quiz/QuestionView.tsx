import { QuestionDto } from '@/types';
import { QuestionTypeBadge } from '@/components/ui';

interface QuestionViewProps {
  question: QuestionDto;
  index: number;
}

export default function QuestionView({ question, index }: QuestionViewProps) {
  return (
    <div className="card p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 leading-snug">{question.text}</p>
        </div>
        <QuestionTypeBadge type={question.type} />
      </div>

      {/* Options */}
      <div className="ml-9 space-y-2">
        {question.type === 'BOOLEAN' && (
          <div className="flex flex-wrap gap-2">
            {question.options.map((opt) => (
              <span
                key={opt.id}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
                  opt.isCorrect
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                {opt.isCorrect && (
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {opt.label}
              </span>
            ))}
          </div>
        )}

        {question.type === 'INPUT' && (
          <div>
            {question.options.length > 0 && question.options[0].label ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Expected:</span>
                <span className="rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-sm font-medium text-green-700">
                  {question.options[0].label}
                </span>
              </div>
            ) : (
              <span className="text-xs italic text-slate-400">Open-ended — any text answer</span>
            )}
          </div>
        )}

        {question.type === 'CHECKBOX' && (
          <div className="space-y-1.5">
            {question.options.map((opt) => (
              <div
                key={opt.id}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm ${
                  opt.isCorrect
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <span
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
                    opt.isCorrect
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {opt.isCorrect && (
                    <svg
                      className="h-2.5 w-2.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
