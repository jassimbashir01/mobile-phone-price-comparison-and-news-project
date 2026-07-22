import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Stolen & PTA Phone Check Guide",
  description:
    "How to check if a phone is PTA registered or reported stolen in Pakistan, using your IMEI, before you buy.",
  alternates: { canonical: "/stolen-phone-guide" },
  openGraph: {
    title: "Stolen & PTA Phone Check Guide",
    description:
      "How to check if a phone is PTA registered or reported stolen in Pakistan, using your IMEI, before you buy.",
  },
};

export const revalidate = 86400;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 rounded-lg border border-border bg-white p-5">
      <h2 className="mb-2 text-base font-bold">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-ink/80">
        {children}
      </div>
    </section>
  );
}

export default function StolenPhoneGuidePage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Stolen Phone Guide" },
  ];

  return (
    <PageShell>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="mb-2 text-xl font-bold">Stolen & PTA Phone Check Guide</h1>
      <p className="mb-6 text-sm text-ink/60">
        Before buying any used phone in Pakistan, always check its IMEI status.
        A blocked or stolen IMEI cannot be used on any local network, no matter
        who is selling it.
      </p>

      <Section title="Step 1: Find your IMEI">
        <p>
          Dial <strong>*#06#</strong> on the phone to instantly display its IMEI
          number(s). Dual-SIM and eSIM phones show two IMEI numbers —
          you&apos;ll need both.
        </p>
      </Section>

      <Section title="Step 2: Check PTA/DIRBS status via SMS">
        <p>
          Type the 15-digit IMEI with no spaces or dashes and send it as an SMS
          to <strong>8484</strong>. You&apos;ll get a reply within a few minutes
          with one of these statuses:
        </p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            <strong>Compliant</strong> — fully PTA-registered, safe to use.
          </li>
          <li>
            <strong>GSMA Valid (Non-Compliant)</strong> — a genuine device not
            yet registered; you can register and pay tax via DIRBS.
          </li>
          <li>
            <strong>Non-Compliant</strong> — the IMEI appears duplicated or
            invalid.
          </li>
          <li>
            <strong>Stolen / Blocked</strong> — reported stolen or lost by its
            original owner. This cannot be unblocked by paying any tax — do not
            buy a phone with this status.
          </li>
        </ul>
      </Section>

      <Section title="Step 3: Register an imported or new phone">
        <p>
          If your phone shows as non-compliant, register it at{" "}
          <a
            href="https://dirbs.pta.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            dirbs.pta.gov.pk
          </a>{" "}
          within 60 days of first using it on a local SIM, and pay the
          applicable customs duty shown in the portal. Overseas Pakistanis and
          foreign visitors are generally eligible for a longer temporary
          registration window — check the portal for current terms, since exact
          allowances can change.
        </p>
      </Section>

      <Section title="Check how many SIMs are registered to your CNIC">
        <p>
          Send your CNIC number as an SMS to <strong>668</strong> to see how
          many mobile SIMs are currently registered against it — useful for
          spotting SIMs you didn&apos;t register yourself.
        </p>
      </Section>

      <Section title="If your phone is lost or stolen">
        <ol className="ml-4 list-decimal space-y-1">
          <li>File a police report (FIR) as soon as possible.</li>
          <li>Contact your mobile network operator to block the SIM.</li>
          <li>
            Report the IMEI as lost/stolen through PTA&apos;s Complaint
            Management System so it gets blacklisted network-wide — this is what
            prevents anyone else from using the device on a Pakistani network,
            even with a different SIM.
          </li>
        </ol>
      </Section>

      <Section title="Buying a used phone? Do this first">
        <p>
          Always ask the seller to dial *#06# in front of you, then check that
          exact IMEI via SMS to 8484 before paying. A &quot;Stolen/Blocked&quot;
          reply means the phone is worthless for network use in Pakistan — walk
          away regardless of the price.
        </p>
      </Section>

      <p className="text-xs text-ink/40">
        Browse{" "}
        <Link
          href="/price/all-mobiles"
          className="text-primary hover:underline"
        >
          all mobile phones
        </Link>{" "}
        or check the latest{" "}
        <Link href="/news" className="text-primary hover:underline">
          phone news
        </Link>{" "}
        on MobileWala.
      </p>
    </PageShell>
  );
}
