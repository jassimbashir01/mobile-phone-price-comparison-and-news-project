import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { NewsCard } from "@/components/news/NewsCard";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SocialLinksRow } from "@/components/layout/SocialLinksRow";
import { ImageGallery } from "@/components/phone/ImageGallery";
import { ShareButtons } from "@/components/phone/ShareButtons";
import { PriceDisplay } from "@/components/phone/PriceDisplay";
import { RichContent } from "@/components/phone/RichContent";
import { PhoneGrid } from "@/components/phone/PhoneGrid";
import { NextPrevNav } from "@/components/phone/NextPrevNav";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { findPriceRangeForPrice } from "@/lib/constants";
import { ExtendedSpecTable } from "@/components/phone/ExtendedSpecTable";
import { SpecDisclaimer } from "@/components/phone/SpecDisclaimer";
import {
  getPhoneBySlug,
  getAllPhoneSlugs,
  getRelatedPhones,
  getSimilarPricedPhones,
  getBetterAlternatives,
  getCheaperAlternatives,
  getSameChipsetPhones,
  getAdjacentPhones,
  getPhoneExtendedSpecs,
} from "@/queries/phones";
import { getPublishedNews } from "@/queries/news";
import { getExchangeRate, getSocialLinks } from "@/queries/settings";

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
    description:
      phone.seo_description ??
      `${phone.name} price in Pakistan, full specifications, and images.`,
    alternates: { canonical: `/phone/${phone.slug}` },
    openGraph: {
      title: `${phone.name} Price in Pakistan`,
      description: phone.seo_description ?? undefined,
      images: ogImage
        ? [{ url: ogImage, width: 800, height: 800, alt: phone.name }]
        : undefined,
    },
  };
}

export default async function PhonePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const phone = await getPhoneBySlug(slug);
  if (!phone) notFound();

  const [
    relatedFromBrand,
    similarPriced,
    betterAlternatives,
    cheaperAlternatives,
    sameChipset,
    brandNews,
    exchangeRate,
    socialLinks,
    adjacent,
    extendedSpecs,
  ] = await Promise.all([
    getRelatedPhones(phone.id, phone.brand_id, 6),
    getSimilarPricedPhones(phone.id, phone.price_pkr, 6),
    getBetterAlternatives(phone.id, phone.price_pkr, 6),
    getCheaperAlternatives(phone.id, phone.price_pkr, 6),
    getSameChipsetPhones(phone.id, phone.specs?.processor ?? null, 6),
    getPublishedNews({ brandSlug: phone.brand.slug, limit: 6 }),
    getExchangeRate(),
    getSocialLinks(),
    getAdjacentPhones(phone.id, phone.brand_id),
    getPhoneExtendedSpecs(phone.id),
  ]);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const priceRange = findPriceRangeForPrice(phone.price_pkr);
  const phoneUrl = `${siteUrl}/phone/${phone.slug}`;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: phone.brand.name, href: `/brand/${phone.brand.slug}` },
    { label: phone.name },
  ];

  const compareCandidates = similarPriced.slice(0, 3);

  return (
    <PageShell>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <JsonLd data={buildProductJsonLd(phone, siteUrl, cloudName)} />

      <Breadcrumb items={breadcrumbItems} />

      <h1 className="mb-4 text-2xl font-bold">{phone.name}</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[320px_1fr] sm:items-center">
        <ImageGallery images={phone.images} phoneName={phone.name} />

        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink/60">
            by{" "}
            <Link
              href={`/brand/${phone.brand.slug}`}
              className="text-primary hover:underline"
            >
              {phone.brand.name}
            </Link>
            {phone.status === "coming_soon" && (
              <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold">
                Coming Soon
              </span>
            )}
            {phone.status === "discontinued" && (
              <span className="ml-2 rounded bg-ink/10 px-1.5 py-0.5 text-[10px] font-semibold text-ink/60">
                Discontinued
              </span>
            )}
          </p>

          <PriceDisplay
            pricePkr={phone.price_pkr}
            expectedPricePkr={phone.expected_price_pkr}
            status={phone.status}
            exchangeRate={exchangeRate}
          />

          {priceRange && (
            <p className="text-xs text-ink/50">
              See more phones in{" "}
              <Link
                href={`/price/${priceRange.slug}`}
                className="text-primary hover:underline"
              >
                {priceRange.label}
              </Link>
            </p>
          )}

          <ShareButtons url={phoneUrl} title={phone.name} />

          <Link
            href={`/compare?a=${phone.slug}`}
            className="inline-block w-fit rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Compare This Phone
          </Link>

          <SocialLinksRow links={socialLinks} />
        </div>
      </div>

      {phone.overview && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold">Overview</h2>
          <RichContent html={phone.overview} />
        </section>
      )}

      <div className="my-8">
        <AdSlot slot="phone-detail-incontent-1" />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold">Full Specifications</h2>
        <ExtendedSpecTable
          specs={extendedSpecs}
          pricePkr={phone.price_pkr}
          exchangeRate={exchangeRate}
        />
        <SpecDisclaimer phoneName={phone.name} />
      </section>

      {phone.description && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Description</h2>
          <RichContent html={phone.description} />
        </section>
      )}

      <div className="mb-8">
        <AdSlot slot="phone-detail-incontent-2" />
      </div>

      {similarPriced.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Similar Phones</h2>
          <PhoneGrid phones={similarPriced} />
        </section>
      )}

      {betterAlternatives.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Better Alternatives</h2>
          <PhoneGrid phones={betterAlternatives} />
        </section>
      )}

      {cheaperAlternatives.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Cheaper Alternatives</h2>
          <PhoneGrid phones={cheaperAlternatives} />
        </section>
      )}

      {sameChipset.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Same Chipset</h2>
          <PhoneGrid phones={sameChipset} />
        </section>
      )}

      {compareCandidates.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Compare With</h2>
          <div className="flex flex-wrap gap-2">
            {compareCandidates.map((c) => (
              <Link
                key={c.id}
                href={`/compare?a=${phone.slug}&b=${c.slug}`}
                className="rounded-md border border-border bg-white px-3 py-2 text-sm hover:border-primary hover:text-primary"
              >
                vs {c.brand.name} {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mb-8">
        <AdSlot slot="phone-detail-multiplex" />
      </div>

      {relatedFromBrand.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">
            More from {phone.brand.name}
          </h2>
          <PhoneGrid phones={relatedFromBrand} />
        </section>
      )}

      {brandNews.news.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-bold">Related Articles</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {brandNews.news.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        </section>
      )}

      <NextPrevNav
        prev={adjacent.prev}
        next={adjacent.next}
        brandName={phone.brand.name}
      />
    </PageShell>
  );
}
