import { getAllContactMessagesAdmin } from '@/queries/admin';
import { getCurrentUserProfile } from '@/lib/auth';
import { MessageRow } from '@/components/admin/MessageRow';
import { AdminPagination } from '@/components/admin/AdminPagination';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? '1') || 1;
  const limit = 20;

  const [{ messages, total }, profile] = await Promise.all([
    getAllContactMessagesAdmin(page, limit),
    getCurrentUserProfile(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">
        Messages ({total}) {unreadCount > 0 && <span className="text-primary">({unreadCount} unread on this page)</span>}
      </h1>
      {messages.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-ink/50">
          No messages yet.
        </p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <MessageRow key={m.id} message={m} isAdmin={profile?.role === 'admin'} />
          ))}
        </div>
      )}
      <AdminPagination basePath="/admin/messages" currentPage={page} totalPages={totalPages} />
    </div>
  );
}