'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-lg border border-border bg-white px-3 py-2 text-left text-sm text-ink/70 hover:border-primary hover:text-primary"
    >
      Log Out
    </button>
  );
}