import { SettingsForm } from "@/components/admin/SettingsForm";
import { getAllBrandsAdmin } from "@/queries/admin";
import {
  getExchangeRate,
  getSocialLinks,
  getMediaKitStats,
  getHomepageBanner,
  getSidebarBanner,
  getFooterBrandIds,
} from "@/queries/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [
    rate,
    socialLinks,
    mediaKitStats,
    homepageBanner,
    sidebarBanner,
    initialFooterBrands,
    allBrands,
  ] = await Promise.all([
    getExchangeRate(),
    getSocialLinks(),
    getMediaKitStats(),
    getHomepageBanner(),
    getSidebarBanner(),
    getFooterBrandIds(),
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
        initialFooterBrands={initialFooterBrands}
        allBrands={allBrands}
      />
    </div>
  );
}
