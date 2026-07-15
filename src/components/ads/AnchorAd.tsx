'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { AdSlot } from './AdSlot';

export function AnchorAd() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-1 shadow-lg lg:hidden">
      <button
        onClick={() => setDismissed(true)}
        aria-label="Close ad"
        className="absolute -top-3 right-1 rounded-full bg-ink/70 p-0.5 text-white"
      >
        <X size={12} />
      </button>
      <AdSlot slot="anchor-mobile" />
    </div>
  );
}