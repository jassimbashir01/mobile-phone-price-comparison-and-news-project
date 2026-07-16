import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { ContactForm } from '@/components/contact/ContactForm';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with the ${SITE_NAME} team.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <PageShell>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      <h1 className="mb-2 text-xl font-bold">Contact Us</h1>
      <p className="mb-6 text-sm text-ink/60">
        Questions, corrections, or partnership inquiries — send us a message and
        we&apos;ll respond as soon as we can.
      </p>
      <div className="max-w-lg">
        <ContactForm />
      </div>
    </PageShell>
  );
}