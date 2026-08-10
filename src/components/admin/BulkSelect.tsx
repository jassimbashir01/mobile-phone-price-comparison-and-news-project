"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, X } from "lucide-react";
import type { BulkDeleteResult } from "@/lib/actions/bulkDelete";

export function useBulkSelect(pageIds: string[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      // Scoped to the current page only — deliberately not "all matching
      // rows", which would make a mis-click catastrophic at 2,500 phones.
      if (pageIds.every((id) => prev.has(id))) {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      }
      return new Set([...prev, ...pageIds]);
    });
  }

  function clear() {
    setSelected(new Set());
  }

  return { selected, allSelected, toggle, toggleAll, clear };
}

export function SelectAllCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label="Select all rows on this page"
      className="cursor-pointer"
    />
  );
}

export function RowCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={`Select ${label}`}
      className="cursor-pointer"
    />
  );
}

export function BulkDeleteBar({
  selected,
  entityLabel,
  onDelete,
  onClear,
}: {
  selected: Set<string>;
  /** Plural noun shown in the bar and confirmation, e.g. "phones" */
  entityLabel: string;
  onDelete: (ids: string[]) => Promise<BulkDeleteResult>;
  onClear: () => void;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const count = selected.size;
  if (count === 0) return null;

  async function handleDelete() {
    setError("");
    setDeleting(true);
    try {
      const result = await onDelete([...selected]);
      if (result.failed.length > 0) {
        setError(
          `${result.deleted} deleted, ${result.failed.length} failed: ${result.failed[0].error}`,
        );
        setDeleting(false);
        return;
      }
      onClear();
      setConfirming(false);
      setTyped("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="sticky top-0 z-20 mb-3 rounded-lg border border-primary bg-primary-light p-3">
      {!confirming ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-primary-dark">
            {count} {count === 1 ? entityLabel.replace(/s$/, "") : entityLabel}{" "}
            selected
          </span>
          <button
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            <Trash2 size={14} />
            Delete selected
          </button>
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
          >
            <X size={14} />
            Clear
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-red-700">
            Permanently delete {count} {entityLabel}?
          </p>
          <p className="text-xs text-ink/60">
            This cannot be undone. Associated images will also be removed from
            Cloudinary. Type <strong>DELETE</strong> to confirm.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="DELETE"
              className="w-32 rounded-md border border-border px-2 py-1.5 text-sm"
            />
            <button
              onClick={handleDelete}
              disabled={typed !== "DELETE" || deleting}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40"
            >
              {deleting ? "Deleting…" : `Delete ${count}`}
            </button>
            <button
              onClick={() => {
                setConfirming(false);
                setTyped("");
                setError("");
              }}
              className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}
