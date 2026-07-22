import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { NewsCard } from "@/components/news/NewsCard";
import { Pagination } from "@/components/ui/Pagination";
import { getPublishedNews } from "@/queries/news";
import { getActiveBrands } from "@/queries/brands";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const revalidate = 1800;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}): Promise<Metadata> {
  const { brand } = await searchParams;
  return {
    title: "Mobile Phone News in Pakistan",
    description:
      "Latest mobile phone news, launches, and updates from Pakistan and around the world.",
    alternates: { canonical: brand ? `/news?brand=${brand}` : "/news" },
  };
}

export default async function NewsListingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; brand?: string }>;
}) {
  const { page: pageParam, brand: brandSlug } = await searchParams;
  const page = Number(pageParam ?? "1") || 1;
  const limit = 10;

  const [{ news, total }, brands] = await Promise.all([
    getPublishedNews({ page, limit, brandSlug }),
    getActiveBrands(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const basePath = brandSlug ? `/news?brand=${brandSlug}` : "/news";
  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "News" }];

  return (
    <PageShell>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="mb-2 text-xl font-bold">Mobile Phone News</h1>
      <p className="mb-4 text-sm text-ink/60">
        The latest mobile phone launches, price updates, and industry news from
        Pakistan and around the world.
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          href="/news"
          className={`rounded-full border px-3 py-1 text-xs ${
            !brandSlug
              ? "border-primary bg-primary text-white"
              : "border-border bg-white"
          }`}
        >
          All
        </Link>
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/news?brand=${b.slug}`}
            className={`rounded-full border px-3 py-1 text-xs ${
              brandSlug === b.slug
                ? "border-primary bg-primary text-white"
                : "border-border bg-white"
            }`}
          >
            {b.name}
          </Link>
        ))}
      </div>

      {news.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-ink/50">
          No news articles yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      )}

      <Pagination
        basePath={basePath}
        currentPage={page}
        totalPages={totalPages}
      />
    </PageShell>
  );
}
