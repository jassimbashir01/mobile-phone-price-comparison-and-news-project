import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { OfferCard } from '@/components/offers/OfferCard';
import { getActiveOffers } from '@/queries/offers';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Deals & Offers',
  description: 'Affiliate deals and local shop offers on mobile phones and accessories.',
  alternates: { canonical: '/offers' },
};

export default async function OffersPage() {
  const offers = await getActiveOffers();

  return (
    <PageShell>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Deals & Offers' }]} />
      <h1 className="mb-2 text-xl font-bold">Deals & Offers</h1>
      <p className="mb-6 text-sm text-ink/60">
        Affiliate deals and offers from local shops. Links may earn us a
        commission at no extra cost to you.
      </p>
      {offers.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-ink/50">
          No active offers right now — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {offers.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      )}
    </PageShell>
  );
}