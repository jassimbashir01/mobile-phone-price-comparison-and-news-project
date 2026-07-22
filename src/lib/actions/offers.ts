'use server';

import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { pingIndexNow, triggerRevalidate } from '@/lib/revalidate';
import { offerSchema, type OfferFormValues } from '@/lib/validation/offer';

function nullifyUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj };
  for (const key in out) {
    if (out[key] === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      out[key] = null as any;
    }
  }
  return out;
}

export async function createOffer(values: OfferFormValues, imagePublicId: string | null) {
  await requireRole(['admin', 'editor']);
  const parsed = offerSchema.parse(values);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('offers')
    .insert(nullifyUndefined({ ...parsed, image_public_id: imagePublicId }))
    .select()
    .single();

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/offers']);
  await pingIndexNow(['/offers']);
  return data;
}

export async function updateOffer(id: string, values: OfferFormValues, imagePublicId: string | null) {
  await requireRole(['admin', 'editor']);
  const parsed = offerSchema.parse(values);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('offers')
    .update(nullifyUndefined({ ...parsed, image_public_id: imagePublicId }))
    .eq('id', id);

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/offers']);
  await pingIndexNow(['/offers']);
}

export async function deleteOffer(id: string) {
  await requireRole(['admin']);
  const supabase = createAdminClient();
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await triggerRevalidate(['/offers']);
}