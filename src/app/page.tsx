import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { HomeSection } from "@/components/home/HomeSection";
import { HomepageBanner } from "@/components/home/HomepageBanner";
import { FeaturedSlider } from "@/components/phone/FeaturedSlider";
import { NewsCard } from "@/components/news/NewsCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebsiteJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import {
  HOMEPAGE_PRICE_RANGES,
  homepagePriceSectionKey,
} from "@/lib/constants";
import { getHomepageSectionPhones } from "@/queries/homepage";
import { getPublishedNews } from "@/queries/news";
import { getHomepageBanner } from "@/queries/settings";
import { EmailCapture } from "@/components/EmailCapture";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Mobile Prices & News in Pakistan",
  description:
    "Compare the latest mobile phone prices in Pakistan across all brands, browse full specs, and read the latest phone news.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [featured, latest, priceSections, comingSoon, newsResult, banner] =
    await Promise.all([
      getHomepageSectionPhones("featured_slider"),
      // No price filter — auto-fills with the newest available phones
      getHomepageSectionPhones("latest_phones", {
        fallback: { status: "available" },
      }),
      Promise.all(
        HOMEPAGE_PRICE_RANGES.map((range) =>
          getHomepageSectionPhones(homepagePriceSectionKey(range), {
            fallback: { priceMin: range.min, priceMax: range.max },
          }),
        ),
      ),
      // Auto-fills with the newest coming-soon phones
      getHomepageSectionPhones("coming_soon", {
        fallback: { status: "coming_soon" },
      }),
      getPublishedNews({ limit: 6 }),
      getHomepageBanner(),
    ]);

  return (
    <PageShell>
      <JsonLd data={buildWebsiteJsonLd(siteUrl)} />

      <HomepageBanner banner={banner} />

      <section className="mb-8">
        <h1 className="mb-3 text-xl font-bold">
          {featured?.title ?? "Featured Phones"}
        </h1>
        <FeaturedSlider phones={featured?.phones ?? []} />
      </section>

      <HomeSection
        title={latest?.title ?? "Latest Phones"}
        phones={latest?.phones ?? []}
        viewAllHref="/price/all-mobiles"
      />

      <div className="mb-8">
        <AdSlot slot="homepage-between-sections" />
      </div>

      {HOMEPAGE_PRICE_RANGES.map((_, i) => {
        const index = HOMEPAGE_PRICE_RANGES.length - 1 - i;
        const range = HOMEPAGE_PRICE_RANGES[index];
        const section = priceSections[index];

        return (
          <HomeSection
            key={range.slug}
            title={section?.title ?? range.label}
            phones={section?.phones ?? []}
            viewAllHref={`/price-range/${range.slug}`}
          />
        );
      })}

      <HomeSection
        title={comingSoon?.title ?? "Coming Soon"}
        phones={comingSoon?.phones ?? []}
      />

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Latest News</h2>
          <Link
            href="/news"
            className="text-sm font-medium text-primary hover:underline"
          >
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

      <section className="mt-8 rounded-lg border border-border bg-white p-6 text-center">
        <h2 className="mb-1 text-lg font-bold">
          Never Miss a New Phone Launch
        </h2>
        <p className="mb-4 text-sm text-ink/60">
          Get notified when new phones and price drops go live.
        </p>
        <div className="mx-auto max-w-sm">
          <EmailCapture source="homepage" />
        </div>
      </section>
    </PageShell>
  );
}
