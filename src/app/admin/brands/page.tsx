import Link from 'next/link';
import { getAllBrandsAdminPaginated } from '@/queries/admin';
import { getCurrentUserProfile } from '@/lib/auth';
import { BrandDeleteButton } from '@/components/admin/BrandDeleteButton';
import { AdminPagination } from '@/components/admin/AdminPagination';

export const dynamic = 'force-dynamic';

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? '1') || 1;
  const limit = 20;

  const [{ brands, total }, profile] = await Promise.all([
    getAllBrandsAdminPaginated(page, limit),
    getCurrentUserProfile(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Brands ({total})</h1>
        <Link href="/admin/brands/new" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          + New Brand
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs text-ink/50">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Slug</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2">{b.name}</td>
                <td className="px-3 py-2 text-ink/50">{b.slug}</td>
                <td className="px-3 py-2">{b.is_active ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/brands/${b.id}/edit`} className="text-primary hover:underline">Edit</Link>
                    <BrandDeleteButton id={b.id} slug={b.slug} isAdmin={profile?.role === 'admin'} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminPagination basePath="/admin/brands" currentPage={page} totalPages={totalPages} />
    </div>
  );
}