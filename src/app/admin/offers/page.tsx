import Link from 'next/link';
import { getAllOffersAdmin } from '@/queries/admin';
import { getCurrentUserProfile } from '@/lib/auth';
import { OfferDeleteButton } from '@/components/admin/OfferDeleteButton';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { formatPKR } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminOffersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? '1') || 1;
  const limit = 20;

  const [{ offers, total }, profile] = await Promise.all([
    getAllOffersAdmin(page, limit),
    getCurrentUserProfile(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Offers ({total})</h1>
        <Link href="/admin/offers/new" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          + New Offer
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs text-ink/50">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2">{o.title}</td>
                <td className="px-3 py-2 text-ink/50">{o.offer_type === 'affiliate' ? 'Affiliate' : 'Local Deal'}</td>
                <td className="px-3 py-2">{formatPKR(o.price_pkr)}</td>
                <td className="px-3 py-2">{o.is_active ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/offers/${o.id}/edit`} className="text-primary hover:underline">Edit</Link>
                    <OfferDeleteButton id={o.id} isAdmin={profile?.role === 'admin'} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminPagination basePath="/admin/offers" currentPage={page} totalPages={totalPages} />
    </div>
  );
}