import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CategoryPageContent } from "@/components/category/CategoryPageContent";
import { filterPhones } from "@/queries/phones";
import { CAMERA_OPTIONS } from "@/lib/constants";

export const revalidate = 21600;

export function generateStaticParams() {
  return CAMERA_OPTIONS.map((c) => ({ mp: c.slug }));
}

function getOption(slug: string) {
  return CAMERA_OPTIONS.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mp: string }>;
}): Promise<Metadata> {
  const { mp } = await params;
  const opt = getOption(mp);
  if (!opt) return {};
  return {
    title: `${opt.label} Camera Mobile Phones in Pakistan`,
    description: `Browse mobile phones with ${opt.label} camera in Pakistan, prices and full specifications.`,
    alternates: { canonical: `/camera/${opt.slug}` },
  };
}

export default async function CameraPage({
  params,
  searchParams,
}: {
  params: Promise<{ mp: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { mp } = await params;
  const { page: pageParam } = await searchParams;
  const opt = getOption(mp);
  if (!opt) notFound();

  const page = Number(pageParam ?? "1") || 1;
  const limit = 24;
  const { phones, total } = await filterPhones(
    opt.slug === "without-camera"
      ? { cameraNone: true, page, limit }
      : { cameraMin: opt.min, cameraMax: opt.max, page, limit },
  );

  return (
    <PageShell>
      <CategoryPageContent
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Camera" },
          { label: opt.label },
        ]}
        title={`${opt.label} Camera Mobile Phones in Pakistan`}
        description={`Compare mobile phones with a ${opt.label.toLowerCase()} camera in Pakistan, with prices and full specifications.`}
        phones={phones}
        total={total}
        page={page}
        limit={limit}
        basePath={`/camera/${opt.slug}`}
      />
    </PageShell>
  );
}
