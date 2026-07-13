'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="mb-2 text-xl font-bold">Something went wrong</h1>
      <p className="mb-6 text-sm text-ink/60">
        We hit an unexpected error loading this page. Try again, or head back home.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Try Again
      </button>
    </div>
  );
}