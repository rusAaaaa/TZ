import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import QuestionView from '@/components/quiz/QuestionView';
import { Alert, Button, PageHeader, Spinner } from '@/components/ui';
import { quizService } from '@/services/quiz.service';
import { QuizDetailDto } from '@/types';

export default function QuizDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [quiz, setQuiz] = useState<QuizDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    quizService
      .getById(id)
      .then(setQuiz)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!quiz) return;
    setDeleting(true);
    try {
      await quizService.delete(quiz.id);
      router.push('/quizzes');
    } catch {
      alert('Failed to delete quiz. Please try again.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const formattedDate = quiz
    ? new Date(quiz.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <Layout title={quiz?.title ?? 'Quiz Detail'}>
      {/* Back link */}
      <Link
        href="/quizzes"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to all quizzes
      </Link>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Spinner className="h-8 w-8 text-brand-500" />
        </div>
      )}

      {error && <Alert type="error" message={`Failed to load quiz: ${error}`} />}

      {!loading && !error && quiz && (
        <>
          <PageHeader
            title={quiz.title}
            subtitle={`${quiz.questions.length} ${quiz.questions.length === 1 ? 'question' : 'questions'} · Created ${formattedDate}`}
            action={
              <div className="flex items-center gap-2">
                {!confirmDelete ? (
                  <Button variant="danger" onClick={() => setConfirmDelete(true)}>
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
                    Delete Quiz
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Are you sure?</span>
                    <Button variant="danger" loading={deleting} onClick={handleDelete}>
                      Yes, Delete
                    </Button>
                    <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            }
          />

          {/* Stats bar */}
          <div className="mb-6 flex flex-wrap gap-4">
            {(['BOOLEAN', 'INPUT', 'CHECKBOX'] as const).map((type) => {
              const count = quiz.questions.filter((q) => q.type === type).length;
              if (count === 0) return null;
              const labels: Record<string, string> = {
                BOOLEAN: 'True/False',
                INPUT: 'Short Answer',
                CHECKBOX: 'Multiple Choice',
              };
              const colors: Record<string, string> = {
                BOOLEAN: 'bg-purple-50 text-purple-700 border-purple-200',
                INPUT: 'bg-amber-50 text-amber-700 border-amber-200',
                CHECKBOX: 'bg-teal-50 text-teal-700 border-teal-200',
              };
              return (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${colors[type]}`}
                >
                  <span className="text-base font-bold">{count}</span>
                  {labels[type]}
                </span>
              );
            })}
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {quiz.questions.map((q, i) => (
              <QuestionView key={q.id} question={q} index={i} />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}
