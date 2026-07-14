/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  price_pkr: number | null;
  brand: { name: string };
}

export function SwapModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (slug: string) => void;
}) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/phones/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.phones ?? []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Select a phone</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search phones…"
          className="mb-3 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        />
        {loading && <p className="text-xs text-ink/40">Searching…</p>}
        <ul className="divide-y divide-border">
          {results.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => onSelect(r.slug)}
                className="flex w-full items-center justify-between px-1 py-2 text-left text-sm hover:text-primary"
              >
                <span>
                  {r.brand.name} {r.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {!loading && q.trim().length >= 2 && results.length === 0 && (
          <p className="text-xs text-ink/40">No phones found.</p>
        )}
      </div>
    </div>
  );
}