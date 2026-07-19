'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { markMessageRead, deleteMessage } from '@/lib/actions/messages';
import { DeleteButton } from './DeleteButton';
import type { ContactMessage } from '@/types/database';

export function MessageRow({ message, isAdmin }: { message: ContactMessage; isAdmin: boolean }) {
  const router = useRouter();
  const [isRead, setIsRead] = useState(message.is_read);
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function toggleRead() {
    const next = !isRead;
    setIsRead(next);
    startTransition(async () => {
      await markMessageRead(message.id, next);
    });
  }

  const date = new Date(message.created_at).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`rounded-lg border p-4 ${isRead ? 'border-border bg-white' : 'border-primary bg-primary-light/40'}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{message.name}</p>
            <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium uppercase text-ink/50">
              {message.inquiry_type}
            </span>
            {!isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
          </div>
          <a href={`mailto:${message.email}`} className="text-xs text-primary hover:underline">
            {message.email}
          </a>
        </div>
        <p className="text-xs text-ink/40">{date}</p>
      </div>

      {/* Always fully expandable via button now — no longer gated behind
          a character-count threshold that could mismatch visual clipping
          from line-clamp on narrower screens. */}
      <p className={`mt-2 whitespace-pre-wrap text-sm text-ink/80 ${expanded ? '' : 'line-clamp-2'}`}>
        {message.message}
      </p>
      <button onClick={() => setExpanded((v) => !v)} className="mt-1 text-xs text-primary hover:underline">
        {expanded ? 'Show less' : 'Show full message'}
      </button>

      <div className="mt-3 flex items-center gap-3 text-xs">
        <button onClick={toggleRead} disabled={isPending} className="text-primary hover:underline disabled:opacity-50">
          Mark as {isRead ? 'unread' : 'read'}
        </button>
        <DeleteButton
          isAdmin={isAdmin}
          onDelete={async () => {
            await deleteMessage(message.id);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}