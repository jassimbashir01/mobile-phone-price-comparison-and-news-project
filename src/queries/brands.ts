import { cache } from 'react';
import { supabase } from '@/lib/supabase/public';
import type { Brand } from '@/types/database';

export const getActiveBrands = cache(async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw new Error(`getActiveBrands: ${error.message}`);
  return data ?? [];
});

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
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
  const { data, error } = await supabase.from('brands').select('slug').eq('is_active', true);
  if (error) throw new Error(`getAllBrandSlugs: ${error.message}`);
  return (data ?? []).map((b) => b.slug);
}