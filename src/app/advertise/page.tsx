import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { AdvertiseForm } from '@/components/advertise/AdvertiseForm';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Advertise With Us',
  description: `Reach mobile phone buyers across Pakistan by advertising on ${SITE_NAME}.`,
  alternates: { canonical: '/advertise' },
};

const PLACEMENTS = [
  { title: 'Homepage Banner', description: 'A prominent banner near the top of the homepage, seen by every visitor before they browse.' },
  { title: 'Sidebar Banner', description: 'Displayed in the sidebar across every category and phone page — sitewide, sticky visibility.' },
  { title: 'Featured Phone Slot', description: "Your phone pinned in one of the homepage's featured sections, above the automatic listings." },
  { title: 'Featured Price Range Section', description: "Pin your phone at the top of a specific price-range section on the homepage." },
  { title: 'Brand Showcase', description: 'Prominent placement for your brand across relevant category and brand pages.' },
];

export default function AdvertisePage() {
  return (
    <PageShell>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Advertise With Us' }]} />
      <h1 className="mb-2 text-xl font-bold">Advertise With Us</h1>
      <p className="mb-6 text-sm text-ink/60">
        Reach mobile phone buyers actively comparing prices and specs across
        Pakistan. See our{' '}
        <Link href="/media-kit" className="text-primary hover:underline">
          Media Kit
        </Link>{' '}
        for audience details, or fill out the form below and we&apos;ll get back
        to you.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLACEMENTS.map((p) => (
          <div key={p.title} className="rounded-lg border border-border bg-white p-4">
            <h2 className="mb-1 text-sm font-bold">{p.title}</h2>
            <p className="text-xs text-ink/60">{p.description}</p>
          </div>
        ))}
      </div>

      <div className="max-w-lg">
        <AdvertiseForm />
      </div>
    </PageShell>
  );
}