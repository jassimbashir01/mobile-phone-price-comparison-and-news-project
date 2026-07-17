import { SettingsForm } from '@/components/admin/SettingsForm';
import { getAllBrandsAdmin } from '@/queries/admin';
import {
  getExchangeRate,
  getSocialLinks,
  getMediaKitStats,
  getHomepageBanner,
  getSidebarBanner,
  getBrandShowcase,
} from '@/queries/settings';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const [rate, socialLinks, mediaKitStats, homepageBanner, sidebarBanner, brandShowcase, allBrands] =
    await Promise.all([
      getExchangeRate(),
      getSocialLinks(),
      getMediaKitStats(),
      getHomepageBanner(),
      getSidebarBanner(),
      getBrandShowcase(),
      getAllBrandsAdmin(),
    ]);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Settings</h1>
      <SettingsForm
        initialRate={rate}
        initialSocialLinks={socialLinks}
        initialMediaKitStats={mediaKitStats}
        initialHomepageBanner={homepageBanner}
        initialSidebarBanner={sidebarBanner}
        initialBrandShowcase={brandShowcase.setting}
        allBrands={allBrands}
      />
    </div>
  );
}