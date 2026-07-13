'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PhoneCard } from './PhoneCard';
import type { PhoneCardData } from '@/types/database';

export function FeaturedSlider({ phones }: { phones: PhoneCardData[] }) {
  const [index, setIndex] = useState(0);
  const perView = 4;
  const maxIndex = Math.max(0, phones.length - perView);

  if (phones.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-ink/50">
        No featured phones yet — add some from /admin/featured.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-300"
          style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
        >
          {phones.map((p) => (
            <div key={p.id} className="w-1/2 shrink-0 sm:w-1/3 lg:w-1/4">
              <PhoneCard phone={p} />
            </div>
          ))}
        </div>
      </div>
      {maxIndex > 0 && (
        <>
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            aria-label="Previous featured phone"
            className="absolute -left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-white p-1.5 shadow disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            disabled={index === maxIndex}
            aria-label="Next featured phone"
            className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-white p-1.5 shadow disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}