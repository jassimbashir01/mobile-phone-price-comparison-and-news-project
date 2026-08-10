import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { OfferCard } from "@/components/offers/OfferCard";
import { Pagination } from "@/components/ui/Pagination";
import { AdSlot } from "@/components/ads/AdSlot";
import { getActiveOffers } from "@/queries/offers";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd, buildOffersItemListJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Deals & Offers",
  description:
    "Affiliate deals and local shop offers on mobile phones and accessories.",
  alternates: { canonical: "/offers" },
  openGraph: {
    title: "Deals & Offers",
    description:
      "Affiliate deals and local shop offers on mobile phones and accessories.",
  },
};

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1") || 1;
  const limit = 96;

  const { offers, total } = await getActiveOffers(undefined, page, limit);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Deals & Offers" },
  ];

  return (
    <PageShell>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      {/* Skip the ItemList when there's nothing to list — an empty ItemList
          is valid but pointless structured data. */}
      {offers.length > 0 && (
        <JsonLd data={buildOffersItemListJsonLd(offers, siteUrl)} />
      )}
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="mb-2 text-xl font-bold">Deals &amp; Offers</h1>
      <p className="mb-4 text-sm text-ink/60">
        Affiliate deals and offers from local shops. Links may earn us a
        commission at no extra cost to you.
      </p>
      <p className="mb-4 text-xs text-ink/40">{total} offers found</p>
      {offers.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-ink/50">
          No active offers right now — check back soon.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {offers.slice(0, 8).map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
          {/* AdSlot owns its own wrapper via wrapperClassName, so an
              unconfigured slot leaves no stray vertical gap between grids. */}
          {offers.length > 8 && (
            <AdSlot slot="offers-mid-grid" wrapperClassName="my-6" />
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {offers.slice(8).map((o) => (
              <OfferCard key={o.id} offer={o} />
            ))}
          </div>
        </>
      )}
      <Pagination
        basePath="/offers"
        currentPage={page}
        totalPages={totalPages}
      />
      <div className="mb-6 mt-6 rounded-lg border border-border bg-primary-light/40 p-4 text-sm">
        <p className="text-ink/80">
          Run a mobile shop and want your own deals listed here?{" "}
          <Link
            href="/advertise"
            className="font-semibold text-primary hover:underline"
          >
            Advertise with us
          </Link>{" "}
          or{" "}
          <Link
            href="/contact"
            className="font-semibold text-primary hover:underline"
          >
            get in touch
          </Link>{" "}
          to get featured.
        </p>
      </div>
    </PageShell>
  );
}
