import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE_NAME } from "@/lib/site-config";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${SITE_NAME} team.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact Us | ${SITE_NAME}`,
    description: `Get in touch with the ${SITE_NAME} team.`,
  },
};

export default function ContactPage() {
  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Contact" }];
  return (
    <PageShell>
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems, siteUrl)} />
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="mb-2 text-xl font-bold">Contact Us</h1>
      <p className="mb-6 text-sm text-ink/60">
        Questions, corrections, or partnership inquiries — send us a message and
        we&apos;ll respond as soon as we can.
      </p>
      <div className="max-w-lg">
        <ContactForm />
        <p className="mt-4 rounded-lg border border-border bg-primary-light/40 p-4 text-sm text-ink/80">
          Run a mobile shop or represent a mobile brand? Want your deals
          featured?{" "}
          <Link
            href="/advertise"
            className="font-semibold text-primary hover:underline"
          >
            Advertise with us
          </Link>
          .
        </p>
      </div>
    </PageShell>
  );
}
