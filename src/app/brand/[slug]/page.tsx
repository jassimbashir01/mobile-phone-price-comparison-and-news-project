import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PhoneGrid } from '@/components/phone/PhoneGrid';
import { Pagination } from '@/components/ui/Pagination';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd } from '@/lib/seo';
import { siteUrl } from '@/lib/site';
import CloudinaryImage from '@/components/cloudinary-image';
import { getBrandBySlug, getAllBrandSlugs } from '@/queries/brands';
import { getPhonesByBrandSlug } from '@/queries/phones';

export const revalidate = 21600;

export async function generateStaticParams() {
  const slugs = await getAllBrandSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} Mobile Prices in Pakistan`,
    description:
      brand.description ??
      `Browse all ${brand.name} mobile phones with prices and specifications in Pakistan.`,
    alternates: { canonical: `/brand/${brand.slug}` },
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const page = Number(pageParam ?? '1') || 1;
  const limit = 24;
  const { phones, total } = await getPhonesByBrandSlug(slug, { page, limit });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: brand.name }];

  return (
    <PageShell>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <Breadcrumb items={breadcrumbItems} />
      <div className="mb-4 flex items-center gap-3">
        {brand.logo_url && (
          <CloudinaryImage
            src={brand.logo_url}
            alt={`${brand.name} logo`}
            width={40}
            height={40}
            sizes="40px"
            className="h-10 w-10 object-contain"
          />
        )}
        <h1 className="text-xl font-bold">{brand.name} Mobile Prices in Pakistan</h1>
      </div>
      {brand.description && <p className="mb-4 text-sm text-ink/60">{brand.description}</p>}
      <p className="mb-4 text-xs text-ink/40">{total} phones found</p>
      <PhoneGrid phones={phones} />
      <Pagination basePath={`/brand/${slug}`} currentPage={page} totalPages={totalPages} />
    </PageShell>
  );
}