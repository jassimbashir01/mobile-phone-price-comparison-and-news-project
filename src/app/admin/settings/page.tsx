import { SettingsForm } from '@/components/admin/SettingsForm';
import { getExchangeRate, getSocialLinks, getMediaKitStats, getHomepageBanner } from '@/queries/settings';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const [rate, socialLinks, mediaKitStats, homepageBanner] = await Promise.all([
    getExchangeRate(),
    getSocialLinks(),
    getMediaKitStats(),
    getHomepageBanner(),
  ]);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Settings</h1>
      <SettingsForm
        initialRate={rate}
        initialSocialLinks={socialLinks}
        initialMediaKitStats={mediaKitStats}
        initialHomepageBanner={homepageBanner}
      />
    </div>
  );
}