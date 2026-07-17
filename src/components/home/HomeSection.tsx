import Link from 'next/link';
import { PhoneCard } from '@/components/phone/PhoneCard';
import type { PhoneCardData } from '@/types/database';

export function HomeSection({
  title,
  phones,
  viewAllHref,
}: {
  title: string;
  phones: PhoneCardData[];
  viewAllHref?: string;
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-medium text-primary hover:underline">
            View All →
          </Link>
        )}
      </div>
      {phones.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-ink/50">
          No phones in this section yet — add some from /admin/featured.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {phones.map((p) => (
            <PhoneCard key={p.id} phone={p} />
          ))}
        </div>
      )}
    </section>
  );
}