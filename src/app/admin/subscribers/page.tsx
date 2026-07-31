import { createAdminClient } from "@/lib/supabase/admin";

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
  const { data: subscribers, count } = await supabase
    .from("email_subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">
        Email Subscribers ({count ?? 0})
      </h1>
      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs text-ink/50">
            <tr>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {(subscribers ?? []).map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2">{s.email}</td>
                <td className="px-3 py-2 text-ink/50">{s.source}</td>
                <td className="px-3 py-2 text-ink/50">
                  {new Date(s.created_at).toLocaleDateString("en-PK")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
