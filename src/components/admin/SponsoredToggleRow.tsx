'use client';

import { useState, useTransition } from 'react';
import { setSponsored } from '@/lib/actions/phones';

export function SponsoredToggleRow({
  id,
  slug,
  name,
  brandName,
  initialSponsored,
}: {
  id: string;
  slug: string;
  name: string;
  brandName?: string;
  initialSponsored: boolean;
}) {
  const [sponsored, setSponsoredState] = useState(initialSponsored);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !sponsored;
    setSponsoredState(next);
    startTransition(async () => {
      await setSponsored(id, next, slug);
    });
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-3 py-2">{name}</td>
      <td className="px-3 py-2 text-ink/50">{brandName}</td>
      <td className="px-3 py-2">
        <input type="checkbox" checked={sponsored} onChange={toggle} disabled={isPending} />
      </td>
    </tr>
  );
}