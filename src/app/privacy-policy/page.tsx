import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: 'Privacy Policy',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy',
  },
};

export const revalidate = 86400; // Static content — cache aggressively

// Update this date manually whenever the policy text actually changes.
const LAST_UPDATED = "July 22, 2026";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-6 scroll-mt-20">
      <h2 className="mb-2 text-base font-bold text-ink">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink/80">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <h1 className="mb-1 text-xl font-bold">Privacy Policy</h1>
      <p className="mb-6 text-xs text-ink/50">Last updated: {LAST_UPDATED}</p>

      <div className="mb-8 rounded-lg border border-border bg-white p-5">
        <Section id="intro" title="1. Introduction">
          <p>
            {SITE_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
            operates this website to help visitors compare mobile phone prices
            and specifications in Pakistan. This Privacy Policy explains what
            information we collect, how we use it, who we share it with, and the
            choices and rights available to you. By using this website, you
            agree to the practices described here.
          </p>
        </Section>

        <Section id="data-we-collect" title="2. Information We Collect">
          <p>
            <strong>Information you provide directly:</strong> when you use our
            contact form, advertising inquiry form, or otherwise email us, we
            collect your name, email address, and the content of your message,
            including any company or business details you choose to share.
          </p>
          <p>
            <strong>Information collected automatically:</strong> like most
            websites, our hosting, analytics, and advertising providers
            automatically collect standard technical data when you visit —
            including your IP address, browser type, device type, pages visited,
            referring website, and approximate location derived from your IP
            address. This is collected via cookies and similar technologies
            described in Section 5.
          </p>
          <p>
            <strong>We do not knowingly collect:</strong> payment card details
            (we do not process payments directly on this site), government
            identification numbers, or other sensitive personal data, unless you
            voluntarily include such information in a message to us — which we
            ask you not to do.
          </p>
        </Section>

        <Section id="how-we-use" title="3. How We Use Your Information">
          <ul className="ml-4 list-disc space-y-1">
            <li>
              To respond to contact form submissions and advertising inquiries
            </li>
            <li>
              To operate, maintain, and improve the website and its content
            </li>
            <li>
              To understand aggregate visitor behavior through analytics, so we
              can improve site performance and content
            </li>
            <li>
              To display relevant advertising through Google AdSense and display
              our own paid placements (see Section 6)
            </li>
            <li>To comply with legal obligations and enforce our terms</li>
          </ul>
        </Section>

        <Section id="legal-basis" title="4. Legal Basis for Processing">
          <p>
            Where applicable law requires a stated legal basis (such as under
            the EU/UK GDPR for visitors from those regions), we rely on: your
            consent (for non-essential cookies and personalized advertising,
            which you can decline), our legitimate interest in operating and
            improving the website, and compliance with legal obligations where
            relevant.
          </p>
        </Section>

        <Section id="cookies" title="5. Cookies & Similar Technologies">
          <p>
            We and our third-party partners (see Section 6) use cookies and
            similar technologies to operate the site, remember preferences,
            measure traffic, and serve advertising. You can control cookies
            through your browser settings, including blocking or deleting them —
            though some site features may not function correctly without them.
          </p>
          <p>
            To manage how Google personalizes ads shown to you across the web,
            including on this site, visit{" "}
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
        </Section>

        <Section id="third-parties" title="6. Third-Party Services">
          <p>
            We use the following third-party services, each of which processes
            data under its own privacy policy:
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <strong>Supabase</strong> — database and authentication
              infrastructure for storing site content and contact submissions.
            </li>
            <li>
              <strong>Cloudinary</strong> — image hosting and delivery.
            </li>
            <li>
              <strong>Vercel</strong> — website hosting and content delivery.
            </li>
            <li>
              <strong>Google AdSense</strong> — displays advertising and may use
              cookies to show ads based on your visits to this and other sites.
            </li>
            <li>
              <strong>Google Analytics / Google Tag Manager</strong> (where
              enabled) — traffic and usage analytics.
            </li>
          </ul>
          <p>
            None of these providers are permitted by us to sell your personal
            information. Some advertising and analytics providers may process
            data outside Pakistan, including in the United States and the
            European Union, under their own respective safeguards.
          </p>
        </Section>

        <Section id="sharing" title="7. How We Share Information">
          <p>
            We do not sell your personal information. We share information only:
            with the service providers listed in Section 6, each acting on our
            behalf; when required by law, legal process, or to protect the
            rights, property, or safety of {SITE_NAME}, our users, or the
            public; or with your explicit consent.
          </p>
        </Section>

        <Section id="retention" title="8. Data Retention">
          <p>
            Contact form and advertising inquiry submissions are retained for as
            long as necessary to respond to your inquiry and for a reasonable
            period afterward for record-keeping, unless you request earlier
            deletion. Automatically collected analytics data is retained
            according to the retention settings of the respective third-party
            provider (e.g. Google Analytics&apos; default retention periods).
          </p>
        </Section>

        <Section id="your-rights" title="9. Your Rights">
          <p>Depending on your location, you may have the right to:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              Request access to the personal information we hold about you
            </li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to or restrict certain processing</li>
            <li>
              Withdraw consent at any time, where processing is based on consent
            </li>
            <li>Opt out of personalized advertising (see Section 5)</li>
          </ul>
          <p>
            To exercise any of these rights, contact us using the details in
            Section 13. We will respond within a reasonable timeframe and in
            accordance with applicable law.
          </p>
        </Section>

        <Section id="international" title="10. International Data Transfers">
          <p>
            Because we use international hosting, analytics, and advertising
            providers, your information may be processed in countries other than
            your own, including Pakistan, the United States, and countries
            within the European Economic Area. Where required, these providers
            maintain appropriate safeguards for such transfers under their own
            compliance frameworks (such as Standard Contractual Clauses under
            GDPR).
          </p>
        </Section>

        <Section id="children" title="11. Children's Privacy">
          <p>
            This website is not directed at children under 13 (or the relevant
            minimum age in your jurisdiction), and we do not knowingly collect
            personal information from children. If you believe a child has
            provided us with personal information, please contact us so we can
            delete it.
          </p>
        </Section>

        <Section id="security" title="12. Data Security">
          <p>
            We use reasonable administrative and technical safeguards to protect
            the information we hold, including access controls and encrypted
            connections. However, no method of transmission or storage over the
            internet is completely secure, and we cannot guarantee absolute
            security.
          </p>
        </Section>

        <Section id="contact" title="13. Contact Us">
          <p>
            Questions about this Privacy Policy, or requests relating to your
            personal information, can be sent via our{" "}
            <a href="/contact" className="text-primary hover:underline">
              contact form
            </a>
            .
          </p>
        </Section>

        <Section id="changes" title="14. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or for legal, operational, or regulatory
            reasons. The &quot;Last updated&quot; date at the top of this page
            reflects the most recent revision. Continued use of the website
            after changes take effect constitutes acceptance of the revised
            policy.
          </p>
        </Section>
      </div>

      {/* <p className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-xs leading-relaxed text-ink/70">
        ⚠️ <strong>Not legal advice.</strong> This policy is a thorough,
        good-faith starting point covering standard categories under
        frameworks including GDPR and general international best practice,
        but Pakistan&apos;s data protection legislation has been through several
        draft/enactment stages and specific current requirements should be
        confirmed independently. Have a qualified lawyer review this policy
        against current Pakistani law and any other jurisdictions your
        visitors come from before relying on it as a compliance document.
      </p> */}
    </PageShell>
  );
}
