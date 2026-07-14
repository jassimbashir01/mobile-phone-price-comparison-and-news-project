import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { CompareClient } from '@/components/compare/CompareClient';

export const metadata: Metadata = {
  title: 'Compare Mobile Phones',
  robots: { index: false, follow: true },
};

export default function ComparePage() {
  return (
    <PageShell>
      <Suspense fallback={<p className="text-sm text-ink/50">Loading comparison…</p>}>
        <CompareClient />
      </Suspense>
    </PageShell>
  );
}