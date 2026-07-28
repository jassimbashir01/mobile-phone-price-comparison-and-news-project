import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { CategoryPageContent } from "@/components/category/CategoryPageContent";
import { filterPhones } from "@/queries/phones";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "5G Mobile Phones in Pakistan",
  description:
    "Browse 5G mobile phones in Pakistan with prices and full specifications.",
  alternates: { canonical: "/mobiles/5g-phones" },
};

export default async function FiveGPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1") || 1;
  const limit = 96;
  const { phones, total } = await filterPhones({
    networkType: "5G",
    page,
    limit,
  });

  return (
    <PageShell>
      <CategoryPageContent
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Network" },
          { label: "5G Phones" },
        ]}
        title="5G Mobile Phones in Pakistan"
        description="Compare 5G mobile phones available in Pakistan, with prices and full specifications."
        phones={phones}
        total={total}
        page={page}
        limit={limit}
        basePath="/mobiles/5g-phones"
      />
    </PageShell>
  );
}
