import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CategoryPageContent } from "@/components/category/CategoryPageContent";
import { filterPhones } from "@/queries/phones";
import { SCREEN_SIZES } from "@/lib/constants";

export const revalidate = 21600;

export function generateStaticParams() {
  return SCREEN_SIZES.map((s) => ({ size: s.slug }));
}

function getOption(slug: string) {
  return SCREEN_SIZES.find((s) => s.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ size: string }>;
}): Promise<Metadata> {
  const { size } = await params;
  const opt = getOption(size);
  if (!opt) return {};
  return {
    title: `Mobile Phones with ${opt.label} Screen in Pakistan`,
    description: `Browse mobile phones with a ${opt.label} display size, prices and full specifications.`,
    alternates: { canonical: `/screen/${opt.slug}` },
  };
}

export default async function ScreenPage({
  params,
  searchParams,
}: {
  params: Promise<{ size: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { size } = await params;
  const { page: pageParam } = await searchParams;
  const opt = getOption(size);
  if (!opt) notFound();

  const page = Number(pageParam ?? "1") || 1;
  const limit = 96;
  const { phones, total } = await filterPhones({
    displayMin: opt.min,
    displayMax: opt.max,
    page,
    limit,
  });

  return (
    <PageShell>
      <CategoryPageContent
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Screen Size" },
          { label: opt.label },
        ]}
        title={`Mobile Phones with ${opt.label} Screen in Pakistan`}
        description={`Compare mobile phones with a ${opt.label.toLowerCase()} display in Pakistan, with prices and full specifications.`}
        phones={phones}
        total={total}
        page={page}
        limit={limit}
        basePath={`/screen/${opt.slug}`}
      />
    </PageShell>
  );
}
