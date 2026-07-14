import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';

export default function NotFound() {
  return (
    <PageShell>
      <div className="rounded-lg border border-border bg-white p-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-primary">404</h1>
        <p className="mb-6 text-sm text-ink/60">
          We couldn&apos;t find that page. It may have been moved or the phone may
          no longer be listed.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link href="/" className="rounded-md bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark">
            Go to Homepage
          </Link>
          <Link href="/price/all-mobiles" className="rounded-md border border-border px-4 py-2 hover:border-primary">
            Browse All Mobiles
          </Link>
          <Link href="/news" className="rounded-md border border-border px-4 py-2 hover:border-primary">
            Latest News
          </Link>
        </div>
      </div>
    </PageShell>
  );
}