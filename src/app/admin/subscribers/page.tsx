import { createAdminClient } from "@/lib/supabase/admin";
import { ExportSubscribersButton } from "@/components/admin/ExportSubscribersButton";
import { SubscribersTable } from "@/components/admin/SubscribersTable";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1") || 1;
  const limit = 50;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = createAdminClient();

  // Paginated slice for display
  const { data: subscribers, count } = await supabase
    .from("email_subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  // Full list for export — the button should give the whole list, not just
  // whatever page is on screen. Paginated because Supabase silently caps
  // every query at 1,000 rows.
  const allSubscribers: {
    email: string;
    source: string;
    created_at: string;
  }[] = [];
  const PAGE_SIZE = 1000;
  let offset = 0;
  while (true) {
    const { data: batch } = await supabase
      .from("email_subscribers")
      .select("email, source, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);
    if (!batch || batch.length === 0) break;
    allSubscribers.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / limit));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold">Email Subscribers ({count ?? 0})</h1>
        <ExportSubscribersButton subscribers={allSubscribers} />
      </div>

      <SubscribersTable subscribers={subscribers ?? []} />

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {page > 1 && (
            <a
              href={`/admin/subscribers?page=${page - 1}`}
              className="rounded-md border border-border px-3 py-1.5 hover:border-primary"
            >
              Previous
            </a>
          )}
          <span className="px-2 text-ink/50">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/admin/subscribers?page=${page + 1}`}
              className="rounded-md border border-border px-3 py-1.5 hover:border-primary"
            >
              Next
            </a>
          )}
        </div>
      )}
    </div>
  );
}
