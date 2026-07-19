'use server';

import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export async function markMessageRead(id: string, isRead: boolean) {
  await requireRole(['admin', 'editor']);
  const supabase = createAdminClient();
  const { error } = await supabase.from('contact_messages').update({ is_read: isRead }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteMessage(id: string) {
  await requireRole(['admin']);
  const supabase = createAdminClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw new Error(error.message);
}