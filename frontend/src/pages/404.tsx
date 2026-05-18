import Link from 'next/link';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <Layout title="Page Not Found">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-7xl font-extrabold text-brand-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Page not found</h1>
        <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
        <Link href="/quizzes" className="mt-8">
          <Button>Go to All Quizzes</Button>
        </Link>
      </div>
    </Layout>
  );
}
