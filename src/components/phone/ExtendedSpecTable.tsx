import { EXTENDED_SPEC_GROUPS } from "@/lib/validation/phoneExtendedSpecs";
import { sanitizeRichText } from "@/lib/sanitize";
import { formatPKR, formatUSDFromPKR } from "@/lib/utils";
import type { PhoneExtendedSpecs } from "@/types/database";

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
  const groups: Group[] = EXTENDED_SPEC_GROUPS.map((group) => {
    const rows: Row[] = [];
    for (const field of group.fields) {
      const raw = specs?.[field.key as keyof PhoneExtendedSpecs] as
        | string
        | null;
      if (raw) {
        // Explicitly widened to `string` here — field.label is otherwise
        // inferred as a narrow string-literal union from EXTENDED_SPEC_GROUPS,
        // which doesn't match Row's `label: string` and breaks both the
        // array's type and the later `r is Row` predicate.
        rows.push({ label: field.label as string, html: raw });
      }
    }
    return { label: group.label as string, rows };
  }).filter((group) => group.rows.length > 0);

  const priceRows: Row[] = [];
  if (pricePkr != null) {
    priceRows.push({ label: "Price in Pakistan", html: formatPKR(pricePkr) });
    const usd = formatUSDFromPKR(pricePkr, exchangeRate);
    if (usd) priceRows.push({ label: "Price in USD", html: usd });
  }
  if (priceRows.length > 0) {
    groups.push({ label: "Price", rows: priceRows });
  }

  if (groups.length === 0) {
    return (
      <p className="text-sm text-ink/50">Full specifications coming soon.</p>
    );
  }

  return (
    <div className="overflow-hidden overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <tbody>
          {groups.map((group) =>
            group.rows.map((row, i) => (
              <tr
                key={`${group.label}-${row.label}`}
                className="border-b border-border last:border-0"
              >
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
                  dangerouslySetInnerHTML={{
                    __html:
                      group.label === "Price"
                        ? row.html
                        : sanitizeRichText(row.html),
                  }}
                />
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
