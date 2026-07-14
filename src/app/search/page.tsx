import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PhoneGrid } from '@/components/phone/PhoneGrid';
import { searchPhones } from '@/queries/phones';

export const metadata: Metadata = {
  title: 'Search Results',
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const phones = query ? await searchPhones(query, 40) : [];

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
          <p className="mb-4 text-xs text-ink/40">{phones.length} phones found</p>
          <PhoneGrid phones={phones} />
        </>
      )}
    </PageShell>
  );
}