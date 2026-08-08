import { PhoneCard } from "./PhoneCard";
import { AdSlot } from "@/components/ads/AdSlot";
import type { PhoneCardData } from "@/types/database";

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
    items.push(<PhoneCard key={p.id} phone={p} priority={i === 0} />);

    // AdSlot owns its own wrapper via wrapperClassName, so an unconfigured
    // slot renders nothing at all — no grid cell consumed, no half-empty row.
    if (i === 11) {
      items.push(
        <AdSlot
          key="mid-grid-ad"
          slot="category-mid-grid"
          wrapperClassName="col-span-3 sm:col-span-4 lg:col-span-6"
        />,
      );
    }
    if (i === 47) {
      items.push(
        <AdSlot
          key="mid-grid-ad-2"
          slot="category-mid-grid-2"
          wrapperClassName="col-span-3 sm:col-span-4 lg:col-span-6"
        />,
      );
    }
  });

  // 3 / 4 / 6 columns — all divisors of 12, so ad insertions at indexes 11
  // and 47 always land on a row boundary. A 5-column breakpoint was removed
  // for exactly this reason: 5 divides neither 12 nor 96.
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {items}
    </div>
  );
}
