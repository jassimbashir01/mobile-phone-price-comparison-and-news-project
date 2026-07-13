import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { Brand } from '@/types/database';

export const getActiveBrands = cache(async (): Promise<Brand[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw new Error(`getActiveBrands: ${error.message}`);
  return data ?? [];
});

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw new Error(`getBrandBySlug: ${error.message}`);
  return data;
}

export async function getAllBrandSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('brands').select('slug').eq('is_active', true);
  if (error) throw new Error(`getAllBrandSlugs: ${error.message}`);
  return (data ?? []).map((b) => b.slug);
}