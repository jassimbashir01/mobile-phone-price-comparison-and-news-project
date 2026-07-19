import { EXTENDED_SPEC_GROUPS } from '@/lib/validation/phoneExtendedSpecs';
import { sanitizeRichText } from '@/lib/sanitize';
import { formatPKR, formatUSDFromPKR } from '@/lib/utils';
import type { PhoneExtendedSpecs } from '@/types/database';

interface Row {
  label: string;
  html: string;
}

interface Group {
  label: string;
  rows: Row[];
}

export function ExtendedSpecTable({
  specs,
  pricePkr,
  exchangeRate,
}: {
  specs: PhoneExtendedSpecs | null;
  pricePkr: number | null;
  exchangeRate: number;
}) {
  // Build each group's row list from the same EXTENDED_SPEC_GROUPS
  // metadata the admin form uses, filtering out any field with no value —
  // this is what makes a blank admin field simply not appear as a row.
  const groups: Group[] = EXTENDED_SPEC_GROUPS.map((group) => ({
    label: group.label,
    rows: group.fields
      .map((field) => {
        const raw = specs?.[field.key as keyof PhoneExtendedSpecs] as string | null;
        return raw ? { label: field.label, html: raw } : null;
      })
      .filter((r): r is Row => r !== null),
  })).filter((group) => group.rows.length > 0);

  // Price group is assembled separately from the real price_pkr column —
  // one source of truth, shown here and at the top of the page.
  const priceRows: Row[] = [];
  if (pricePkr != null) {
    priceRows.push({ label: 'Price in Pakistan', html: formatPKR(pricePkr) });
    const usd = formatUSDFromPKR(pricePkr, exchangeRate);
    if (usd) priceRows.push({ label: 'Price in USD', html: usd });
  }
  if (priceRows.length > 0) {
    groups.push({ label: 'Price', rows: priceRows });
  }

  if (groups.length === 0) {
    return <p className="text-sm text-ink/50">Full specifications coming soon.</p>;
  }

  return (
    <div className="overflow-hidden overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <tbody>
          {groups.map((group) =>
            group.rows.map((row, i) => (
              <tr key={`${group.label}-${row.label}`} className="border-b border-border last:border-0">
                {i === 0 && (
                  <th
                    rowSpan={group.rows.length}
                    scope="rowgroup"
                    className="w-1/6 border-r border-border bg-primary-light px-3 py-2 text-left align-top text-xs font-semibold text-primary-dark"
                  >
                    {group.label}
                  </th>
                )}
                <td className="w-1/6 border-r border-border bg-surface px-3 py-2 align-top text-xs font-medium text-ink/60">
                  {row.label}
                </td>
                <td
                  className="rich-content w-4/6 px-3 py-2 text-ink"
                  // Price rows are plain formatted strings, not stored
                  // HTML — safe as-is. Everything else comes from the
                  // admin's rich text editor and is re-sanitized here at
                  // render time, same defense-in-depth pattern already
                  // used by RichContent elsewhere on this page.
                  dangerouslySetInnerHTML={{
                    __html: group.label === 'Price' ? row.html : sanitizeRichText(row.html),
                  }}
                />
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}