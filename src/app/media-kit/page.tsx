import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbJsonLd } from '@/lib/seo';
import { siteUrl } from '@/lib/site';
import { getMediaKitStats } from '@/queries/settings';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Media Kit',
  description: `Audience and traffic details for ${SITE_NAME}.`,
  alternates: { canonical: '/media-kit' },
  // ⚠️ Once real stats are filled in via /admin/settings, remove the line
  // below so this page becomes indexable — right now it would show
  // placeholder text like "Add your traffic number..." to anyone who
  // finds it via search, which looks unprofessional and reads as thin
  // content to Google.
  robots: { index: false, follow: true },
  openGraph: {
    title: `Media Kit | ${SITE_NAME}`,
    description: `Audience and traffic details for ${SITE_NAME}.`,
  },
};

export const revalidate = 3600;

export default async function MediaKitPage() {
  const stats = await getMediaKitStats();

  const rows = [
    { label: 'Monthly Visitors', value: stats.monthly_visitors },
    { label: 'Monthly Pageviews', value: stats.monthly_pageviews },
    { label: 'Average Session Duration', value: stats.avg_session_duration },
    { label: 'Top Regions', value: stats.top_regions },
  ];

  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Media Kit' }];

  return (
    <PageShell>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <Breadcrumb items={breadcrumbItems} />
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