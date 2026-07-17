import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUserProfile } from '@/lib/auth';
import { LogoutButton } from '@/components/admin/LogoutButton';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/phones', label: 'Phones' },
  { href: '/admin/brands', label: 'Brands' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/featured', label: 'Featured' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/offers', label: 'Offers' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
      <aside className="w-56 shrink-0">
        <div className="mb-4 rounded-lg border border-border bg-white p-3">
          <p className="text-xs text-ink/50">Signed in as</p>
          <p className="truncate text-sm font-semibold">{profile.full_name ?? 'Admin'}</p>
          <span className="mt-1 inline-block rounded bg-primary-light px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary-dark">
            {profile.role}
          </span>
        </div>
        <nav className="space-y-1 rounded-lg border border-border bg-white p-2 text-sm">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 hover:bg-primary-light">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-2">
          <LogoutButton />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}