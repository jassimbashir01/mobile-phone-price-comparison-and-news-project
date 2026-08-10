import Link from "next/link";
import { getAllNewsAdmin } from "@/queries/admin";
import { getCurrentUserProfile } from "@/lib/auth";
import { NewsTable } from "@/components/admin/NewsTable";
import { AdminPagination } from "@/components/admin/AdminPagination";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1") || 1;
  const limit = 20;

  const [{ news, total }, profile] = await Promise.all([
    getAllNewsAdmin(page, limit),
    getCurrentUserProfile(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">News ({total})</h1>
        <Link
          href="/admin/news/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + New Article
        </Link>
      </div>

      <NewsTable news={news} isAdmin={profile?.role === "admin"} />

      <AdminPagination
        basePath="/admin/news"
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
