import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { HomeSection } from "@/components/home/HomeSection";
import { FeaturedSlider } from "@/components/phone/FeaturedSlider";
import { NewsCard } from "@/components/news/NewsCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebsiteJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { PRICE_RANGES, priceRangeSectionKey } from "@/lib/constants";
import { getHomepageSectionPhones } from "@/queries/homepage";
import { getPublishedNews } from "@/queries/news";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Mobile Prices & News in Pakistan",
  description:
    "Compare the latest mobile phone prices in Pakistan across all brands, browse full specs, and read the latest phone news.",
  alternates: { canonical: "/" },
};

const priceBrackets = PRICE_RANGES.filter((r) => r.slug !== "all-mobiles");

export default async function HomePage() {
  const [featured, latest, priceSections, comingSoon, newsResult] =
    await Promise.all([
      getHomepageSectionPhones("featured_slider"),
      getHomepageSectionPhones("latest_phones"),
      Promise.all(
        priceBrackets.map((range) =>
          getHomepageSectionPhones(priceRangeSectionKey(range), {
            fallback: { priceMin: range.min, priceMax: range.max },
          }),
        ),
      ),
      getHomepageSectionPhones("coming_soon"),
      getPublishedNews({ limit: 6 }),
    ]);

  return (
    <PageShell>
      <JsonLd data={buildWebsiteJsonLd(siteUrl)} />

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

      {[...priceBrackets].reverse().map((range, i) => {
        const section = [...priceSections].reverse()[i];

        return (
          <HomeSection
            key={range.slug}
            title={section?.title ?? range.label}
            phones={section?.phones ?? []}
            viewAllHref={`/price/${range.slug}`}
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
    </PageShell>
  );
}
