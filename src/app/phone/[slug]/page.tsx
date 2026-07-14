import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ImageGallery } from '@/components/phone/ImageGallery';
import { ShareButtons } from '@/components/phone/ShareButtons';
import { SpecTable } from '@/components/phone/SpecTable';
import { PhoneGrid } from '@/components/phone/PhoneGrid';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd, buildProductJsonLd } from '@/lib/seo';
import { formatPKR, formatUSD } from '@/lib/utils';
import { findPriceRangeForPrice } from '@/lib/constants';
import {
  getPhoneBySlug,
  getAllPhoneSlugs,
  getRelatedPhones,
  getSimilarPricedPhones,
} from '@/queries/phones';
import { getPublishedNews } from '@/queries/news';

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getAllPhoneSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const phone = await getPhoneBySlug(slug);
  if (!phone) return {};

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const primary = phone.images.find((i) => i.is_primary) ?? phone.images[0];
  const ogImage = primary
    ? `https://res.cloudinary.com/${cloudName}/image/upload/${primary.cloudinary_public_id}`
    : undefined;

  return {
    title: `${phone.name} Price in Pakistan & Specifications`,
    description: phone.seo_description ?? `${phone.name} price in Pakistan, full specifications, and images.`,
    alternates: { canonical: `/phone/${phone.slug}` },
    openGraph: {
      title: `${phone.name} Price in Pakistan`,
      description: phone.seo_description ?? undefined,
      images: ogImage ? [{ url: ogImage, width: 800, height: 800, alt: phone.name }] : undefined,
    },
  };
}

export default async function PhonePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const phone = await getPhoneBySlug(slug);
  if (!phone) notFound();

  const [relatedFromBrand, similarPriced, brandNews] = await Promise.all([
    getRelatedPhones(phone.id, phone.brand_id, 6),
    getSimilarPricedPhones(phone.id, phone.price_pkr, 6),
    getPublishedNews({ brandSlug: phone.brand.slug, limit: 3 }),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
  const priceRange = findPriceRangeForPrice(phone.price_pkr);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: phone.brand.name, href: `/brand/${phone.brand.slug}` },
    { label: phone.name },
  ];

  return (
    <PageShell>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <JsonLd data={buildProductJsonLd(phone, siteUrl, cloudName)} />

      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ImageGallery images={phone.images} phoneName={phone.name} />

        <div>
          <h1 className="mb-1 text-2xl font-bold">{phone.name}</h1>
          <p className="mb-3 text-sm text-ink/60">
            by{' '}
            <Link href={`/brand/${phone.brand.slug}`} className="text-primary hover:underline">
              {phone.brand.name}
            </Link>
            {phone.status === 'coming_soon' && (
              <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold">
                Coming Soon
              </span>
            )}
            {phone.status === 'discontinued' && (
              <span className="ml-2 rounded bg-ink/10 px-1.5 py-0.5 text-[10px] font-semibold text-ink/60">
                Discontinued
              </span>
            )}
          </p>

          <div className="mb-4 flex items-baseline gap-3 rounded-lg border border-border bg-white p-4">
            <span className="price-tag text-2xl">{formatPKR(phone.price_pkr)}</span>
            {phone.price_usd != null && (
              <span className="text-sm text-ink/50">≈ {formatUSD(phone.price_usd)}</span>
            )}
          </div>

          {priceRange && (
            <p className="mb-4 text-xs text-ink/50">
              See more phones in{' '}
              <Link href={`/price/${priceRange.slug}`} className="text-primary hover:underline">
                {priceRange.label}
              </Link>
            </p>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/compare?a=${phone.slug}`}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Compare This Phone
            </Link>
            <ShareButtons url={`${siteUrl}/phone/${phone.slug}`} title={phone.name} />
          </div>

          {phone.seo_description && <p className="text-sm text-ink/70">{phone.seo_description}</p>}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">Full Specifications</h2>
        <SpecTable specs={phone.specs} />
      </section>

      <div className="my-8">
        <AdSlot slot="phone-detail-incontent-1" />
      </div>

      {similarPriced.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Similarly Priced Phones</h2>
          <PhoneGrid phones={similarPriced} />
        </section>
      )}

      {relatedFromBrand.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">More from {phone.brand.name}</h2>
          <PhoneGrid phones={relatedFromBrand} />
        </section>
      )}

      <div className="mb-8">
        <AdSlot slot="phone-detail-incontent-2" />
      </div>

      {brandNews.news.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">{phone.brand.name} News</h2>
          <ul className="space-y-2">
            {brandNews.news.map((n) => (
              <li key={n.id}>
                <Link href={`/news/${n.slug}`} className="text-sm text-primary hover:underline">
                  {n.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}