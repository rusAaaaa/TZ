import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import QuizCard from '@/components/quiz/QuizCard';
import { Alert, Button, EmptyState, PageHeader, Spinner } from '@/components/ui';
import { quizService } from '@/services/quiz.service';
import { QuizSummaryDto } from '@/types';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizSummaryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    quizService
      .getAll()
      .then(setQuizzes)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleted = (id: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <Layout title="All Quizzes">
      <PageHeader
        title="All Quizzes"
        subtitle={
          !loading && !error
            ? `${quizzes.length} ${quizzes.length === 1 ? 'quiz' : 'quizzes'} found`
            : undefined
        }
        action={
          <Link href="/create">
            <Button>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create Quiz
            </Button>
          </Link>
        }
      />

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Spinner className="h-8 w-8 text-brand-500" />
        </div>
      )}

      {error && <Alert type="error" message={`Failed to load quizzes: ${error}`} />}

      {!loading && !error && quizzes.length === 0 && (
        <EmptyState
          icon={
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
          title="No quizzes yet"
          description="Create your first quiz to get started."
          action={
            <Link href="/create">
              <Button>Create your first quiz</Button>
            </Link>
          }
        />
      )}

      {!loading && !error && quizzes.length > 0 && (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </Layout>
  );
}
