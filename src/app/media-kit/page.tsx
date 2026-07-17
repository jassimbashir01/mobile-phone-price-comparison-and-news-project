import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { getMediaKitStats } from '@/queries/settings';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Media Kit',
  description: `Audience and traffic details for ${SITE_NAME}.`,
  alternates: { canonical: '/media-kit' },
};

export default async function MediaKitPage() {
  const stats = await getMediaKitStats();

  const rows = [
    { label: 'Monthly Visitors', value: stats.monthly_visitors },
    { label: 'Monthly Pageviews', value: stats.monthly_pageviews },
    { label: 'Average Session Duration', value: stats.avg_session_duration },
    { label: 'Top Regions', value: stats.top_regions },
  ];

  return (
    <PageShell>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Media Kit' }]} />
      <h1 className="mb-2 text-xl font-bold">Media Kit</h1>
      <p className="mb-6 text-sm text-ink/60">{stats.audience_description}</p>

      <div className="mb-8 overflow-hidden rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-border last:border-0">
                <th scope="row" className="w-1/3 bg-surface px-4 py-3 text-left font-medium text-ink/60">{r.label}</th>
                <td className="px-4 py-3">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-ink/60">
        Ready to advertise?{' '}
        <Link href="/advertise" className="text-primary hover:underline">
          Get in touch
        </Link>
        .
      </p>
    </PageShell>
  );
}