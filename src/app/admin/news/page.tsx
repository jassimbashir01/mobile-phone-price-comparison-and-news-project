import Link from 'next/link';
import { getAllNewsAdmin } from '@/queries/admin';
import { getCurrentUserProfile } from '@/lib/auth';
import { NewsDeleteButton } from '@/components/admin/NewsDeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminNewsPage() {
  const [news, profile] = await Promise.all([getAllNewsAdmin(), getCurrentUserProfile()]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">News</h1>
        <Link href="/admin/news/new" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          + New Article
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface text-left text-xs text-ink/50">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Published</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((n) => (
              <tr key={n.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2">{n.title}</td>
                <td className="px-3 py-2">{n.is_published ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/news/${n.id}/edit`} className="text-primary hover:underline">Edit</Link>
                    <NewsDeleteButton id={n.id} slug={n.slug} isAdmin={profile?.role === 'admin'} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}