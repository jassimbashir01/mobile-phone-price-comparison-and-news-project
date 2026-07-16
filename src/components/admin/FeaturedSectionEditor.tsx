'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateHomepageSection } from '@/lib/actions/homepage';
import { setSponsored } from '@/lib/actions/phones';
import { SwapModal } from '@/components/compare/SwapModal';
import { formatPKR } from '@/lib/utils';

interface SlotPhone {
  id: string;
  name: string;
  slug: string;
  price_pkr: number | null;
  is_sponsored: boolean;
  isPinned: boolean;
}

export function FeaturedSectionEditor({
  sectionKey,
  title,
  initialPhones,
  isPriceSection,
}: {
  sectionKey: string;
  title: string;
  initialPhones: SlotPhone[];
  isPriceSection: boolean;
}) {
  const router = useRouter();
  const slots: (SlotPhone | null)[] = [...initialPhones, ...Array(6).fill(null)].slice(0, 6);
  const [current, setCurrent] = useState(slots);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function removeSlot(i: number) {
    const next = [...current];
    next[i] = null;
    setCurrent(next);
    setSaved(false);
  }

  async function selectForSlot(i: number, slug: string) {
    const res = await fetch(`/api/phones/${slug}`);
    const phone = await res.json();
    const next = [...current];
    next[i] = {
      id: phone.id,
      name: phone.name,
      slug: phone.slug,
      price_pkr: phone.price_pkr,
      is_sponsored: phone.is_sponsored,
      isPinned: true,
    };
    setCurrent(next);
    setModalIndex(null);
    setSaved(false);
  }

  function pinAutoSlot(i: number) {
    const slot = current[i];
    if (!slot) return;
    const next = [...current];
    next[i] = { ...slot, isPinned: true };
    setCurrent(next);
    setSaved(false);
  }

  async function toggleSponsored(i: number) {
    const slot = current[i];
    if (!slot) return;
    const nextValue = !slot.is_sponsored;
    await setSponsored(slot.id, nextValue, slot.slug);
    const next = [...current];
    next[i] = { ...slot, is_sponsored: nextValue };
    setCurrent(next);
  }

  async function handleSave() {
    setSaving(true);
    const ids = current.filter((p): p is SlotPhone => !!p && p.isPinned).map((p) => p.id);
    await updateHomepageSection(sectionKey, ids);
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="mb-8 rounded-lg border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold">{title}</h2>
        {isPriceSection && (
          <span className="text-[10px] text-ink/40">
            Unpinned slots auto-fill with the latest phones in this price range
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {current.map((slot, i) => (
          <div key={i} className="rounded-md border border-dashed border-border p-2 text-center">
            {slot ? (
              <>
                <span
                  className={`mb-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                    slot.isPinned ? 'bg-primary-light text-primary-dark' : 'bg-surface text-ink/50'
                  }`}
                >
                  {slot.isPinned ? 'Pinned' : 'Auto'}
                </span>
                <p className="mb-1 line-clamp-2 text-xs font-medium">{slot.name}</p>
                <p className="mb-1 text-[11px] text-ink/50">{formatPKR(slot.price_pkr)}</p>
                <label className="mb-1 flex items-center justify-center gap-1 text-[10px]">
                  <input type="checkbox" checked={slot.is_sponsored} onChange={() => toggleSponsored(i)} />
                  Sponsored
                </label>
                <div className="flex justify-center gap-2 text-[11px]">
                  <button onClick={() => setModalIndex(i)} className="text-primary hover:underline">
                    Change
                  </button>
                  {slot.isPinned ? (
                    <button onClick={() => removeSlot(i)} className="text-red-600 hover:underline">
                      Unpin
                    </button>
                  ) : (
                    <button onClick={() => pinAutoSlot(i)} className="text-primary hover:underline">
                      Pin
                    </button>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => setModalIndex(i)}
                className="flex h-full w-full flex-col items-center justify-center gap-1 py-4 text-xs text-ink/40 hover:text-primary"
              >
                <span className="text-lg">+</span>
                Add phone
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-3 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Section'}
      </button>

      {modalIndex !== null && (
        <SwapModal onClose={() => setModalIndex(null)} onSelect={(slug) => selectForSlot(modalIndex, slug)} />
      )}
    </div>
  );
}