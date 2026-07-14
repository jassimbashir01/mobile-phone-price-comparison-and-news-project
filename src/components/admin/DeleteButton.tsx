'use client';

import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';

export function DeleteButton({
  isAdmin,
  onDelete,
}: {
  isAdmin: boolean;
  onDelete: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isAdmin) return null;

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="text-red-600 hover:text-red-700" title="Delete">
        <Trash2 size={16} />
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-xs">
      Delete?
      <button
        onClick={() => startTransition(() => onDelete())}
        disabled={isPending}
        className="font-semibold text-red-600 hover:underline"
      >
        {isPending ? '…' : 'Yes'}
      </button>
      <button onClick={() => setConfirming(false)} className="text-ink/50 hover:underline">
        No
      </button>
    </span>
  );
}