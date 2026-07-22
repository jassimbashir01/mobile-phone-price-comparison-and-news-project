import { EXTENDED_SPEC_GROUPS } from '@/lib/validation/phoneExtendedSpecs';
import { sanitizeRichText } from '@/lib/sanitize';
import { formatPKR } from '@/lib/utils';
import type { PhoneExtendedSpecs } from '@/types/database';

interface Row {
  label: string;
  a: string;
  b: string;
  differs: boolean;
}

interface Group {
  label: string;
  rows: Row[];
}

function plainText(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function ExtendedCompareSpecTable({
  phoneAName,
  phoneBName,
  priceAPkr,
  priceBPkr,
  specsA,
  specsB,
}: {
  phoneAName: string;
  phoneBName: string;
  priceAPkr: number | null;
  priceBPkr: number | null;
  specsA: PhoneExtendedSpecs | null;
  specsB: PhoneExtendedSpecs | null;
}) {
  const groups: Group[] = [];

  // Price comes from the real, single-source-of-truth field — same
  // reasoning as ExtendedSpecTable on the individual phone page — not
  // duplicated into the extended-specs system.
  if (priceAPkr != null || priceBPkr != null) {
    groups.push({
      label: 'Price',
      rows: [
        {
          label: 'Price in Pakistan',
          a: priceAPkr != null ? formatPKR(priceAPkr) : '—',
          b: priceBPkr != null ? formatPKR(priceBPkr) : '—',
          differs: priceAPkr !== priceBPkr,
        },
      ],
    });
  }

  for (const group of EXTENDED_SPEC_GROUPS) {
    const rows: Row[] = [];
    for (const field of group.fields) {
      const rawA = specsA?.[field.key as keyof PhoneExtendedSpecs] as string | null;
      const rawB = specsB?.[field.key as keyof PhoneExtendedSpecs] as string | null;
      if (!rawA && !rawB) continue;

      const cleanA = rawA ? sanitizeRichText(rawA) : '';
      const cleanB = rawB ? sanitizeRichText(rawB) : '';
      const differs = plainText(cleanA) !== plainText(cleanB);

      rows.push({ label: field.label, a: cleanA, b: cleanB, differs });
    }
    if (rows.length > 0) {
      groups.push({ label: group.label, rows });
    }
  }

  if (groups.length === 0) {
    return (
      <p className="mt-6 rounded-lg border border-dashed border-border p-6 text-center text-sm text-ink/50">
        Full specifications aren&apos;t available yet for one or both of these phones.
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-primary-light">
            <th className="w-1/6 px-3 py-2 text-left text-xs font-semibold text-primary-dark">Spec</th>
            <th className="w-1/6 px-3 py-2 text-left text-xs font-semibold text-primary-dark">Detail</th>
            <th className="w-1/3 px-3 py-2 text-left text-xs font-semibold text-primary-dark">{phoneAName}</th>
            <th className="w-1/3 px-3 py-2 text-left text-xs font-semibold text-primary-dark">{phoneBName}</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) =>
            group.rows.map((row, i) => (
              <tr key={`${group.label}-${row.label}`} className="border-b border-border last:border-0">
                {i === 0 && (
                  <th
                    rowSpan={group.rows.length}
                    scope="rowgroup"
                    className="border-r border-border bg-primary-light px-3 py-2 text-left align-top text-xs font-semibold text-primary-dark"
                  >
                    {group.label}
                  </th>
                )}
                <td className="border-r border-border bg-surface px-3 py-2 align-top text-xs font-medium text-ink/60">
                  {row.label}
                </td>
                <td
                  className={`rich-content px-3 py-2 align-top ${row.differs ? 'bg-accent/10 font-medium' : ''}`}
                  dangerouslySetInnerHTML={{ __html: row.a || '—' }}
                />
                <td
                  className={`rich-content px-3 py-2 align-top ${row.differs ? 'bg-accent/10 font-medium' : ''}`}
                  dangerouslySetInnerHTML={{ __html: row.b || '—' }}
                />
              </tr>
            ))
          )}
        </tbody>
      </table>
      <p className="border-t border-border bg-surface px-3 py-2 text-[11px] text-ink/40">
        Highlighted cells indicate a difference between the two phones.
      </p>
    </div>
  );
}