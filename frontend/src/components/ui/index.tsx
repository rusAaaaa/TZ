import { ReactNode, ButtonHTMLAttributes } from 'react';

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

const badgeVariants: Record<string, string> = {
  BOOLEAN: 'bg-purple-100 text-purple-700',
  INPUT: 'bg-amber-100 text-amber-700',
  CHECKBOX: 'bg-teal-100 text-teal-700',
};

const badgeLabels: Record<string, string> = {
  BOOLEAN: 'True / False',
  INPUT: 'Short Answer',
  CHECKBOX: 'Multiple Choice',
};

export function QuestionTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeVariants[type] ?? 'bg-slate-100 text-slate-700'}`}
    >
      {badgeLabels[type] ?? type}
    </span>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">{icon}</div>
      <h3 className="mb-1 text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mb-6 max-w-xs text-sm text-slate-500">{description}</p>
      {action}
    </div>
  );
}

// ─── Alert ────────────────────────────────────────────────────────────────────

export function Alert({ type, message }: { type: 'error' | 'success'; message: string }) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
  };
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`} role="alert">
      {message}
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';
  const variants: Record<string, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

// ─── Page header ─────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
