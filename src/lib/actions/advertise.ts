'use server';

import { advertiseInquirySchema, type AdvertiseInquiryValues } from '@/lib/validation/advertise';
import { createAdminClient } from '@/lib/supabase/admin';

export async function submitAdvertiseInquiry(
  values: AdvertiseInquiryValues
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = advertiseInquirySchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from('contact_messages').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: `[Advertising Inquiry — ${parsed.data.placement}]\nCompany: ${parsed.data.company}\n\n${parsed.data.message}`,
    inquiry_type: 'advertising',
  });

  if (error) {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }

  return { success: true };
}