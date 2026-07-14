/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { getAllPhonesAdmin } from '@/queries/admin';
import { getCurrentUserProfile } from '@/lib/auth';
import { Pagination } from '@/components/ui/Pagination';
import { PhoneDeleteButton } from '@/components/admin/PhoneDeleteButton';
import { formatPKR } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminPhonesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const page = Number(pageParam ?? '1') || 1;
  const limit = 20;

  const [{ phones, total }, profile] = await Promise.all([
    getAllPhonesAdmin({ page, limit, search: q }),
    getCurrentUserProfile(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold">Phones ({total})</h1>
        <Link href="/admin/phones/new" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          + New Phone
        </Link>
      </div>

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
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {phones.map((p: any) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2 text-ink/50">{p.brand?.name}</td>
                <td className="px-3 py-2">{formatPKR(p.price_pkr)}</td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/phones/${p.id}/edit`} className="text-primary hover:underline">Edit</Link>
                    <PhoneDeleteButton id={p.id} slug={p.slug} isAdmin={profile?.role === 'admin'} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination basePath={q ? `/admin/phones?q=${q}` : '/admin/phones'} currentPage={page} totalPages={totalPages} />
    </div>
  );
}