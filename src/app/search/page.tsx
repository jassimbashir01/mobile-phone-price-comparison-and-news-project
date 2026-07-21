import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PhoneGrid } from '@/components/phone/PhoneGrid';
import { Pagination } from '@/components/ui/Pagination';
import { searchPhones } from '@/queries/phones';

export const metadata: Metadata = {
  title: 'Search Results',
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? '';
  const page = Number(pageParam ?? '1') || 1;
  const limit = 24;

  const { phones, total } = query ? await searchPhones(query, page, limit) : { phones: [], total: 0 };
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <PageShell>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
      <h1 className="mb-4 text-xl font-bold">
        {query ? `Search results for "${query}"` : 'Search'}
      </h1>
      {!query ? (
        <p className="text-sm text-ink/50">Use the search bar above to find a phone.</p>
      ) : (
        <>
          <p className="mb-4 text-xs text-ink/40">{total} phones found</p>
          <PhoneGrid phones={phones} />
          <Pagination basePath={`/search?q=${encodeURIComponent(query)}`} currentPage={page} totalPages={totalPages} />
        </>
      )}
    </PageShell>
  );
}