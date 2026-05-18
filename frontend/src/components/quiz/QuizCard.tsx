import Link from 'next/link';
import { useState } from 'react';
import { QuizSummaryDto } from '@/types';
import { quizService } from '@/services/quiz.service';
import { Spinner } from '@/components/ui';

interface QuizCardProps {
  quiz: QuizSummaryDto;
  onDeleted: (id: string) => void;
}

export default function QuizCard({ quiz, onDeleted }: QuizCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await quizService.delete(quiz.id);
      onDeleted(quiz.id);
    } catch {
      alert('Failed to delete quiz. Please try again.');
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const formattedDate = new Date(quiz.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="card group flex items-start gap-4 p-5 transition-shadow hover:shadow-md">
      {/* Icon */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <Link href={`/quizzes/${quiz.id}`} className="block">
          <h2 className="truncate font-semibold text-slate-900 transition-colors hover:text-brand-700">
            {quiz.title}
          </h2>
        </Link>
        <p className="mt-1 text-xs text-slate-500">
          {quiz.questionCount} {quiz.questionCount === 1 ? 'question' : 'questions'} ·{' '}
          {formattedDate}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <Link
          href={`/quizzes/${quiz.id}`}
          className="rounded-md px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors"
        >
          View
        </Link>

        {!confirmOpen ? (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            aria-label="Delete quiz"
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Delete?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? <Spinner className="h-3 w-3" /> : null}
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
