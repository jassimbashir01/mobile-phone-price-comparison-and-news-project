"use client";

import Link from "next/link";
import { bulkDeletePhones } from "@/lib/actions/bulkDelete";
import { PhoneDeleteButton } from "./PhoneDeleteButton";
import {
  useBulkSelect,
  BulkDeleteBar,
  SelectAllCheckbox,
  RowCheckbox,
} from "./BulkSelect";
import { formatPKR } from "@/lib/utils";
import type { AdminPhoneListItem } from "@/queries/admin";

export function PhonesTable({
  phones,
  isAdmin,
}: {
  phones: AdminPhoneListItem[];
  isAdmin: boolean;
}) {
  const ids = phones.map((p) => p.id);
  const { selected, allSelected, toggle, toggleAll, clear } =
    useBulkSelect(ids);

  return (
    <>
      {/* Bulk delete is admin-only server-side, so editors never see the
          controls — showing them would just produce a rejected action. */}
      {isAdmin && (
        <BulkDeleteBar
          selected={selected}
          entityLabel="phones"
          onDelete={bulkDeletePhones}
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
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Brand</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {phones.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="px-3 py-8 text-center text-ink/50"
                >
                  No phones found.
                </td>
              </tr>
            ) : (
              phones.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  {isAdmin && (
                    <td className="px-3 py-2">
                      <RowCheckbox
                        checked={selected.has(p.id)}
                        onChange={() => toggle(p.id)}
                        label={p.name}
                      />
                    </td>
                  )}
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2 text-ink/50">{p.brand?.name}</td>
                  <td className="px-3 py-2">{formatPKR(p.price_pkr)}</td>
                  <td className="px-3 py-2">{p.status}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/phones/${p.id}/edit`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <PhoneDeleteButton
                        id={p.id}
                        slug={p.slug}
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
