import { getHomepageSectionsAdmin } from "@/queries/admin";
import { FeaturedSectionEditor } from "@/components/admin/FeaturedSectionEditor";
import {
  HOMEPAGE_PRICE_RANGES,
  homepagePriceSectionKey,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminFeaturedPage() {
  const sections = await getHomepageSectionsAdmin();
  const priceSectionKeys = new Set(
    HOMEPAGE_PRICE_RANGES.map(homepagePriceSectionKey),
  );

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Featured Sections</h1>
      <p className="mb-6 text-sm text-ink/60">
        Pick up to 6 phones per section. Unpinned slots auto-fill automatically
        — price sections with the latest phones in that bracket, Latest Phones
        and Coming Soon with the newest matching phones. Pin a specific phone
        only where you want to override the automatic pick.
      </p>
      {sections.map((s) => (
        <FeaturedSectionEditor
          key={s.section_key}
          sectionKey={s.section_key}
          title={s.title ?? s.section_key}
          initialPhones={s.phones}
          isPriceSection={priceSectionKeys.has(s.section_key)}
        />
      ))}
    </div>
  );
}
