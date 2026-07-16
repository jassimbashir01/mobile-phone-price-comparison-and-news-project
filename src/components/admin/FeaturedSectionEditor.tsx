'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateHomepageSection } from '@/lib/actions/homepage';
import { formatPKR } from '@/lib/utils';
import { SwapModal } from '@/components/compare/SwapModal';

interface SlotPhone {
  id: string;
  name: string;
  slug: string;
  price_pkr: number | null;
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
                <p className="mb-1 text-[11px] font-semibold text-primary">{formatPKR(slot.price_pkr)}</p>
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