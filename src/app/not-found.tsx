import Link from 'next/link';

import { PageShell } from '@/components/layout/PageShell';

export default function NotFound() {
  return (
    <PageShell>
      <div className="rounded-lg border border-border bg-white p-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-primary">
          404
        </h1>

        <p className="mx-auto mb-6 max-w-md text-sm text-ink/60">
          We couldn&apos;t find the page you&apos;re looking for. It may have
          been removed, moved, or the phone is no longer available.
        </p>

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link
            href="/"
            className="rounded-md bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-dark"
          >
            Go to Homepage
          </Link>

          <Link
            href="/price/all-mobiles"
            className="rounded-md border border-border px-4 py-2 transition hover:border-primary"
          >
            Browse All Mobiles
          </Link>

          <Link
            href="/news"
            className="rounded-md border border-border px-4 py-2 transition hover:border-primary"
          >
            Latest News
          </Link>
        </div>
      </div>
    </PageShell>
  );
}