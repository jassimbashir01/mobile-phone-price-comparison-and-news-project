"use client";

import { Download } from "lucide-react";

interface Subscriber {
  email: string;
  source: string;
  created_at: string;
}

export function ExportSubscribersButton({ subscribers }: { subscribers: Subscriber[] }) {
  function handleExport() {
    // RFC 4180: wrap every field in quotes and double any internal quote,
    // so a comma or quote inside a value can't break the column layout.
    const escape = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;

    const rows = [
      ["Email", "Source", "Subscribed"].map(escape).join(","),
      ...subscribers.map((s) =>
        [
          s.email,
          s.source,
          new Date(s.created_at).toISOString().split("T")[0], // YYYY-MM-DD sorts correctly in Excel
        ]
          .map(escape)
          .join(","),
      ),
    ].join("\r\n");

    // BOM so Excel reads it as UTF-8 — without it, non-ASCII characters in
    // an email or source get mangled on open.
    const blob = new Blob(["\uFEFF" + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `mobilewala-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      disabled={subscribers.length === 0}
      className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-light disabled:opacity-50"
    >
      <Download size={16} />
      Export CSV ({subscribers.length})
    </button>
  );
}