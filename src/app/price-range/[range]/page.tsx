import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { CategoryPageContent } from '@/components/category/CategoryPageContent';
import { filterPhones } from '@/queries/phones';
import { HOMEPAGE_PRICE_RANGES } from '@/lib/constants';

export const revalidate = 21600;

export function generateStaticParams() {
  return HOMEPAGE_PRICE_RANGES.map((r) => ({ range: r.slug }));
}

function getRange(slug: string) {
  return HOMEPAGE_PRICE_RANGES.find((r) => r.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ range: string }>;
}): Promise<Metadata> {
  const { range: slug } = await params;
  const range = getRange(slug);
  if (!range) return {};
  return {
    title: `Mobile Phones ${range.label} in Pakistan`,
    description: `Browse mobile phones priced ${range.label} in Pakistan with full specifications and prices.`,
    alternates: { canonical: `/price-range/${range.slug}` },
  };
}

export default async function HomepagePriceRangePage({
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
  const limit = 24;
  const { phones, total } = await filterPhones({
    priceMin: range.min,
    priceMax: range.max,
    page,
    limit,
  });

  return (
    <PageShell>
      <CategoryPageContent
        breadcrumbItems={[{ label: 'Home', href: '/' }, { label: range.label }]}
        title={`Mobile Phones ${range.label} in Pakistan`}
        description={`Compare mobile phones priced ${range.label.toLowerCase()} in Pakistan.`}
        phones={phones}
        total={total}
        page={page}
        limit={limit}
        basePath={`/price-range/${range.slug}`}
      />
    </PageShell>
  );
}