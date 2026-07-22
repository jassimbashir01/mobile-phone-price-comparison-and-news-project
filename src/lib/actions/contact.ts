'use server';

import { contactSchema, type ContactFormValues } from '@/lib/validation/contact';
import { createAdminClient } from '@/lib/supabase/admin';
import { isRateLimited } from '@/lib/rateLimit';

export async function submitContactForm(
  values: ContactFormValues
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }
  if (isRateLimited(parsed.data.email)) {
    return { success: false, error: 'Too many submissions. Please try again later.' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('contact_messages').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    inquiry_type: parsed.data.inquiry_type,
  });

  if (error) {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }

  return { success: true };
}