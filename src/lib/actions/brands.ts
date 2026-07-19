'use server';

import { requireRole } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { pingIndexNow, triggerRevalidate } from '@/lib/revalidate';
import { brandSchema, type BrandFormValues } from '@/lib/validation/brand';

export async function createBrand(values: BrandFormValues) {
  await requireRole(['admin', 'editor']);
  const parsed = brandSchema.parse(values);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('brands')
    .insert({ ...parsed, logo_url: parsed.logo_url || null })
    .select()
    .single();

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/', `/brand/${parsed.slug}`]);
  return data;
}

export async function updateBrand(id: string, values: BrandFormValues) {
  await requireRole(['admin', 'editor']);
  const parsed = brandSchema.parse(values);

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('brands')
    .update({ ...parsed, logo_url: parsed.logo_url || null })
    .eq('id', id);

  if (error) throw new Error(error.message);
  await triggerRevalidate(['/', `/brand/${parsed.slug}`]);
  await pingIndexNow(['/', `/phone/${parsed.slug}`]);
}

export async function deleteBrand(id: string, slug: string) {
  await requireRole(['admin']); // editors cannot delete
  const supabase = createAdminClient();
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw new Error(error.message);
  await triggerRevalidate(['/', `/brand/${slug}`]);
}