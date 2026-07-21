/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CloudinaryImage from "@/components/cloudinary-image";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { NewsCard } from "@/components/news/NewsCard";
import { PhoneGrid } from "@/components/phone/PhoneGrid";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { getNewsBySlug, getAllNewsSlugs, getRelatedNews } from "@/queries/news";
import { getPhonesByBrandSlug } from "@/queries/phones";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return {};

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const ogImage = article.cover_image_public_id
    ? `https://res.cloudinary.com/${cloudName}/image/upload/${article.cover_image_public_id}`
    : undefined;

  return {
    title: article.title,
    description: article.excerpt ?? article.title,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: article.title }]
        : undefined,
    },
  };
}

// Splits the article body into paragraphs and inserts an ad after the 3rd,
// per the spec's "news after 3rd paragraph" ad placement rule.
function renderBodyWithAd(body: string | null) {
  if (!body) return null;
  const paragraphs = body.split("\n\n").filter(Boolean);
  return paragraphs.map((p, i) => (
    <div key={i}>
      <p className="mb-4 text-sm leading-relaxed text-ink/80">{p}</p>
      {i === 2 && (
        <div className="mb-4">
          <AdSlot slot="news-article-incontent-1" />
        </div>
      )}
    </div>
  ));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const brand = (article as any).brand as {
    id: string;
    name: string;
    slug: string;
  } | null;

  const [relatedNews, brandPhonesResult] = await Promise.all([
  getRelatedNews(article.id, article.brand_id, 4),
  brand ? getPhonesByBrandSlug(brand.slug, { limit: 6 }) : Promise.resolve({ phones: [], total: 0 }),
]);
const brandPhones = brandPhonesResult.phones;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "News", href: "/news" },
    { label: article.title },
  ];

  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-PK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <PageShell>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: article.title,
          description: article.excerpt ?? article.title,
          datePublished: article.published_at ?? undefined,
          ...(article.cover_image_public_id
            ? {
                image: [
                  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${article.cover_image_public_id}`,
                ],
              }
            : {}),
        }}
      />

      <Breadcrumb items={breadcrumbItems} />

      <article>
        <h1 className="mb-2 text-2xl font-bold">{article.title}</h1>
        <p className="mb-4 text-xs text-ink/50">
          {publishedDate}
          {brand && (
            <>
              {" "}
              ·{" "}
              <Link
                href={`/brand/${brand.slug}`}
                className="text-primary hover:underline"
              >
                {brand.name}
              </Link>
            </>
          )}
        </p>

        {article.cover_image_public_id && (
          <div className="relative mb-6 aspect-video overflow-hidden rounded-lg border border-border bg-surface">
            <CloudinaryImage
              src={article.cover_image_public_id}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {renderBodyWithAd(article.body)}
      </article>

      {brandPhones.length > 0 && brand && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold">{brand.name} Phones</h2>
          <PhoneGrid phones={brandPhones} />
        </section>
      )}
      <div className="my-8">
        <AdSlot slot="news-article-multiplex" />
      </div>
      {relatedNews.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold">Related News</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedNews.map((n: any) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
