import { PhoneCard } from "./PhoneCard";
import type { PhoneCardData } from "@/types/database";

/**
 * A plain grid, matching HomeSection — this replaced a carousel that had two
 * compounding bugs: cards were sized w-1/6 inside a flex track that also had
 * gap-3, so six cards plus their gaps exceeded 100% and the last one
 * overflowed; and the transform step was calculated against the track width
 * rather than one card, so paging never landed cleanly.
 *
 * A grid has neither problem — the gap is part of the grid's own layout
 * rather than added on top of hand-computed widths — and 3/4/6 all divide
 * into 12, matching PhoneGrid and HomeSection.
 */
export function FeaturedGrid({ phones }: { phones: PhoneCardData[] }) {
  if (phones.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-ink/50">
        No featured phones yet
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {phones.map((p) => (
        <PhoneCard key={p.id} phone={p} />
      ))}
    </div>
  );
}
