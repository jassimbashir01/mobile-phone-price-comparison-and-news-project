import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { CategoryPageContent } from '@/components/category/CategoryPageContent';
import { filterPhones } from '@/queries/phones';
import { PRICE_RANGES } from '@/lib/constants';

export const revalidate = 21600;

export function generateStaticParams() {
  return PRICE_RANGES.map((r) => ({ range: r.slug }));
}

function getRange(slug: string) {
  return PRICE_RANGES.find((r) => r.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ range: string }>;
}): Promise<Metadata> {
  const { range: slug } = await params;
  const range = getRange(slug);
  if (!range) return {};

  const isAll = range.slug === 'all-mobiles';

  return {
    title: isAll
      ? 'All Mobile Phones in Pakistan'
      : `Mobile Phones ${range.label} in Pakistan`,
    description: isAll
      ? 'Browse all available mobile phones in Pakistan with prices and full specifications.'
      : `Browse mobile phones priced ${range.label} in Pakistan with full specifications and prices.`,
    alternates: { canonical: `/price/${range.slug}` },
  };
}

export default async function PricePage({
  params,
  searchParams,
}: {
  params: Promise<{ range: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { range: slug } = await params;
  const { page: pageParam } = await searchParams;
  const range = getRange(slug);
  if (!range) notFound();

  const page = Number(pageParam ?? '1') || 1;
  const limit = 96;
  const { phones, total } = await filterPhones({
    priceMin: range.min,
    priceMax: range.max,
    page,
    limit,
  });

  const isAll = range.slug === 'all-mobiles';

  const breadcrumbItems = isAll
    ? [{ label: 'Home', href: '/' }, { label: 'All Mobiles' }]
    : [
        { label: 'Home', href: '/' },
        { label: 'Price', href: '/price/all-mobiles' },
        { label: range.label },
      ];

  const title = isAll ? 'All Mobile Phones in Pakistan' : `Mobile Phones ${range.label} in Pakistan`;

  const description = isAll
    ? 'Browse every mobile phone available in Pakistan, with prices and full specifications.'
    : `Compare mobile phones priced ${range.label.toLowerCase()} in Pakistan.`;

  return (
    <PageShell>
      <CategoryPageContent
        breadcrumbItems={breadcrumbItems}
        title={title}
        description={description}
        phones={phones}
        total={total}
        page={page}
        limit={limit}
        basePath={`/price/${range.slug}`}
      />
    </PageShell>
  );
}