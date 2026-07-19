'use server';

import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { triggerRevalidate } from '@/lib/revalidate';
import { sanitizeRichText } from '@/lib/sanitize';
import {
  phoneExtendedSpecsSchema,
  type PhoneExtendedSpecsFormValues,
} from '@/lib/validation/phoneExtendedSpecs';

export async function savePhoneExtendedSpecs(
  phoneId: string,
  slug: string,
  values: PhoneExtendedSpecsFormValues
) {
  await requireRole(['admin', 'editor']);
  const parsed = phoneExtendedSpecsSchema.parse(values);

  // Sanitize every rich-text field the same way overview/description
  // already are — this is admin-entered HTML from Tiptap, same trust
  // boundary, same treatment.
  const sanitized = Object.fromEntries(
    Object.entries(parsed).map(([key, value]) => [key, value ? sanitizeRichText(value) : null])
  );

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('phone_extended_specs')
    .upsert({ phone_id: phoneId, ...sanitized }, { onConflict: 'phone_id' });

  if (error) throw new Error(error.message);
  await triggerRevalidate([`/phone/${slug}`]);
}