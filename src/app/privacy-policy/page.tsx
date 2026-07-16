import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SITE_NAME } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} />
      <h1 className="mb-4 text-xl font-bold">Privacy Policy</h1>
      <div className="space-y-4 text-sm leading-relaxed text-ink/80">
        <p>
          {SITE_NAME} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This page explains what
          information we collect and how it&apos;s used.
        </p>
        <h2 className="text-base font-semibold text-ink">Information We Collect</h2>
        <p>
          When you use our contact form, we collect the name, email address,
          and message you provide, solely to respond to your inquiry.
        </p>
        <h2 className="text-base font-semibold text-ink">Cookies & Advertising</h2>
        <p>
          This site uses Google AdSense to display advertising. Google and
          its partners may use cookies to serve ads based on your prior
          visits to this or other websites. You can opt out of personalized
          advertising by visiting{' '}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Google Ads Settings
          </a>
          .
        </p>
        <h2 className="text-base font-semibold text-ink">Third-Party Services</h2>
        <p>
          We use Supabase for data storage and Cloudinary for image hosting.
          Neither service is used to sell your personal information.
        </p>
        <h2 className="text-base font-semibold text-ink">Contact</h2>
        <p>
          Questions about this policy can be sent via our{' '}
          <a href="/contact" className="text-primary hover:underline">
            contact form
          </a>
          .
        </p>
        <p className="text-xs text-ink/40">
          ⚠️ This is a functional starting point, not legal advice — have a
          lawyer review it against Pakistan&apos;s data protection requirements
          and Google&apos;s current AdSense policy requirements before relying
          on it.
        </p>
      </div>
    </PageShell>
  );
}