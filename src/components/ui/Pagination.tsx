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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const hasQuery = basePath.includes('?');

  function hrefFor(p: number) {
    if (p === 1) return basePath;
    return `${basePath}${hasQuery ? '&' : '?'}page=${p}`;
  }

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={`rounded-md border px-3 py-1.5 text-sm ${
            p === currentPage
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-ink hover:border-primary'
          }`}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}