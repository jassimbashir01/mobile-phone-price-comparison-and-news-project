import { Sidebar } from './Sidebar';
import { SidebarBanner } from './SidebarBanner';
import { AdSlot } from '@/components/ads/AdSlot';
import { getSidebarBanner } from '@/queries/settings';

export async function PageShell({ children }: { children: React.ReactNode }) {
  const sidebarBanner = await getSidebarBanner();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
      <div className="hidden shrink-0 flex-col gap-4 lg:sticky lg:top-4 lg:flex lg:h-fit lg:w-64">
        <AdSlot slot="sidebar-top" />
        <SidebarBanner banner={sidebarBanner} />
        <Sidebar />
        <AdSlot slot="sidebar-bottom" />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}