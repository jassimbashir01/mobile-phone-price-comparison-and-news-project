import { getHomepageSectionsAdmin } from '@/queries/admin';
import { FeaturedSectionEditor } from '@/components/admin/FeaturedSectionEditor';

export const dynamic = 'force-dynamic';

export default async function AdminFeaturedPage() {
  const sections = await getHomepageSectionsAdmin();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Featured Sections</h1>
      <p className="mb-6 text-sm text-ink/60">
        Pick up to 6 phones per homepage section. Order matters — the first
        slot appears first on the homepage.
      </p>
      {sections.map((s) => (
        <FeaturedSectionEditor
          key={s.section_key}
          sectionKey={s.section_key}
          title={s.title ?? s.section_key}
          initialPhones={s.phones}
        />
      ))}
    </div>
  );
}