import { Sidebar } from './Sidebar';
import { AdSlot } from '@/components/ads/AdSlot';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
      <div className="flex w-full shrink-0 flex-col gap-4 lg:sticky lg:top-4 lg:h-fit lg:w-64">
        <AdSlot slot="sidebar-top" />
        <Sidebar />
        <AdSlot slot="sidebar-bottom" />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}