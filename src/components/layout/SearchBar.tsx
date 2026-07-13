'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ className }: { className?: string }) {
  const [q, setQ] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2">
        <Search size={18} className="text-ink/50" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search phones e.g. Samsung A15"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
        />
      </div>
    </form>
  );
}