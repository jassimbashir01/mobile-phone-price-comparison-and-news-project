import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { CategoryPageContent } from '@/components/category/CategoryPageContent';
import { filterPhones } from '@/queries/phones';
import { RAM_OPTIONS } from '@/lib/constants';

export const revalidate = 21600;

export function generateStaticParams() {
  return RAM_OPTIONS.map((r) => ({ size: r.slug }));
}

function getOption(slug: string) {
  return RAM_OPTIONS.find((r) => r.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ size: string }>;
}): Promise<Metadata> {
  const { size } = await params;
  const opt = getOption(size);
  if (!opt) return {};
  return {
    title: `${opt.label} Mobile Phones in Pakistan`,
    description: `Browse ${opt.label} mobile phones available in Pakistan with prices and full specifications.`,
    alternates: { canonical: `/ram/${opt.slug}` },
  };
}

export default async function RamPage({
  params,
  searchParams,
}: {
  params: Promise<{ size: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { size } = await params;
  const { page: pageParam } = await searchParams;
  const opt = getOption(size);
  if (!opt) notFound();

  const page = Number(pageParam ?? '1') || 1;
  const limit = 24;
  const { phones, total } = await filterPhones({ ramMin: opt.min, ramMax: opt.max, page, limit });

  return (
    <PageShell>
      <CategoryPageContent
        breadcrumbItems={[
          { label: 'Home', href: '/' },
          { label: 'RAM' },
          { label: opt.label },
        ]}
        title={`${opt.label} Mobile Phones in Pakistan`}
        phones={phones}
        total={total}
        page={page}
        limit={limit}
        basePath={`/ram/${opt.slug}`}
      />
    </PageShell>
  );
}