/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CompareSlot } from './CompareSlot';
import { CompareSpecTable } from './CompareSpecTable';
import { SwapModal } from './SwapModal';
import type { PhoneWithDetails } from '@/types/database';

export function CompareClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const aSlug = searchParams.get('a');
  const bSlug = searchParams.get('b');

  const [phoneA, setPhoneA] = useState<PhoneWithDetails | null>(null);
  const [phoneB, setPhoneB] = useState<PhoneWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalSlot, setModalSlot] = useState<'a' | 'b' | null>(null);

  const fetchPhone = useCallback(async (slug: string) => {
    const res = await fetch(`/api/phones/${slug}`);
    if (!res.ok) return null;
    return (await res.json()) as PhoneWithDetails;
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      aSlug ? fetchPhone(aSlug) : Promise.resolve(null),
      bSlug ? fetchPhone(bSlug) : Promise.resolve(null),
    ]).then(([a, b]) => {
      if (!cancelled) {
        setPhoneA(a);
        setPhoneB(b);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [aSlug, bSlug, fetchPhone]);

  function updateSlug(slot: 'a' | 'b', slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(slot, slug);
    router.push(`/compare?${params.toString()}`);
    setModalSlot(null);
  }

  function swapSides() {
    const params = new URLSearchParams(searchParams.toString());
    if (aSlug) params.set('b', aSlug);
    else params.delete('b');
    if (bSlug) params.set('a', bSlug);
    else params.delete('a');
    router.push(`/compare?${params.toString()}`);
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Compare Phones</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CompareSlot phone={phoneA} onPick={() => setModalSlot('a')} />
        <CompareSlot phone={phoneB} onPick={() => setModalSlot('b')} />
      </div>

      {(phoneA || phoneB) && (
        <div className="my-4 flex justify-center">
          <button
            onClick={swapSides}
            className="rounded-md border border-border bg-white px-4 py-2 text-sm hover:border-primary"
          >
            ⇄ Swap
          </button>
        </div>
      )}

      {loading && <p className="mt-6 text-center text-sm text-ink/50">Loading…</p>}

      {!loading && phoneA && phoneB && <CompareSpecTable phoneA={phoneA} phoneB={phoneB} />}

      {!loading && (!phoneA || !phoneB) && (
        <p className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-sm text-ink/50">
          Pick two phones above to see a full side-by-side comparison.
        </p>
      )}

      {modalSlot && (
        <SwapModal onClose={() => setModalSlot(null)} onSelect={(slug) => updateSlug(modalSlot, slug)} />
      )}
    </div>
  );
}