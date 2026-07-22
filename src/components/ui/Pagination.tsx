import Link from 'next/link';

export function Pagination({
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

  // Always show first, last, current, and one page on either side of
  // current — collapse everything else into an ellipsis. Caps the number
  // of rendered links regardless of totalPages, instead of rendering one
  // link per page unconditionally.
  const pagesToShow = new Set<number>();
  pagesToShow.add(1);
  pagesToShow.add(totalPages);
  for (let p = currentPage - 1; p <= currentPage + 1; p++) {
    if (p >= 1 && p <= totalPages) pagesToShow.add(p);
  }
  const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);

  const items: React.ReactNode[] = [];
  let lastRendered = 0;
  for (const p of sortedPages) {
    if (p - lastRendered > 1) {
      items.push(
        <span key={`ellipsis-${p}`} className="px-1 text-sm text-ink/40">
          …
        </span>
      );
    }
    items.push(
      <Link
        key={p}
        href={hrefFor(p)}
        aria-current={p === currentPage ? 'page' : undefined}
        className={`rounded-md border px-3 py-1.5 text-sm ${
          p === currentPage
            ? 'border-primary bg-primary text-white'
            : 'border-border bg-white text-ink hover:border-primary'
        }`}
      >
        {p}
      </Link>
    );
    lastRendered = p;
  }

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      {items}
    </nav>
  );
}