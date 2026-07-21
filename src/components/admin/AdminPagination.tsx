import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function AdminPagination({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hasQuery = basePath.includes('?');
  function hrefFor(p: number) {
    if (p === 1) return basePath;
    return `${basePath}${hasQuery ? '&' : '?'}page=${p}`;
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <Link
        href={hrefFor(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`flex items-center gap-1 rounded-md border border-border px-3 py-1.5 ${
          currentPage === 1 ? 'pointer-events-none opacity-30' : 'hover:border-primary'
        }`}
      >
        <ChevronLeft size={14} /> Previous
      </Link>
      <span className="text-xs text-ink/50">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={hrefFor(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`flex items-center gap-1 rounded-md border border-border px-3 py-1.5 ${
          currentPage === totalPages ? 'pointer-events-none opacity-30' : 'hover:border-primary'
        }`}
      >
        Next <ChevronRight size={14} />
      </Link>
    </div>
  );
}