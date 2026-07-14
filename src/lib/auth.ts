import { createClient } from '@/lib/supabase/server';
import type { UserProfile, UserRole } from '@/types/database';

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return profile;
}

// Used inside server actions to enforce role checks server-side,
// not just hide/show buttons in the UI.
export async function requireRole(allowed: UserRole[]): Promise<UserProfile> {
  const profile = await getCurrentUserProfile();
  if (!profile || !allowed.includes(profile.role)) {
    throw new Error('Not authorized');
  }
  return profile;
}