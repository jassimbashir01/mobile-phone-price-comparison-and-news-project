import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function NextPrevNav({
  prev,
  next,
  brandName,
}: {
  prev: { name: string; slug: string } | null;
  next: { name: string; slug: string } | null;
  brandName: string;
}) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-8 grid grid-cols-2 gap-3 border-t border-border pt-6" aria-label="Adjacent phones">
      {prev ? (
        <Link
          href={`/phone/${prev.slug}`}
          className="flex items-center gap-2 rounded-md border border-border bg-white p-3 text-sm hover:border-primary"
        >
          <ChevronLeft size={16} className="shrink-0 text-ink/40" />
          <span className="min-w-0">
            <span className="block text-[10px] text-ink/40">Previous {brandName}</span>
            <span className="block truncate font-medium">{prev.name}</span>
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/phone/${next.slug}`}
          className="flex items-center justify-end gap-2 rounded-md border border-border bg-white p-3 text-right text-sm hover:border-primary"
        >
          <span className="min-w-0">
            <span className="block text-[10px] text-ink/40">Next {brandName}</span>
            <span className="block truncate font-medium">{next.name}</span>
          </span>
          <ChevronRight size={16} className="shrink-0 text-ink/40" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}