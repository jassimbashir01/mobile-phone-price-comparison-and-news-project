"use client";

import { bulkDeleteContactMessages } from "@/lib/actions/bulkDelete";
import { MessageRow } from "./MessageRow";
import {
  useBulkSelect,
  BulkDeleteBar,
  SelectAllCheckbox,
  RowCheckbox,
} from "./BulkSelect";
import type { ContactMessage } from "@/types/database";

export function MessagesList({
  messages,
  isAdmin,
}: {
  messages: ContactMessage[];
  isAdmin: boolean;
}) {
  const ids = messages.map((m) => m.id);
  const { selected, allSelected, toggle, toggleAll, clear } =
    useBulkSelect(ids);

  return (
    <>
      {/* Bulk delete is admin-only server-side, so editors never see the
          controls — showing them would just produce a rejected action. */}
      {isAdmin && (
        <BulkDeleteBar
          selected={selected}
          entityLabel="messages"
          onDelete={bulkDeleteContactMessages}
          onClear={clear}
        />
      )}

      {isAdmin && messages.length > 0 && (
        <label className="mb-2 flex items-center gap-2 text-xs text-ink/50">
          <SelectAllCheckbox checked={allSelected} onChange={toggleAll} />
          Select all on this page
        </label>
      )}

      <div className="space-y-3">
        {messages.map((m) => (
          // The checkbox sits alongside the card rather than inside it, so
          // MessageRow stays untouched and keeps its own layout.
          <div key={m.id} className="flex items-start gap-3">
            {isAdmin && (
              <div className="pt-4">
                <RowCheckbox
                  checked={selected.has(m.id)}
                  onChange={() => toggle(m.id)}
                  label={`message from ${m.name}`}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <MessageRow message={m} isAdmin={isAdmin} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
