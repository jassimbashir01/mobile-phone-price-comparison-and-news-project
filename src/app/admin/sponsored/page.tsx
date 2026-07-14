/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllPhonesAdmin } from '@/queries/admin';
import { SponsoredToggleRow } from '@/components/admin/SponsoredToggleRow';

export const dynamic = 'force-dynamic';

export default async function AdminSponsoredPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { phones } = await getAllPhonesAdmin({ limit: 100, search: q });

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Sponsored Phones</h1>
      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search phones…"
          className="w-full max-w-xs rounded-md border border-border px-3 py-2 text-sm"
        />
      </form>
      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs text-ink/50">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Brand</th>
              <th className="px-3 py-2">Sponsored</th>
            </tr>
          </thead>
          <tbody>
            {phones.map((p: any) => (
              <SponsoredToggleRow
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                brandName={p.brand?.name}
                initialSponsored={p.is_sponsored}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}