/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { pingIndexNow, triggerRevalidate } from '@/lib/revalidate';
import { phoneSchema, type PhoneFormValues } from '@/lib/validation/phone';
import type { ManagedImage } from '@/components/admin/ImageUploader';

function nullifyUndefined<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj };
  for (const key in out) {
    if (out[key] === undefined) out[key] = null as any;
  }
  return out;
}

function splitPhoneAndSpecs(parsed: PhoneFormValues) {
  const {
    network_type, os, ram_gb, storage_gb, display_size, main_camera_mp, battery_mah,
    processor, display_type, bluetooth, wifi, dual_sim, fm_radio, memory_card, mp3,
    video_recording, has_camera, ...phoneFields
  } = parsed;

  return {
    phoneFields: nullifyUndefined(phoneFields),
    specFields: nullifyUndefined({
      network_type, os, ram_gb, storage_gb, display_size, main_camera_mp, battery_mah,
      processor, display_type, bluetooth, wifi, dual_sim, fm_radio, memory_card, mp3,
      video_recording, has_camera,
    }),
  };
}

export async function createPhone(values: PhoneFormValues) {
  await requireRole(['admin', 'editor']);
  const parsed = phoneSchema.parse(values);
  const { phoneFields, specFields } = splitPhoneAndSpecs(parsed);

  const supabase = createAdminClient();

  const { data: phone, error: phoneError } = await supabase
    .from('phones')
    .insert(phoneFields)
    .select()
    .single();
  if (phoneError) throw new Error(phoneError.message);

  // Note: two sequential writes, not one DB transaction — supabase-js
  // doesn't support cross-table transactions over REST without a custom
  // Postgres RPC function. Fine for a single-operator admin tool; if you
  // add concurrent editors later, consider wrapping this in an RPC.
  const { error: specsError } = await supabase.from('phone_specs').insert({
    phone_id: phone.id,
    ...specFields,
  });
  if (specsError) throw new Error(specsError.message);

  await triggerRevalidate(['/', `/phone/${parsed.slug}`]);
  await pingIndexNow(['/', `/phone/${parsed.slug}`]);
  return phone;
}

export async function updatePhone(id: string, values: PhoneFormValues) {
  await requireRole(['admin', 'editor']);
  const parsed = phoneSchema.parse(values);
  const { phoneFields, specFields } = splitPhoneAndSpecs(parsed);

  const supabase = createAdminClient();

  const { error: phoneError } = await supabase.from('phones').update(phoneFields).eq('id', id);
  if (phoneError) throw new Error(phoneError.message);

  const { error: specsError } = await supabase
    .from('phone_specs')
    .upsert({ phone_id: id, ...specFields }, { onConflict: 'phone_id' });
  if (specsError) throw new Error(specsError.message);

  await triggerRevalidate(['/', `/phone/${parsed.slug}`]);
  await pingIndexNow(['/', `/phone/${parsed.slug}`]);
}

export async function deletePhone(id: string, slug: string) {
  await requireRole(['admin']);
  const supabase = createAdminClient();
  const { error } = await supabase.from('phones').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await triggerRevalidate(['/', `/phone/${slug}`]);
}

// Replaces the phone's entire image set. Simplest correct approach given
// the ImageUploader already manages the full ordered array client-side.
export async function savePhoneImages(phoneId: string, images: ManagedImage[], slug: string) {
  await requireRole(['admin', 'editor']);
  const supabase = createAdminClient();

  const { error: deleteError } = await supabase.from('phone_images').delete().eq('phone_id', phoneId);
  if (deleteError) throw new Error(deleteError.message);

  if (images.length > 0) {
    const { error: insertError } = await supabase.from('phone_images').insert(
      images.map((img, i) => ({
        phone_id: phoneId,
        cloudinary_public_id: img.cloudinary_public_id,
        is_primary: img.is_primary,
        sort_order: i,
      }))
    );
    if (insertError) throw new Error(insertError.message);
  }

  await triggerRevalidate([`/phone/${slug}`]);
}

export async function setSponsored(id: string, isSponsored: boolean, slug: string) {
  await requireRole(['admin', 'editor']);
  const supabase = createAdminClient();
  const { error } = await supabase.from('phones').update({ is_sponsored: isSponsored }).eq('id', id);
  if (error) throw new Error(error.message);
  await triggerRevalidate(['/', `/phone/${slug}`]);
}