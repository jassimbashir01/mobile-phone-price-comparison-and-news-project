import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { CategoryPageContent } from '@/components/category/CategoryPageContent';
import { filterPhones } from '@/queries/phones';

export const revalidate = 21600;

export const metadata: Metadata = {
  title: '4G Mobile Phones in Pakistan',
  description: 'Browse 4G mobile phones in Pakistan with prices and full specifications.',
  alternates: { canonical: '/mobiles/4g-phones' },
};

export default async function FourGPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? '1') || 1;
  const limit = 24;
  const { phones, total } = await filterPhones({ networkType: '4G', page, limit });

  return (
    <PageShell>
      <CategoryPageContent
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Network' }, { label: '4G Phones' }]}
        title="4G Mobile Phones in Pakistan"
        phones={phones}
        total={total}
        page={page}
        limit={limit}
        basePath="/mobiles/4g-phones"
      />
    </PageShell>
  );
}