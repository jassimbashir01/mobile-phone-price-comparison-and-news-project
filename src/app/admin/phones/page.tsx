import Link from "next/link";
import { getAllPhonesAdmin } from "@/queries/admin";
import { getCurrentUserProfile } from "@/lib/auth";
import { Pagination } from "@/components/ui/Pagination";
import { PhonesTable } from "@/components/admin/PhonesTable";

export const dynamic = "force-dynamic";

export default async function AdminPhonesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page: pageParam, q } = await searchParams;
  const page = Number(pageParam ?? "1") || 1;
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
        <Link
          href="/admin/phones/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
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

      <PhonesTable phones={phones} isAdmin={profile?.role === "admin"} />

      <Pagination
        basePath={
          q ? `/admin/phones?q=${encodeURIComponent(q)}` : "/admin/phones"
        }
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
