"use client";

import { bulkDeleteSubscribers } from "@/lib/actions/bulkDelete";
import {
  useBulkSelect,
  BulkDeleteBar,
  SelectAllCheckbox,
  RowCheckbox,
} from "./BulkSelect";

interface Subscriber {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

export function SubscribersTable({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  const ids = subscribers.map((s) => s.id);
  const { selected, allSelected, toggle, toggleAll, clear } =
    useBulkSelect(ids);

  return (
    <>
      <BulkDeleteBar
        selected={selected}
        entityLabel="subscribers"
        onDelete={bulkDeleteSubscribers}
        onClear={clear}
      />

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs text-ink/50">
            <tr>
              <th className="w-8 px-3 py-2">
                <SelectAllCheckbox checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-ink/50">
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2">
                    <RowCheckbox
                      checked={selected.has(s.id)}
                      onChange={() => toggle(s.id)}
                      label={s.email}
                    />
                  </td>
                  <td className="px-3 py-2">{s.email}</td>
                  <td className="px-3 py-2 text-ink/50">{s.source}</td>
                  <td className="px-3 py-2 text-ink/50">
                    {new Date(s.created_at).toLocaleDateString("en-PK")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
