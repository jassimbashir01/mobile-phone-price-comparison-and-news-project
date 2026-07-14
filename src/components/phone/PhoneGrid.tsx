import { PhoneCard } from './PhoneCard';
import { AdSlot } from '@/components/ads/AdSlot';
import type { PhoneCardData } from '@/types/database';

// Inserts a native in-grid ad after the 12th phone on any listing long
// enough to have one. Because AdSlot lazy-loads via
// IntersectionObserver, this doesn't clutter any single screenful — it
// simply doesn't render at all until someone actually scrolls to it. This
// one component is reused by every category page and by the phone detail
// page's related-phones sections, so the extra ad opportunity shows up
// everywhere a grid is long enough to warrant it, automatically.
export function PhoneGrid({ phones }: { phones: PhoneCardData[] }) {
  if (phones.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-ink/50">
        No phones found in this category yet.
      </p>
    );
  }

  const items: React.ReactNode[] = [];
  phones.forEach((p, i) => {
    items.push(<PhoneCard key={p.id} phone={p} />);
    if (i === 11) {
      items.push(
        <div key="mid-grid-ad" className="col-span-2 sm:col-span-3 lg:col-span-4">
          <AdSlot slot="category-mid-grid" />
        </div>
      );
    }
  });

  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{items}</div>;
}