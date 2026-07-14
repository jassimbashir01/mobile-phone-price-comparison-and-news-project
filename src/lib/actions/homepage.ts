'use server';

import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { triggerRevalidate } from '@/lib/revalidate';

export async function updateHomepageSection(sectionKey: string, phoneIds: string[]) {
  await requireRole(['admin', 'editor']);
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('homepage_sections')
    .update({ phone_ids: phoneIds })
    .eq('section_key', sectionKey);
  if (error) throw new Error(error.message);
  await triggerRevalidate(['/']);
}