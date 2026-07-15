/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { PhoneGrid } from '@/components/phone/PhoneGrid';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd } from '@/lib/seo';
import { getBrandBySlug, getAllBrandSlugs } from '@/queries/brands';
import { getPhonesByBrandSlug } from '@/queries/phones';
import { siteUrl } from '@/lib/site';

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

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const phones = await getPhonesByBrandSlug(slug);
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: brand.name }];

  return (
    <PageShell>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <Breadcrumb items={breadcrumbItems} />
      <div className="mb-4 flex items-center gap-3">
        {brand.logo_url && (
          // Brand logos are admin-uploaded URLs, not necessarily Cloudinary
          // public IDs, so we use a plain <img> here rather than CldImage.
          <img src={brand.logo_url} alt={`${brand.name} logo`} className="h-10 w-10 object-contain" />
        )}
        <h1 className="text-xl font-bold">{brand.name} Mobile Prices in Pakistan</h1>
      </div>
      {brand.description && <p className="mb-4 text-sm text-ink/60">{brand.description}</p>}
      <p className="mb-4 text-xs text-ink/40">{phones.length} phones found</p>
      <PhoneGrid phones={phones} />
    </PageShell>
  );
}