import Link from "next/link";
import { getAllOffersAdmin } from "@/queries/admin";
import { getCurrentUserProfile } from "@/lib/auth";
import { OffersTable } from "@/components/admin/OffersTable";
import { AdminPagination } from "@/components/admin/AdminPagination";

export const dynamic = "force-dynamic";

export default async function AdminOffersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1") || 1;
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
        <Link
          href="/admin/offers/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + New Offer
        </Link>
      </div>

      <OffersTable offers={offers} isAdmin={profile?.role === "admin"} />

      <AdminPagination
        basePath="/admin/offers"
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
