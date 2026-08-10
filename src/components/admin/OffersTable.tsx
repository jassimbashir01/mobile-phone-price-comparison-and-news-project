"use client";

import Link from "next/link";
import { bulkDeleteOffers } from "@/lib/actions/bulkDelete";
import { OfferDeleteButton } from "./OfferDeleteButton";
import {
  useBulkSelect,
  BulkDeleteBar,
  SelectAllCheckbox,
  RowCheckbox,
} from "./BulkSelect";
import { formatPKR } from "@/lib/utils";
import type { Offer } from "@/types/database";

export function OffersTable({
  offers,
  isAdmin,
}: {
  offers: Offer[];
  isAdmin: boolean;
}) {
  const ids = offers.map((o) => o.id);
  const { selected, allSelected, toggle, toggleAll, clear } =
    useBulkSelect(ids);

  return (
    <>
      {/* Bulk delete is admin-only server-side, so editors never see the
          controls — showing them would just produce a rejected action. */}
      {isAdmin && (
        <BulkDeleteBar
          selected={selected}
          entityLabel="offers"
          onDelete={bulkDeleteOffers}
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
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="px-3 py-8 text-center text-ink/50"
                >
                  No offers yet.
                </td>
              </tr>
            ) : (
              offers.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  {isAdmin && (
                    <td className="px-3 py-2">
                      <RowCheckbox
                        checked={selected.has(o.id)}
                        onChange={() => toggle(o.id)}
                        label={o.title}
                      />
                    </td>
                  )}
                  <td className="px-3 py-2">{o.title}</td>
                  <td className="px-3 py-2 text-ink/50">
                    {o.offer_type === "affiliate" ? "Affiliate" : "Local Deal"}
                  </td>
                  <td className="px-3 py-2">{formatPKR(o.price_pkr)}</td>
                  <td className="px-3 py-2">{o.is_active ? "Yes" : "No"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/offers/${o.id}/edit`}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <OfferDeleteButton id={o.id} isAdmin={isAdmin} />
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
