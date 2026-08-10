"use client";

import Link from "next/link";
import { bulkDeleteNews } from "@/lib/actions/bulkDelete";
import { NewsDeleteButton } from "./NewsDeleteButton";
import {
  useBulkSelect,
  BulkDeleteBar,
  SelectAllCheckbox,
  RowCheckbox,
} from "./BulkSelect";
import type { News } from "@/types/database";

export function NewsTable({
  news,
  isAdmin,
}: {
  news: News[];
  isAdmin: boolean;
}) {
  const ids = news.map((n) => n.id);
  const { selected, allSelected, toggle, toggleAll, clear } =
    useBulkSelect(ids);

  return (
    <>
      {/* Bulk delete is admin-only server-side, so editors never see the
          controls — showing them would just produce a rejected action. */}
      {isAdmin && (
        <BulkDeleteBar
          selected={selected}
          entityLabel="articles"
          onDelete={bulkDeleteNews}
          onClear={clear}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs text-ink/50">
            <tr>
              {isAdmin && (
                <th className="w-8 px-3 py-2">
                  <SelectAllCheckbox
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Published</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 4 : 3}
                  className="px-3 py-8 text-center text-ink/50"
                >
                  No articles yet.
                </td>
              </tr>
            ) : (
              news.map((n) => (
                <tr key={n.id} className="border-b border-border last:border-0">
                  {isAdmin && (
                    <td className="px-3 py-2">
                      <RowCheckbox
                        checked={selected.has(n.id)}
                        onChange={() => toggle(n.id)}
                        label={n.title}
                      />
                    </td>
                  )}
                  <td className="px-3 py-2">{n.title}</td>
                  <td className="px-3 py-2">{n.is_published ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/news/${n.id}/edit`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <NewsDeleteButton
                        id={n.id}
                        slug={n.slug}
                        isAdmin={isAdmin}
                      />
                    </div>
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
