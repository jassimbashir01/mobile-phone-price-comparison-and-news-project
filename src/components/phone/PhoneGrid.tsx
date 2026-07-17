import { PhoneCard } from './PhoneCard';
import { AdSlot } from '@/components/ads/AdSlot';
import type { PhoneCardData } from '@/types/database';

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
        <div key="mid-grid-ad" className="col-span-3 sm:col-span-4 lg:col-span-6">
          <AdSlot slot="category-mid-grid" />
        </div>
      );
    }
  });

  return <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">{items}</div>;
}