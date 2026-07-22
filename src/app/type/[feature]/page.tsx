import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CategoryPageContent } from "@/components/category/CategoryPageContent";
import { filterPhones } from "@/queries/phones";
import { FEATURE_TYPES } from "@/lib/constants";

export const revalidate = 21600;

export function generateStaticParams() {
  return FEATURE_TYPES.map((f) => ({ feature: f.slug }));
}

function getOption(slug: string) {
  return FEATURE_TYPES.find((f) => f.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ feature: string }>;
}): Promise<Metadata> {
  const { feature } = await params;
  const opt = getOption(feature);
  if (!opt) return {};
  return {
    title: `${opt.label} Mobile Phones in Pakistan`,
    description: `Browse ${opt.label.toLowerCase()} mobile phones in Pakistan with prices and full specifications.`,
    alternates: { canonical: `/type/${opt.slug}` },
  };
}

export default async function TypePage({
  params,
  searchParams,
}: {
  params: Promise<{ feature: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { feature } = await params;
  const { page: pageParam } = await searchParams;
  const opt = getOption(feature);
  if (!opt) notFound();

  const page = Number(pageParam ?? "1") || 1;
  const limit = 24;
  const { phones, total } = await filterPhones({
    feature: opt.column,
    page,
    limit,
  });

  return (
    <PageShell>
      <CategoryPageContent
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Type" },
          { label: opt.label },
        ]}
        title={`${opt.label} in Pakistan`}
        description={`Compare ${opt.label.toLowerCase()} available in Pakistan, with prices and full specifications.`}
        phones={phones}
        total={total}
        page={page}
        limit={limit}
        basePath={`/type/${opt.slug}`}
      />
    </PageShell>
  );
}
