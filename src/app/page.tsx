import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { HomeSection } from '@/components/home/HomeSection';
import { FeaturedSlider } from '@/components/phone/FeaturedSlider';
import { NewsCard } from '@/components/news/NewsCard';
import { AdSlot } from '@/components/ads/AdSlot';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildWebsiteJsonLd } from '@/lib/seo';
import { getHomepageSectionPhones } from '@/queries/homepage';
import { getPublishedNews } from '@/queries/news';
import { siteUrl } from '@/lib/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Mobile Prices & News in Pakistan',
  description:
    'Compare the latest mobile phone prices in Pakistan across all brands, browse full specs, and read the latest phone news.',
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [featured, latest, tier1, tier2, tier3, comingSoon, newsResult] = await Promise.all([
    getHomepageSectionPhones('featured_slider'),
    getHomepageSectionPhones('latest_phones'),
    getHomepageSectionPhones('price_5k_10k'),
    getHomepageSectionPhones('price_10k_25k'),
    getHomepageSectionPhones('price_25k_plus'),
    getHomepageSectionPhones('coming_soon'),
    getPublishedNews({ limit: 6 }),
  ]);

  return (
    <PageShell>
      <JsonLd data={buildWebsiteJsonLd(siteUrl)} />
      <section className="mb-8">
        <h1 className="mb-3 text-xl font-bold">{featured?.title ?? 'Featured Phones'}</h1>
        <FeaturedSlider phones={featured?.phones ?? []} />
      </section>

      <HomeSection
        title={latest?.title ?? 'Latest Phones'}
        phones={latest?.phones ?? []}
        viewAllHref="/price/all-mobiles"
      />

      <div className="mb-8">
        <AdSlot slot="homepage-between-sections" />
      </div>

      <HomeSection
        title={tier1?.title ?? 'Rs. 5,000 - 10,000'}
        phones={tier1?.phones ?? []}
        viewAllHref="/price/5000-10000"
      />
      <HomeSection
        title={tier2?.title ?? 'Rs. 10,000 - 25,000'}
        phones={tier2?.phones ?? []}
        viewAllHref="/price/all-mobiles"
      />
      <HomeSection
        title={tier3?.title ?? 'Above Rs. 25,000'}
        phones={tier3?.phones ?? []}
        viewAllHref="/price/all-mobiles"
      />

      <HomeSection title={comingSoon?.title ?? 'Coming Soon'} phones={comingSoon?.phones ?? []} />

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Latest News</h2>
          <Link href="/news" className="text-sm font-medium text-primary hover:underline">
            View All →
          </Link>
        </div>
        {newsResult.news.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-ink/50">
            No news articles yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newsResult.news.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}