import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CategoryPageContent } from "@/components/category/CategoryPageContent";
import { filterPhones } from "@/queries/phones";
import { OS_TYPES } from "@/lib/constants";

export const revalidate = 21600;

export function generateStaticParams() {
  return OS_TYPES.map((o) => ({ os: o.slug }));
}

function getOption(slug: string) {
  return OS_TYPES.find((o) => o.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ os: string }>;
}): Promise<Metadata> {
  const { os } = await params;
  const opt = getOption(os);
  if (!opt) return {};
  return {
    title: `${opt.label} in Pakistan`,
    description: `Browse ${opt.label.toLowerCase()} in Pakistan with prices and full specifications.`,
    alternates: { canonical: `/os/${opt.slug}` },
  };
}

export default async function OsPage({
  params,
  searchParams,
}: {
  params: Promise<{ os: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { os } = await params;
  const { page: pageParam } = await searchParams;
  const opt = getOption(os);
  if (!opt) notFound();

  const page = Number(pageParam ?? "1") || 1;
  const limit = 24;

  const filter =
    opt.slug === "android"
      ? { os: "Android" as const }
      : opt.slug === "windows"
        ? { os: "Windows" as const }
        : opt.slug === "feature-phones"
          ? { os: "Feature Phone" as const }
          : { excludeOs: "Feature Phone" as const }; // all-smartphones

  const { phones, total } = await filterPhones({ ...filter, page, limit });

  return (
    <PageShell>
      <CategoryPageContent
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Operating System" },
          { label: opt.label },
        ]}
        title={`${opt.label} in Pakistan`}
        description={`Compare ${opt.label.toLowerCase()} available in Pakistan, with prices and full specifications.`}
        phones={phones}
        total={total}
        page={page}
        limit={limit}
        basePath={`/os/${opt.slug}`}
      />
    </PageShell>
  );
}
