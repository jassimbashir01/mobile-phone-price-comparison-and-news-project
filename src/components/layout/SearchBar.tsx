/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import CloudinaryImage from '@/components/cloudinary-image';
import { formatPKR } from '@/lib/utils';

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  price_pkr: number | null;
  brand: { name: string };
  primary_image: { cloudinary_public_id: string } | null;
}

export function SearchBar({ className }: { className?: string }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  // Clears the query and closes the dropdown on every route change —
  // without this, the text (and any stale dropdown) persists after
  // navigating away, which is the second bug being fixed here.
  useEffect(() => {
    setQ('');
    setResults([]);
    setOpen(false);
  }, [pathname]);

  // Debounced live search-as-you-type, same pattern as SwapModal.
  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/phones/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.phones ?? []);
      setOpen(true);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [q]);

  // Closes the dropdown on outside click, without needing a full-screen
  // overlay the way SwapModal's modal pattern does — this is an inline
  // dropdown, not a modal.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
          <Search size={18} className="text-ink/50" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search phones e.g. Samsung A15"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
          />
        </div>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-border bg-white shadow-lg">
          {loading && <p className="px-4 py-3 text-xs text-ink/40">Searching…</p>}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-xs text-ink/40">No phones found.</p>
          )}
          {!loading &&
            results.map((r) => (
              <Link
                key={r.id}
                href={`/phone/${r.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-border px-4 py-2 last:border-0 hover:bg-primary-light"
              >
                <div className="relative h-10 w-6 shrink-0 overflow-hidden rounded bg-surface">
                  {r.primary_image ? (
                    <CloudinaryImage
                      src={r.primary_image.cloudinary_public_id}
                      alt={r.name}
                      width={24}
                      height={40}
                      sizes="24px"
                      className="h-full w-full object-contain"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-ink/50">{r.brand.name}</p>
                  <p className="truncate text-sm font-medium">{r.name}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-primary">{formatPKR(r.price_pkr)}</span>
              </Link>
            ))}
          {!loading && results.length > 0 && (
            <button
              onClick={handleSubmit}
              className="block w-full border-t border-border px-4 py-2 text-center text-xs font-medium text-primary hover:bg-primary-light"
            >
              See all results for &ldquo;{q}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}