'use client';

import Link from 'next/link';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="mb-2 text-xl font-bold">Something went wrong</h1>

      <p className="mb-6 text-sm text-ink/60">
        We hit an unexpected error while loading this page. Please try again or return to the homepage.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Try Again
        </button>

        <Link
          href="/"
          className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}